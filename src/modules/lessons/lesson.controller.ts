import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../common/middleware/authentication.js";
import {
  addLesson,
  getLessonsByModule,
  editLesson,
  removeLesson,
} from "./lesson.service.js";

export async function createLessonController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, content, videoUrl, module, order } = req.body;
    const lesson = await addLesson({ title, content, videoUrl, module, order });
    res.status(201).json({ message: "lesson created", lesson });
  } catch (err) {
    next(err);
  }
}

export async function getLessonsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const lessons = await getLessonsByModule(req.params.moduleId);
    res.status(200).json({ lessons });
  } catch (err) {
    next(err);
  }
}

export async function updateLessonController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const lesson = await editLesson(req.params.id, req.body);
    res.status(200).json({ message: "lesson updated", lesson });
  } catch (err) {
    next(err);
  }
}

export async function deleteLessonController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await removeLesson(req.params.id);
    res.status(200).json({ message: "lesson deleted" });
  } catch (err) {
    next(err);
  }
}