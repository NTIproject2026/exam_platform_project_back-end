import baseRepo from "./base.repo.js";
import type { Model } from "mongoose";
import mongoose from "mongoose";
import { IQuiz } from "../../database/models/quiz.model.js";

class quizRepo extends baseRepo<IQuiz> {
  constructor(
    protected readonly _model: Model<IQuiz> = mongoose.models.quizzes!,
  ) {
    super(_model);
  }
}

export default new quizRepo();
