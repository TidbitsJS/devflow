"use server";

import { connectToDB } from "../mongoose";

import Question from "@/mongodb/question.model";
import Interaction from "@/mongodb/interaction.model";

import { ViewQuestionParams } from "./shared.types";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDB();

    const { questionId, userId } = params;

    // Get the question and its tags
    const question = await Question.findById(questionId);

    if (!question) {
      console.log("Question not found");
      return;
    }

    // Update the view count for the question
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    // Check if the user has already viewed the question
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        console.log("User has already viewed this question");
        return;
      }

      // Create an Interaction record for the user's view action with all question tags
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
        tags: question.tags,
      });
    }

    console.log("Question view incremented successfully");
  } catch (error) {
    console.error("Error viewing question:", error);
    throw error;
  }
}
