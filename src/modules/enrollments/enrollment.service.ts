import { createEnrollment, findEnrollment, findEnrollmentsByStudent } from "../../database/enrollments/repo.js";
import { findCourseById } from "../../database/courses/repo.js";
import { internalServerException } from "../../common/response/app.error.js";

export async function enrollStudent(studentId: string, courseId: string) {
  const course = await findCourseById(courseId);
  if (!course) {
    internalServerException({ message: "course not found", statusCode: 404 });
    return;
  }

  const existing = await findEnrollment(studentId, courseId);
  if (existing) {
    internalServerException({ message: "already enrolled in this course", statusCode: 400 });
    return;
  }

  return createEnrollment(studentId, courseId);
}

export async function getMyEnrollments(studentId: string) {
  return findEnrollmentsByStudent(studentId);
}

export async function checkEnrollment(studentId: string, courseId: string) {
  const enrollment = await findEnrollment(studentId, courseId);
  return !!enrollment;
}