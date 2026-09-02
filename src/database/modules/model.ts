import { Schema, model } from "mongoose";

const moduleSchema = new Schema(
  {
    title: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export const ModuleModel = model("Module", moduleSchema);