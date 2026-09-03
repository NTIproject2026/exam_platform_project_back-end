import { ProgressModel } from "./model.js";

export function findProgress(student: string, course: string) {
  return ProgressModel.findOne({ student, course });
}

export function createProgress(student: string, course: string) {
  return ProgressModel.create({ student, course, completedLessons: [] });
}

export function markLessonComplete(student: string, course: string, lessonId: string) {
  return ProgressModel.findOneAndUpdate(
    { student, course },
    {
      $addToSet: { completedLessons: lessonId },
      $set: { lastLesson: lessonId },
    },
    { new: true, upsert: true },
  );
}