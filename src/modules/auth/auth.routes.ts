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
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authentication, getProfile);
router.get("/instructor-only", authentication, authorization("instructor", "admin"), instructorOnly);
router.put("/profile", authentication, updateProfileController);
router.post("/logout", authentication, logout);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;