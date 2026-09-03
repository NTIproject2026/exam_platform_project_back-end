import { Schema, model } from "mongoose";

const lessonSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
);

export const LessonModel = model("Lesson", lessonSchema);