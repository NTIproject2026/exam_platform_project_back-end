import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve(".env.dev") });

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REDIS_CLIENT = process.env.REDIS_CLIENT;
export const MAIL_APP_PASSWORD = process.env.MAIL_APP_PASSWORD;
export const MAIL_APP_SENDER = process.env.REDIS_CLIENT;
