"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Answer from "@/mongodb/answer.model";
import Question from "@/mongodb/question.model";
import User from "@/mongodb/user.model";

interface CreateAnswerParams {
  body: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export async function createAnswer(params: CreateAnswerParams) {
  connectToDB();

  try {
    const { body, author, question, path } = params;

    // Create the answer
    const newAnswer = await Answer.create({
      body,
      author,
      question,
    });

    // Add the answer to the user's answersGiven array
    await User.findByIdAndUpdate(author, {
      $push: { answersGiven: newAnswer._id },
    });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.error("Error creating answer:", error);
    return null;
  }
}
