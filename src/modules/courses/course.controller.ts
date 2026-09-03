import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../common/middleware/authentication.js";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  editCourse,
  removeCourse,
} from "./course.service.js";

export async function createCourseController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, description, image, level, category, duration } = req.body;
    const course = await addCourse({
      title,
      description,
      image,
      level,
      category,
      duration,
      instructor: req.user!.id,
    });
    res.status(201).json({ message: "course created", course });
  } catch (err) {
    next(err);
  }
}

export async function getCoursesController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { category, level, search } = req.query;
    const courses = await getAllCourses({
      category: category as string,
      level: level as string,
      search: search as string,
    });
    res.status(200).json({ courses });
  } catch (err) {
    next(err);
  }
}

export async function getCourseController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const course = await getCourseById(req.params.id);
    res.status(200).json({ course });
  } catch (err) {
    next(err);
  }
}

export async function updateCourseController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const course = await editCourse(req.params.id, req.body);
    res.status(200).json({ message: "course updated", course });
  } catch (err) {
    next(err);
  }
}

export async function deleteCourseController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await removeCourse(req.params.id);
    res.status(200).json({ message: "course deleted" });
  } catch (err) {
    next(err);
  }
}