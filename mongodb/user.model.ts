import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  location?: string;
  picture: string;
  portfolioWebsite?: string;
  reputation?: number;
  joinDate?: Date;
  questionsAsked?: Schema.Types.ObjectId[];
  answersGiven?: Schema.Types.ObjectId[];
  upvotedQuestions?: Schema.Types.ObjectId[];
  upvotedAnswers?: Schema.Types.ObjectId[];
  viewedQuestions?: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
  },
  picture: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  portfolioWebsite: {
    type: String,
  },
  reputation: {
    type: Number,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  questionsAsked: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  answersGiven: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  upvotedQuestions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  upvotedAnswers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  viewedQuestions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const User = models.User || model("User", UserSchema);

export default User;
