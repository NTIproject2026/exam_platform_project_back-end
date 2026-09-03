import { type NextFunction, type Request, type Response } from "express";
import {
  ForbiddenException,
  UnAuthorizedException,
} from "../errors/message.error.js";

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return UnAuthorizedException(
        "You are not logged in. Please log in to get access.",
      );
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return ForbiddenException(
        "You do not have permission to perform this action.",
      );
    }

    next();
  };
};
