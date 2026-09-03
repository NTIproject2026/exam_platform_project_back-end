import { Router } from "express";
import {
  register,
  login,
  getProfile,
  instructorOnly,
  updateProfileController,
  logout,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller.js";
import { authenticateUser } from "../../common/middlewares/authentication.js";
import { authorizeRole } from "../../common/middlewares/authorization.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authenticateUser, getProfile);
authRouter.get(
  "/instructor-only",
  authenticateUser,
  authorizeRole(["instructor", "admin"]),
  instructorOnly,
);
authRouter.put("/profile", authenticateUser, updateProfileController);
authRouter.post("/logout", authenticateUser, logout);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);

export default authRouter;
