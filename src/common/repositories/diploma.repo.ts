import baseRepo from "./base.repo.js";
import { type IDiploma } from "../../database/categories/model.js";
import type { Model } from "mongoose";
import mongoose from "mongoose";

class diplomaRepo extends baseRepo<IDiploma> {
  constructor(
    protected readonly _model: Model<IDiploma> = mongoose.models.diploma!,
  ) {
    super(_model);
  }
}

export default new diplomaRepo();
