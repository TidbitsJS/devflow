"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import { IUser } from "@/mongodb";
import { connectToDB } from "../mongoose";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import User from "@/mongodb/user.model";

import Interaction from "@/mongodb/interaction.model";
import Tag from "@/mongodb/tag.model";

interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDB();

    const newUser = await User.create(userData);
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
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
}

interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDB();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { createdAt: -1 };
        break;

      case "old_users":
        sortOptions = { createdAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        // No specific filter
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDB();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // Remove the question from the saved list
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // Add the question to the saved list
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error toggling saved question:", error);
    throw error;
  }
}

interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDB();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;

      case "oldest":
        sortOptions = { createdAt: 1 };
        break;

      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;

      case "most_viewed":
        sortOptions = { views: -1 };
        break;

      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        // No specific filter
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: (page - 1) * pageSize,
        limit: pageSize + 1, // Fetch one extra to determine if there is a next page
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Extract the saved questions from the user
    const savedQuestions = user.saved.slice(0, pageSize);

    // Calculate the isNext indicator
    const isNext = user.saved.length > pageSize;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.error("Error fetching saved questions:", error);
    throw error;
  }
}

interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

export async function getUserStats(params: GetUserStatsParams) {
  try {
    await connectToDB();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    // Get the user's questions count
    const totalQuestions = await Question.countDocuments({ author: userId });

    // Get the user's answers count
    const totalAnswers = await Answer.countDocuments({ author: userId });

    // Get the user's questions sorted by popularity (views + upvotes)
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    // Get the user's answers sorted by popularity (upvotes)
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "question",
        select: "_id title",
      })
      .populate("author", "_id clerkId name picture");

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return {
      totalQuestions: totalQuestions || 0,
      totalAnswers: totalAnswers || 0,
      questions: userQuestions,
      answers: userAnswers,
      isNext,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
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

    // get user question ids
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    // Delete all questions asked by the user
    await Question.deleteMany({ author: user._id });

    // Delete all answers given by the user
    await Answer.deleteMany({ author: user._id });

    // Delete the answers created by other users on questions created by the user
    await Answer.deleteMany({ question: { $in: userQuestionIds } });

    // Remove user reference from upvotes and downvotes on questions
    await Question.updateMany(
      { upvotes: user._id },
      { $pull: { upvotes: user._id } }
    );

    await Question.updateMany(
      { downvotes: user._id },
      { $pull: { downvotes: user._id } }
    );

    // Remove user reference from upvotes and downvotes on answers
    await Answer.updateMany(
      { upvotes: user._id },
      { $pull: { upvotes: user._id } }
    );

    await Answer.updateMany(
      { downvotes: user._id },
      { $pull: { downvotes: user._id } }
    );

    // Delete interactions involving the user
    await Interaction.deleteMany({ user: user._id });

    // Update tags to remove references to the user's questions
    await Tag.updateMany(
      { questions: { $in: userQuestionIds } },
      { $pull: { questions: { $in: userQuestionIds } } }
    );

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// TODO: Interaction Recommendation?
