import { ModuleModel } from "./model.js";

export function createModule(data: { title: string; course: string; order: number }) {
  return ModuleModel.create(data);
}

export function findModulesByCourse(courseId: string) {
  return ModuleModel.find({ course: courseId }).sort({ order: 1 });
}

export function findModuleById(id: string) {
  return ModuleModel.findById(id);
}

export function updateModule(id: string, data: Partial<{ title: string; order: number }>) {
  return ModuleModel.findByIdAndUpdate(id, data, { new: true });
}

export function deleteModule(id: string) {
  return ModuleModel.findByIdAndDelete(id);
}