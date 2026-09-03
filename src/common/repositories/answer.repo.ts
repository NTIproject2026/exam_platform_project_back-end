import baseRepo from "./base.repo.js";
import type { Model } from "mongoose";
import mongoose from "mongoose";
import { IAnswer } from "../../modules/quiz/questions/question.model.js";

class answerRepo extends baseRepo<IAnswer> {
  constructor(
    protected readonly _model: Model<IAnswer> = mongoose.models.answers!,
  ) {
    super(_model);
  }
}

export default new answerRepo();
