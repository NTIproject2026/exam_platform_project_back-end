import type { NextFunction, Request, Response } from 'express'
import questionService from './question.service.js'

export async function addQuestionToQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.id! as any
  const body = req.body
  return res.status(200).json({
    success: true,
    data: await questionService.addQuestionToQuiz(id, body),
  })
}

export async function updateQuestionById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.questionId! as any
  const body = req.body
  return res.status(200).json({
    success: true,
    data: await questionService.updateQuestionById(id, body),
  })
}

export async function getQuestionById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.questionId! as any
  const quizId = req.params?.id! as any
  return res.status(200).json({
    success: true,
    data: await questionService.getQuestionById(id, quizId),
  })
}

export async function getQuizQuestions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.id! as any
  return res.status(200).json({
    success: true,
    data: await questionService.getQuizQuestions(id),
  })
}

export async function deleteQuestionById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params?.questionId! as any
  return res.status(200).json({
    success: true,
    data: await questionService.deleteQuestionById(id, req?.user),
  })
}
