import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";
import { internalServerException } from "../response/app.error.js";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function authentication(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return internalServerException({ message: "no token provided", statusCode: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return internalServerException({ message: "invalid or expired token", statusCode: 401 });
  }
}