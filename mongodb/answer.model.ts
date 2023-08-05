import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
  body: string;
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  upvotes: number;
  createdAt: Date;
}

const AnswerSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
