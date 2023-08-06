import { Schema } from "mongoose";

import User from "@/mongodb/user.model";
import { connectToDB } from "../mongoose";
import Question from "@/mongodb/question.model";
import { ITag, IUser } from "@/mongodb";
import Tag from "@/mongodb/tag.model";
import Answer from "@/mongodb/answer.model";

interface CreateQuestionParams {
  title: string;
  body: string;
  tags: Schema.Types.ObjectId[] | ITag[];
  author: Schema.Types.ObjectId | IUser;
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDB();

    const { title, body, tags, author } = params;
    const question = await Question.create({
      title,
      body,
      tags,
      author,
    });

    const user = await User.findByIdAndUpdate(
      author,
      { $push: { questionsAsked: question._id } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found.");
    }

    return question;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

interface UpdateQuestionParams {
  questionId: Schema.Types.ObjectId | string;
  updateData: Partial<CreateQuestionParams>;
}

export async function updateQuestion(params: UpdateQuestionParams) {
  try {
    connectToDB();

    const { questionId, updateData } = params;
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateData,
      {
        new: true,
      }
    );

    return updatedQuestion;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}

interface GetQuestionByIdParams {
  questionId: string;
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDB();

    const { questionId } = params;
    const question = await Question.findById(questionId);

    return question;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
}

interface DeleteQuestionParams {
  questionId: string;
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDB();

    const { questionId } = params;

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (deletedQuestion) {
      // Remove the deleted question's _id from questionsAsked array in the User model
      await User.findByIdAndUpdate(deletedQuestion.author, {
        $pull: { questionsAsked: deletedQuestion._id },
      });

      // Decrement questionsCount in the Tag model for each tag
      await Tag.updateMany(
        { _id: { $in: deletedQuestion.tags } },
        { $inc: { questionsCount: -1 } }
      );

      // Delete all answers associated with the deleted question
      await Answer.deleteMany({ _id: { $in: deletedQuestion.answers } });

      // Update the upvote count of each answer
      await Answer.updateMany(
        { _id: { $in: deletedQuestion.answers } },
        { $inc: { upvotes: -1 } }
      );

      // Remove references from other users' upvotedAnswers array
      await User.updateMany(
        { upvotedAnswers: { $in: deletedQuestion.answers } },
        { $pullAll: { upvotedAnswers: deletedQuestion.answers } }
      );
    }

    return deletedQuestion;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}
