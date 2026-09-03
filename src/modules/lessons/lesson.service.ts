import {
  createLesson,
  findLessonsByModule,
  findLessonById,
  updateLesson,
  deleteLesson,
} from "../../database/lessons/repo.js";
import { internalServerException } from "../../common/response/app.error.js";

export async function addLesson(data: {
  title: string;
  content?: string;
  videoUrl?: string;
  module: string;
  order: number;
}) {
  return createLesson(data);
}

export async function getLessonsByModule(moduleId: string) {
  return findLessonsByModule(moduleId);
}

export async function editLesson(id: string, data: any) {
  const lesson = await updateLesson(id, data);
  if (!lesson) {
    internalServerException({ message: "lesson not found", statusCode: 404 });
    return;
  }
  return lesson;
}

export async function removeLesson(id: string) {
  const lesson = await deleteLesson(id);
  if (!lesson) {
    internalServerException({ message: "lesson not found", statusCode: 404 });
    return;
  }
  return lesson;
}