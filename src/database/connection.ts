import mongoose from "mongoose";
import { internalServerException } from "../common/response/app.error.js";
import { DB_URI } from "../config/config.js";

export async function connectTodDataBase() {
  await mongoose
    .connect(DB_URI!)
    .then(() => console.log("connected to database"))
    .catch((err) => internalServerException());
}
