"use server";

import { ITag } from "@/mongodb";
import Tag from "@/mongodb/tag.model";

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
