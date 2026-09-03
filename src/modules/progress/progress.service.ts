import { findProgress, createProgress, markLessonComplete } from "./repo.js";
import { findModulesByCourse } from "../../database/modules/repo.js";
import { countLessonsByModules } from "../../database/lessons/repo.js";
import { internalServerException } from "../../common/response/app.error.js";

export async function completeLesson(studentId: string, courseId: string, lessonId: string) {
  return markLessonComplete(studentId, courseId, lessonId);
}

export async function getProgress(studentId: string, courseId: string) {
  let progress = await findProgress(studentId, courseId);
  if (!progress) {
    progress = await createProgress(studentId, courseId);
  }

  const modules = await findModulesByCourse(courseId);
  const moduleIds = modules.map((m) => m._id.toString());
  const totalLessons = await countLessonsByModules(moduleIds);

  const completedCount = progress.completedLessons.length;
  const percentage = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  return {
    completedLessons: progress.completedLessons,
    lastLesson: progress.lastLesson,
    totalLessons,
    completedCount,
    percentage,
  };
}