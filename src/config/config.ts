import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve(".env.dev") });

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;