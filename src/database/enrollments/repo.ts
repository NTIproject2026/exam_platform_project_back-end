import { EnrollmentModel } from "./model.js";

export function createEnrollment(student: string, course: string) {
  return EnrollmentModel.create({ student, course });
}

export function findEnrollment(student: string, course: string) {
  return EnrollmentModel.findOne({ student, course });
}

export function findEnrollmentsByStudent(student: string) {
  return EnrollmentModel.find({ student }).populate("course");
}