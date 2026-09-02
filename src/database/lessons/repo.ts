import { LessonModel } from "./model.js";

export function createLesson(data: {
  title: string;
  content?: string;
  videoUrl?: string;
  module: string;
  order: number;
}) {
  return LessonModel.create(data);
}

export function findLessonsByModule(moduleId: string) {
  return LessonModel.find({ module: moduleId }).sort({ order: 1 });
}

export function findLessonById(id: string) {
  return LessonModel.findById(id);
}

export function updateLesson(id: string, data: Partial<{
  title: string;
  content: string;
  videoUrl: string;
  order: number;
}>) {
  return LessonModel.findByIdAndUpdate(id, data, { new: true });
}

export function deleteLesson(id: string) {
  return LessonModel.findByIdAndDelete(id);
}

export function countLessonsByModules(moduleIds: string[]) {
  return LessonModel.countDocuments({ module: { $in: moduleIds } });
}