"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import User from "@/mongodb/user.model";

interface CreateAnswerParams {
  body: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export async function createAnswer(params: CreateAnswerParams) {
  connectToDB();

  try {
    const { body, author, question, path } = params;

    // Create the answer
    const newAnswer = await Answer.create({
      body,
      author,
      question,
    });

    // Add the answer to the user's answersGiven array
    await User.findByIdAndUpdate(author, {
      $push: { answersGiven: newAnswer._id },
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
  sortBy?: "highestUpvotes" | "lowestUpvotes" | "recent" | "old";
  limit?: number;
  skip?: number;
}

export async function getAnswers({
  questionId,
  sortBy = "highestUpvotes", // Default to highestUpvotes
  limit = 10, // Default limit
  skip = 0, // Default skip
}: GetAnswersParams) {
  try {
    connectToDB();

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
      .skip(skip) // Use the skip parameter
      .limit(limit)
      .populate({
        path: "author",
        select: "_id name picture",
      });

    // Check if there are more answers beyond the current set
    const totalAnswersCount = await Answer.countDocuments({
      question: questionId,
    });
    const isNext = totalAnswersCount > skip + limit;

    return {
      answers,
      isNext, // Renamed from moreAnswersAvailable
    };
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
}

interface VoteParams {
  itemId: string; // Question or Answer ID
  userId: string;
  path: string;
}

export async function upvoteAnswer(params: VoteParams) {
  const { itemId, userId, path } = params;

  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(itemId, {
      $inc: { upvotes: 1 },
    });

    if (updatedAnswer) {
      await User.findByIdAndUpdate(userId, {
        $push: { upvotedAnswers: itemId },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error upvoting answer:", error);
    return false;
  }
}

export async function downvoteAnswer(params: VoteParams) {
  const { itemId, userId, path } = params;

  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(itemId, {
      $inc: { upvotes: -1 },
    });

    if (updatedAnswer) {
      await User.findByIdAndUpdate(userId, {
        $pull: { upvotedAnswers: itemId },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error downvoting answer:", error);
    return false;
  }
}
