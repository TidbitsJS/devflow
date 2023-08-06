"use server";

import { connectToDB } from "../mongoose";
import { IUser, IQuestion, ITag } from "@/mongodb";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import Tag from "@/mongodb/tag.model";
import User from "@/mongodb/user.model";

import { getTrendingTags } from "./tag.action";

interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  portfolioWebsite?: string;
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDB();

    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

interface GetUserByIdParams {
  userId: string;
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDB();

    const { userId } = params;
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB();

    const { clerkId, updateData } = params;

    // Assuming "clerkId" is another field in the User model that you want to use for querying
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

interface DeleteUserParams {
  clerkId: string;
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDB();

    const { clerkId } = params;

    // Find the user by clerkId
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found.");
    }

    // Delete all questions asked by the user
    await Question.deleteMany({ author: user._id });

    // Delete all answers given by the user
    await Answer.deleteMany({ author: user._id });

    // Clear user references from upvotedQuestions and upvotedAnswers arrays of other users
    await User.updateMany(
      { _id: { $in: user.upvotedQuestions } },
      { $pull: { upvotedQuestions: user._id } }
    );

    await User.updateMany(
      { _id: { $in: user.upvotedAnswers } },
      { $pull: { upvotedAnswers: user._id } }
    );

    // Update the upvote count of each question and answer
    await Question.updateMany(
      { _id: { $in: user.upvotedQuestions } },
      { $inc: { upvotes: -1 } }
    );

    await Answer.updateMany(
      { _id: { $in: user.upvotedAnswers } },
      { $inc: { upvotes: -1 } }
    );

    // Delete tags created by the user
    await Tag.deleteMany({ author: user._id });

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

interface GetRecommendedQuestionsParams {
  clerkId: string;
  limit?: number;
}

export async function getRecommendedQuestions(
  params: GetRecommendedQuestionsParams
) {
  try {
    connectToDB();

    const { clerkId, limit = 5 } = params;

    // Get the user's interests
    const user = await User.findOne({ clerkId }).select(
      "tags viewedQuestions upvotedQuestions questionsAsked"
    );

    if (!user) {
      throw new Error("User not found.");
    }

    // Get the trending tags
    const trendingTags = await getTrendingTags({ limit });

    // Combine user interests and trending tags
    const combinedTags: Set<string> = new Set([
      ...user.tags,
      ...trendingTags.map((tag: ITag) => tag.name),
    ]);

    // Fetch questions based on user interests and trending tags, and rank by relevance score
    const relevantQuestions: IQuestion[] = await Question.find({
      tags: { $in: [...combinedTags] },
      _id: {
        $nin: [
          ...user.viewedQuestions,
          ...user.upvotedQuestions,
          ...user.questionsAsked,
        ],
      },
    })
      .sort({ upvotes: -1, views: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Filter out questions the user has already seen or upvoted
    const filteredQuestions: IQuestion[] = relevantQuestions.filter(
      (question) =>
        !user.viewedQuestions.includes(question._id) &&
        !user.upvotedQuestions.includes(question._id)
    );

    // Return the recommended questions
    return filteredQuestions;
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}
