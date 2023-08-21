"use server";

import { connectToDB } from "../mongoose";
import { IUser } from "@/mongodb";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import User from "@/mongodb/user.model";

import { FilterQuery } from "mongoose";
import Interaction from "@/mongodb/interaction.model";

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

    const newUser: IUser = await User.create(userData);
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
      case "reputation":
        sortOptions = { reputation: -1 };
        break;
      case "joinDate":
        sortOptions = { joinDate: 1 };
        break;
      default:
        // No specific filter
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments();
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
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB();

    const { clerkId, updateData } = params;

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

    // TODO: tag followers?

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// TODO: Interaction Recommendation?
