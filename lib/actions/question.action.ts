"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Tag from "@/mongodb/tag.model";
import User from "@/mongodb/user.model";
import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import Interaction from "@/mongodb/interaction.model";

import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDB();

    const { page = 1, pageSize = 20, searchQuery, filter } = params;

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;

      case "frequent":
        sortOptions = { views: -1 };
        break;

      case "unanswered":
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }

    const totalQuestions = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDB();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create or retrieve tag documents
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // Update the question's tags field using $push and $each
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an Interaction record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDB();

    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDB();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by +1/-1 for upvoting/revoking upvoting an question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : +1 },
    });

    // Increment question author's reputation by +10/-10 for receiving a upvote
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : +10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error upvoting question:", error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDB();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Decrement author's reputation by -1/+1 for downvoting/revoking downvoting a question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? +1 : -1 },
    });

    // Decrement question author's reputation by -2/+2 for receiving a downvote
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? +2 : -2 },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error downvoting question:", error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    await connectToDB();

    // Find top hot questions based on views and upvotes
    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 }) // Sort by views in descending order, then upvotes in descending order
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.error("Error fetching hot questions:", error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDB();

    const { questionId, path } = params;

    // Delete the question
    await Question.deleteOne({ _id: questionId });

    // Delete all answers associated with the question
    await Answer.deleteMany({ question: questionId });

    // Delete interactions related to the question
    await Interaction.deleteMany({ question: questionId });

    // Update tags to remove references to the deleted question
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDB();

    const { questionId, title, content, tags, path } = params;

    // Find the question to be edited
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    // Update question fields
    question.title = title;
    question.content = content;
    await question.save();

    const newTags = tags.map((tag: string) => tag.toLowerCase());
    const existingTags = question.tags.map((tag: any) =>
      tag.name.toLowerCase()
    );

    const tagUpdates = {
      tagsToAdd: [] as string[],
      tagsToRemove: [] as string[],
    };

    for (const tag of newTags) {
      if (!existingTags.includes(tag.toLowerCase())) {
        tagUpdates.tagsToAdd.push(tag);
      }
    }

    for (const tag of question.tags) {
      if (!newTags.includes(tag.name.toLowerCase())) {
        tagUpdates.tagsToRemove.push(tag._id);
      }
    }

    // Add new tags and link them to the question
    const newTagDocuments = [];

    for (const tag of tagUpdates.tagsToAdd) {
      const newTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      newTagDocuments.push(newTag._id);
    }

    console.log({ tagUpdates });

    // Remove question reference for tagsToRemove from the tag
    if (tagUpdates.tagsToRemove.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tagUpdates.tagsToRemove } },
        { $pull: { questions: question._id } }
      );
    }

    if (tagUpdates.tagsToRemove.length > 0) {
      await Question.findByIdAndUpdate(question._id, {
        $pull: { tags: { $in: tagUpdates.tagsToRemove } },
      });
    }

    if (newTagDocuments.length > 0) {
      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: { $each: newTagDocuments } },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error editing question:", error);
    throw error;
  }
}
