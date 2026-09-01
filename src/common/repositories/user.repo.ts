import baseRepo from "./base.repo.js";
import { userModel, type IUser } from "../../modules/auth/auth.model.js";
import type { Model } from "mongoose";
import mongoose from "mongoose";

class userRepo extends baseRepo<IUser> {
  constructor(
    protected readonly _model: Model<IUser> = mongoose.models.users!,
  ) {
    super(_model);
  }
}

export default new userRepo();
