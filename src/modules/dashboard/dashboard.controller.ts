import type { NextFunction, Request, Response } from 'express'
import dashboardService from './dashboard.service.js'

export const createDiploma = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(201).json({
    success: true,
    data: await dashboardService.createDiploma(req.body, req?.user),
  })
}

export const getAllDiplomas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const { records, totalCount } = await dashboardService.getAllDiplomas(
    page,
    limit,
  )
  return res.status(200).json({
    success: true,
    data: records,
    totalCount,
  })
}

export const getDiplomaById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id as string
  return res.status(200).json({
    success: true,
    data: await dashboardService.getDiplomaById(id),
  })
}

export const updateDiploma = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id as string
  return res.status(200).json({
    success: true,
    data: await dashboardService.updateDiploma(id, req.body),
  })
}

export const deleteDiploma = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id as string
  return res.status(200).json({
    success: true,
    message: await dashboardService.deleteDiploma(id, req?.user),
  })
}

export const getDashBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(200).json({
    success: true,
    message: await dashboardService.getDashBoard(req.user?.id),
  })
}
