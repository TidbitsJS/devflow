"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import Interaction from "@/mongodb/interaction.model";
import User from "@/mongodb/user.model";

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

    // Create an Interaction record for the user's answer action
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
    });

    // Increment author's reputation by +10 for creating an answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

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
        select: "_id clerkId name picture",
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
  path: string;
}

export async function upvoteAnswer(params: VoteParams) {
  try {
    await connectToDB();

    const { answerId, userId, path } = params;

    const answer = await Answer.findByIdAndUpdate(
      answerId,
      { $addToSet: { upvotes: userId }, $pull: { downvotes: userId } },
      { new: true }
    );

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Increment author's reputation by +2 for upvoting a answer
    await User.findByIdAndUpdate(userId, { $inc: { reputation: 2 } });

    // Increment answer author's reputation by +10 for receiving an upvote
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.error("Error upvoting answer:", error);
    throw error;
  }
}

export async function downvoteAnswer(params: VoteParams) {
  try {
    await connectToDB();

    const { answerId, userId, path } = params;

    const answer = await Answer.findByIdAndUpdate(
      answerId,
      { $addToSet: { downvotes: userId }, $pull: { upvotes: userId } },
      { new: true }
    );

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Decrement author's reputation by -2 for downvoting a answer
    await User.findByIdAndUpdate(userId, { $inc: { reputation: -2 } });

    // Decrement answer author's reputation by -2 for receiving a downvote
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: -2 } });

    revalidatePath(path);
  } catch (error) {
    console.error("Error downvoting answer:", error);
    throw error;
  }
}

interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    await connectToDB();

    const { answerId, path } = params;

    // Find the answer to be deleted
    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Delete the answer
    await Answer.deleteOne({ _id: answerId });

    // Remove the answer reference from its question
    await Question.updateOne(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    // Delete interactions related to the answer
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
}
