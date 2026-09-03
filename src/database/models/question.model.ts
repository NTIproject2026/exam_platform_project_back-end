import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";
import { paranoidFunction } from "../hooks";

export interface IQuestion {
  id?: Types.ObjectId;
  quizId: Types.ObjectId;
  question: string;
  multipleAnswer: boolean;
  createdAt?: Date;
  createdBy?: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}
export interface IAnswer {
  id?: Types.ObjectId;
  question_id: Types.ObjectId;
  answer: string;
  correct: boolean;
  createdAt?: Date;
  createdBy?: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

export const QuestionSchema = new Schema<IQuestion>(
  {
    quizId: { type: Types.ObjectId, ref: "quizzes", required: true },
    question: { type: String, required: true },
    multipleAnswer: { type: Boolean, default: false },
    createdAt: { type: Date },
    createdBy: { type: Types.ObjectId },
    updatedAt: { type: Date },
    updatedBy: { type: Types.ObjectId },
    deletedAt: { type: Date },
    deletedBy: { type: Types.ObjectId },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
  },
);
QuestionSchema.virtual("answers", {
  ref: "answers",
  localField: "_id",
  foreignField: "question_id",
});
export const AnswerSchema = new Schema<IAnswer>(
  {
    question_id: { type: Types.ObjectId, ref: "questions" },
    answer: { type: String },
    correct: { type: Boolean, default: false },
    createdAt: { type: Date },
    createdBy: { type: Types.ObjectId },
    updatedAt: { type: Date },
    updatedBy: { type: Types.ObjectId },
    deletedAt: { type: Date },
    deletedBy: { type: Types.ObjectId },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
  },
);

paranoidFunction(QuestionSchema);
paranoidFunction(AnswerSchema);

export type HydratedQuestionDoc = HydratedDocument<IQuestion>;
export type HydratedAnswerDoc = HydratedDocument<IAnswer>;

export const QuestionModel =
  mongoose.models.questions || mongoose.model("questions", QuestionSchema);
export const answerModel =
  mongoose.models.answers || mongoose.model("answers", AnswerSchema);
