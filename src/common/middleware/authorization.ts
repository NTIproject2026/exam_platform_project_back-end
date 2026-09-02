import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authentication.js";
import { internalServerException } from "../response/app.error.js";

export function authorization(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return internalServerException({ message: "not authorized", statusCode: 403 });
    }
    next();
  };
}