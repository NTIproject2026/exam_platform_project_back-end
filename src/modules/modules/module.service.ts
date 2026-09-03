import {
  createModule,
  findModulesByCourse,
  findModuleById,
  updateModule,
  deleteModule,
} from "../../database/modules/repo.js";
import { internalServerException } from "../../common/response/app.error.js";

export async function addModule(data: { title: string; course: string; order: number }) {
  return createModule(data);
}

export async function getModulesByCourse(courseId: string) {
  return findModulesByCourse(courseId);
}

export async function editModule(id: string, data: any) {
  const module = await updateModule(id, data);
  if (!module) {
    internalServerException({ message: "module not found", statusCode: 404 });
    return;
  }
  return module;
}

export async function removeModule(id: string) {
  const module = await deleteModule(id);
  if (!module) {
    internalServerException({ message: "module not found", statusCode: 404 });
    return;
  }
  return module;
}