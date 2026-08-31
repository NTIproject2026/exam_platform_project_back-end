import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve(".env.dev") });

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;