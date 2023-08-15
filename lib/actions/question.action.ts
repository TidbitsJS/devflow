"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery, Schema } from "mongoose";

import { IUser } from "@/mongodb";
import { connectToDB } from "../mongoose";

import User from "@/mongodb/user.model";
import Question from "@/mongodb/question.model";
import Tag from "@/mongodb/tag.model";
import Answer from "@/mongodb/answer.model";

interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filterTags?: string[];
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDB();

    const { page = 1, pageSize = 20, searchQuery, filterTags } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { body: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    if (filterTags && filterTags.length > 0) {
      query.tags = { $in: filterTags };
    }

    const totalQuestions = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .populate("tags")
      .populate("author")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalQuestions / pageSize);

    return { questions, totalPages };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

interface CreateQuestionParams {
  title: string;
  body: string;
  tags: Array<string>;
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDB();

    const { title, body, tags, author, path } = params;
    console.log(path);

    // Create the question
    const question = await Question.create({
      title,
      body,
      author,
    });

    const tagDocuments = [];

    // Create or retrieve tag documents
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questionsCount: 1 } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // Update the question's tags field using $push and $each
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Update the user's questionsAsked field
    await User.findByIdAndUpdate(author, {
      $push: { questionsAsked: question._id },
    });

    revalidatePath(path);
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
