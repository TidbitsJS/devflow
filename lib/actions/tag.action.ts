"use server";

import Question from "@/mongodb/question.model";
import Tag, { ITag } from "@/mongodb/tag.model";
import User from "@/mongodb/user.model";
import { FilterQuery } from "mongoose";
import { connectToDB } from "../mongoose";

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: "popular" | "recent" | "old";
  searchQuery?: string;
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDB();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions: any = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        // No specific filter
        break;
    }

    const totalTags = await Tag.countDocuments(query);

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}

interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDB();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // Create a filter for the tag by ID
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    // Find the tag by ID and populate the questions field
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        skip: (page - 1) * pageSize,
        limit: pageSize + 1, // Fetch one extra to determine if there is a next page
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" }, // Populate the tags field of questions
        { path: "author", model: User, select: "_id name picture" }, // Populate the author field of questions
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Extract the list of questions from the tag
    const questions = tag.questions.slice(0, pageSize);

    // Calculate the isNext indicator
    const isNext = tag.questions.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.error("Error fetching questions by tag ID:", error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    await connectToDB();

    // Find the top five popular tags based on the number of questions
    const popularTags = await Tag.find()
      .sort({ questions: -1 }) // Sort by questions count in descending order
      .limit(5); // Limit the result to the top five tags

    return popularTags;
  } catch (error) {
    console.error("Error fetching top popular tags:", error);
    throw error;
  }
}
