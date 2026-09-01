import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";
import {
  NotFoundException,
  UnAuthorizedException,
} from "../errors/message.error.js";
import userRepo from "../repositories/user.repo.js";

// Authenticate users by JWT
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Check if token exists in headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return UnAuthorizedException(
        "You are not logged in. Please log in to get access.",
      );
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return UnAuthorizedException(
        "Token is missing. Please log in to get access.",
      );
    }

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET as string) as any;

    // 4. Check if user still exists
    const userId = decoded.userId || decoded.id;
    const currentUser = await userRepo.findDocumentById({ id: userId });
    if (!currentUser) {
      return NotFoundException(
        "The user belonging to this token no longer exists.",
      );
    }

    // 5. Grant access to protected route by attaching user to request
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return UnAuthorizedException(
        "You are not logged in. Please log in to get access.",
      );
    }
    if (error instanceof jwt.TokenExpiredError) {
      return UnAuthorizedException(
        "You are not logged in. Please log in to get access.",
      );
    }
    next(error);
  }
};
