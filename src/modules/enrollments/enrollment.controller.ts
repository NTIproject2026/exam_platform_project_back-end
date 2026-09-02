import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../common/middleware/authentication.js";
import { enrollStudent, getMyEnrollments, checkEnrollment } from "./enrollment.service.js";

export async function enrollController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.body;
    const enrollment = await enrollStudent(req.user!.id, courseId);
    res.status(201).json({ message: "enrolled successfully", enrollment });
  } catch (err) {
    next(err);
  }
}

export async function myEnrollmentsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const enrollments = await getMyEnrollments(req.user!.id);
    res.status(200).json({ enrollments });
  } catch (err) {
    next(err);
  }
}

export async function checkEnrollmentController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const isEnrolled = await checkEnrollment(req.user!.id, req.params.courseId);
    res.status(200).json({ isEnrolled });
  } catch (err) {
    next(err);
  }
}