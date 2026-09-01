import type { NextFunction, Request, Response } from 'express'
import appError from './app.error.js'

function globalErrorHandler(
  err: Error | appError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err instanceof appError ? err.statusCode : 500;
  console.log(err)
  res.status(statusCode).json({
    message: err.message,
  })
}

export default globalErrorHandler
