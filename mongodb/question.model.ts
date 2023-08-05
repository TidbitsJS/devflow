import { Schema, models, model, Document } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  body: string;
  tags: string[];
  author: Schema.Types.ObjectId;
  upvotes: number;
  views: number;
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
