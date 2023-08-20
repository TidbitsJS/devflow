"use server";

import { ITag } from "@/mongodb";
import Tag from "@/mongodb/tag.model";
import { FilterQuery } from "mongoose";
import { connectToDB } from "../mongoose";

interface GetTrendingTagsParams {
  limit: number;
}

export async function getTrendingTags(
  params: GetTrendingTagsParams
): Promise<ITag[]> {
  try {
    const { limit } = params;

    const trendingTags: ITag[] = await Tag.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
    ]).exec();

    return trendingTags;
  } catch (error) {
    console.error("Error getting trending tags:", error);
    throw error;
  }
}

interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
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

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments();
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}
