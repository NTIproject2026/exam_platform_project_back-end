import { Schema, model } from "mongoose";

const progressSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    lastLesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  },
  { timestamps: true },
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

export const ProgressModel = model("Progress", progressSchema);