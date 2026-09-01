import baseRepo from "./base.repo.js";
import type { Model } from "mongoose";
import mongoose from "mongoose";
import type { IQuestion } from "../../database/questions/question.model.js";

class questionRepo extends baseRepo<IQuestion> {
  constructor(
    protected readonly _model: Model<IQuestion> = mongoose.models.questions!,
  ) {
    super(_model);
  }
}

export default new questionRepo();
