"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";

interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export async function createAnswer(params: CreateAnswerParams) {
  connectToDB();

  try {
    const { content, author, question, path } = params;

    // Create the answer
    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error creating answer:", error);
    return null;
  }
}

interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDB();

    const {
      questionId,
      sortBy = "highestUpvotes", // Default to highestUpvotes
      page = 1, // Default limit
      pageSize = 10, // Default skip
    } = params;

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .sort(sortOptions)
      .skip(skipAmount) // Use the skip parameter
      .limit(pageSize)
      .populate({
        path: "author",
        select: "_id name picture",
      });

    // Check if there are more answers beyond the current set
    const totalAnswersCount = await Answer.countDocuments({
      question: questionId,
    });

    const isNext = totalAnswersCount > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
}

interface VoteParams {
  answerId: string;
  userId: string;
}

export async function upvoteAnswer(params: VoteParams) {
  try {
    await connectToDB();

    const { answerId, userId } = params;

    const answer = await Answer.findByIdAndUpdate(
      answerId,
      { $addToSet: { upvotes: userId }, $pull: { downvotes: userId } },
      { new: true }
    );

    if (!answer) {
      throw new Error("Answer not found");
    }

    return answer;
  } catch (error) {
    console.error("Error upvoting answer:", error);
    throw error;
  }
}

export async function downvoteAnswer(params: VoteParams) {
  try {
    await connectToDB();

    const { answerId, userId } = params;

    const answer = await Answer.findByIdAndUpdate(
      answerId,
      { $addToSet: { downvotes: userId }, $pull: { upvotes: userId } },
      { new: true }
    );

    if (!answer) {
      throw new Error("Answer not found");
    }

    return answer;
  } catch (error) {
    console.error("Error downvoting answer:", error);
    throw error;
  }
}
