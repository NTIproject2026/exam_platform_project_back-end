import type { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "./auth.service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: "user created", user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

export async function instructorOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.status(200).json({ message: "welcome instructor", user: req.user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email } = req.body;
    const user = await updateProfile(req.user!.id, name, email);
    res.status(200).json({ message: "profile updated", user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ message: "logged out successfully" });
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, code, newPassword } = req.body;
    const result = await resetPassword(email, code, newPassword);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
