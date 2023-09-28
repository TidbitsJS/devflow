"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "@/mongodb/user.model";
import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import Interaction from "@/mongodb/interaction.model";

import {
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
  AnswerVoteParams,
} from "./shared.types";

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
    const updatedQuestion = await Question.findByIdAndUpdate(
      question,
      {
        $push: { answers: newAnswer._id },
      },
      { new: true }
    );

    // Create an Interaction record for the user's answer action
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: updatedQuestion.tags,
    });

    // Increment author's reputation by +10 for creating an answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.error("Error creating answer:", error);
    return null;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDB();

    const {
      questionId,
      sortBy = "highestUpvotes",
      page = 1,
      pageSize = 10,
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

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDB();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $addToSet: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Increment author's reputation by +2/-2 for upvoting/revoking upvoting a answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : +2 },
    });

    // Increment answer author's reputation by +10/-10 for receiving an upvote
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : +10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error upvoting answer:", error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDB();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $addToSet: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Decrement author's reputation by -2/+2 for downvoting/revoking downvoting a answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? +2 : -2 },
    });

    // Decrement answer author's reputation by -2/+2 for receiving a downvote
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? +2 : -2 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error downvoting answer:", error);
    throw error;
  }
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
    await Question.updateMany(
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
