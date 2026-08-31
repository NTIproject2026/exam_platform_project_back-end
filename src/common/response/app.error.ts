import type { NextFunction, Request, Response } from "express";

class appError extends Error {
  public statusCode: number;
  public message: any;
  constructor(message: any, statusCode: number) {
    super(message);
    ((this.message = message), (this.statusCode = statusCode));
  }
}

export function globalErrorHandling(
  err: appError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = (err.statusCode as number) || 500;
  res.status(status).json({
    status,
    err: err.message,
    stack: err.stack,
  });
}

export function internalServerException(
  { message, statusCode } = {
    message: "internal server error",
    statusCode: 500,
  },
) {
  throw new appError(message, statusCode);
}
