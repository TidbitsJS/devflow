"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery, Schema } from "mongoose";

import { IUser } from "@/mongodb";
import { connectToDB } from "../mongoose";

import Tag from "@/mongodb/tag.model";
import Question from "@/mongodb/question.model";
import Interaction from "@/mongodb/interaction.model";
import User from "@/mongodb/user.model";
import Answer from "@/mongodb/answer.model";

interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDB();

    const { page = 1, pageSize = 20, searchQuery } = params;

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDB();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create or retrieve tag documents
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // Update the question's tags field using $push and $each
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an Interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error creating question:", error);
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
    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
}

interface VoteParams {
  questionId: string;
  userId: string;
  path: string;
}

export async function upvoteQuestion(params: VoteParams) {
  try {
    await connectToDB();

    const { questionId, userId, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { $addToSet: { upvotes: userId }, $pull: { downvotes: userId } },
      { new: true }
    );

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error upvoting question:", error);
    throw error;
  }
}

export async function downvoteQuestion(params: VoteParams) {
  try {
    await connectToDB();

    const { questionId, userId, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { $addToSet: { downvotes: userId }, $pull: { upvotes: userId } },
      { new: true }
    );

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error downvoting question:", error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    await connectToDB();

    // Find top hot questions based on views and upvotes
    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 }) // Sort by views in descending order, then upvotes in descending order
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.error("Error fetching hot questions:", error);
    throw error;
  }
}

interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDB();

    const { questionId, path } = params;

    // Delete the question
    await Question.deleteOne({ _id: questionId });

    // Delete all answers associated with the question
    await Answer.deleteMany({ question: questionId });

    // Delete interactions related to the question
    await Interaction.deleteMany({ question: questionId });

    // Update tags to remove references to the deleted question
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}
