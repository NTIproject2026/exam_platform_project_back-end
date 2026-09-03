import mongoose from "mongoose";

import { DB_URI } from "../config/config.js";
import { InternalSererErrorException } from "../common/errors/message.error.js";

export async function connectTodDataBase() {
  await mongoose
    .connect(DB_URI!)
    .then(() => console.log("connected to database"))
    .catch((err) => InternalSererErrorException());
}
