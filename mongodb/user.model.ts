import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
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
    required: true,
  },
  bio: {
    type: String,
  },
  picture: {
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
});

const User = models.User || model("User", UserSchema);

export default User;
