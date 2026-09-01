import baseRepo from "./base.repo.js";
import type { Model } from "mongoose";
import mongoose from "mongoose";
import type { IQuiz } from "../../database/quizzes/model.js";

class quizrepo extends baseRepo<IQuiz> {
  constructor(
    protected readonly _model: Model<IQuiz> = mongoose.models.quizzes!!,
  ) {
    super(_model);
  }
}

export default new quizrepo();
