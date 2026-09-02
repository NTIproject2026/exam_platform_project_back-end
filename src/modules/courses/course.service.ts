import {
  createCourse,
  findAllCourses,
  findCourseById,
  updateCourse,
  deleteCourse,
} from "../../database/courses/repo.js";
import { internalServerException } from "../../common/response/app.error.js";

export async function addCourse(data: {
  title: string;
  description: string;
  image?: string;
  level: string;
  category: string;
  duration: number;
  instructor: string;
}) {
  return createCourse(data);
}

export async function getAllCourses(filter: { category?: string; level?: string; search?: string }) {
  return findAllCourses(filter);
}

export async function getCourseById(id: string) {
  const course = await findCourseById(id);
  if (!course) {
    internalServerException({ message: "course not found", statusCode: 404 });
    return;
  }
  return course;
}

export async function editCourse(id: string, data: any) {
  const course = await updateCourse(id, data);
  if (!course) {
    internalServerException({ message: "course not found", statusCode: 404 });
    return;
  }
  return course;
}

export async function removeCourse(id: string) {
  const course = await deleteCourse(id);
  if (!course) {
    internalServerException({ message: "course not found", statusCode: 404 });
    return;
  }
  return course;
}