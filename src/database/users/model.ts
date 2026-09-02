import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
  },
  { timestamps: true },
);

export const UserModel = model("User", userSchema);