import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    duration: { type: Number, required: true }, // بالساعات
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const CourseModel = model("Course", courseSchema);