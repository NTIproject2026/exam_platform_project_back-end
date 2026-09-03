import type { NextFunction, Request, Response } from 'express'
import quizService from './quiz.service.js'
import type { Types } from 'mongoose'

export async function createQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const diplomaId = req.params?.diplomaId as unknown as Types.ObjectId

  return res.status(200).json({
    success: true,
    data: await quizService.createQuiz(req.body, diplomaId, req?.user),
  })
}

export async function getAllDiplomaQuizzes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.diplomaId as unknown as Types.ObjectId
  return res.status(200).json({
    success: true,
    data: await quizService.getAllDiplomaQuizzes(id),
  })
}

export async function getQuizById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.id as any
  return res.status(200).json({
    success: true,
    data: await quizService.getQuizById(id),
  })
}

export async function updateQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.id! as any
  const data = req.body
  return res.status(200).json({
    success: true,
    data: await quizService.updateQuiz(id, data, req?.user.id),
  })
}

export async function deleteQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.id as unknown as Types.ObjectId
  return res.status(200).json({
    success: true,
    data: await quizService.deleteQuiz(id, req?.user.id),
  })
}

export async function startQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.id! as any
  return res.status(200).json({
    success: true,
    data: await quizService.startQuiz(id, req?.user),
  })
}

export async function submitQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return res.status(200).json({
    success: true,
    data: await quizService.submitQuiz(
      req.params?.id! as any,
      req.user,
      req.query?.quizAttempt as any,
      req.body?.data,
    ),
  })
}

export const finishQuiz = submitQuiz
