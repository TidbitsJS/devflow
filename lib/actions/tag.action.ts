"use server";

import Tag from "@/mongodb/tag.model";
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
