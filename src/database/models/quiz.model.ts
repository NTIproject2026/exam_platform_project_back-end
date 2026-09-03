import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";
import {
  AnswerSchema,
  QuestionSchema,
  type IAnswer,
  type IQuestion,
} from "../questions/question.model.js";
import { paranoidFunction } from "../hooks.js";

export interface IQuiz {
  id?: Types.ObjectId;
  diplomaId: Types.ObjectId;
  name: string;
  desc: string;
  time: number;
  img: string;
  quizType: string;
  createdAt?: Date;
  createdBy?: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

export interface IQuizAttempt {
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  time_started: Date;
  time_finished?: Date;
  time_spent?: Date;
  score_percentage?: number;
  correct_answers?: number;
  incorrect_answers?: number;
  createdAt?: Date;
  createdBy?: Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}
interface ISheet extends IQuestion {
  answers: IAnswer[];
}
export interface IQuizSnapShot {
  id?: Types.ObjectId;
  quizAttemptId: Types.ObjectId;
  sheet: Object;
}

export const QuizSchema = new Schema<IQuiz>(
  {
    diplomaId: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    time: { type: Number, required: true },
    img: { type: String, required: true },
    quizType: { type: String, required: true },
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
const snapShotSchema = new Schema<IQuizSnapShot>({
  quizAttemptId: { type: Types.ObjectId, required: true },
  sheet: {
    type: Array({
      questionId: { type: Types.ObjectId, required: true },
      answers: { type: AnswerSchema, required: true },
    }),
    required: true,
  },
});
const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Types.ObjectId, required: true, ref: "users" },
    quizId: { type: Types.ObjectId, required: true, ref: "quizzes" },
    time_started: { type: Date, required: true },
    time_finished: { type: Date },
    time_spent: { type: Date },
    score_percentage: { type: Number },
    correct_answers: { type: Number },
    incorrect_answers: { type: Number },
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

paranoidFunction(QuizSchema);
paranoidFunction(snapShotSchema);
paranoidFunction(QuizAttemptSchema);

export type HydratedQuizDoc = HydratedDocument<IQuiz>;

export type HydratedQuizAttemptDoc = HydratedDocument<IQuizAttempt>;
paranoidFunction(QuizSchema);
paranoidFunction(QuizAttemptSchema);
paranoidFunction(snapShotSchema);

export const quizModel =
  mongoose.models.quizzes || mongoose.model("quizzes", QuizSchema);

export const quizAttemptModel =
  mongoose.models.quizzesattempts ||
  mongoose.model("quizzesattempts", QuizAttemptSchema);

export const snapshotModel =
  mongoose.models.snapshots || mongoose.model("snapshots", snapShotSchema);
