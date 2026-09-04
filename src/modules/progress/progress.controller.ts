import type { Response, NextFunction } from 'express'
import { completeLesson, getProgress } from './progress.service.js'

export async function completeLessonController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { courseId, lessonId } = req.body
    const progress = await completeLesson(req.user!.id, courseId, lessonId)
    res.status(200).json({ message: 'lesson marked as completed', progress })
  } catch (err) {
    next(err)
  }
}

export async function getProgressController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const progress = await getProgress(req.user!.id, req.params.courseId)
    res.status(200).json({ progress })
  } catch (err) {
    next(err)
  }
}
