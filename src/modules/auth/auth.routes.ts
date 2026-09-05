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
import { validate } from "../../common/middleware/validation.js";
import { authValidation } from "../../common/utils/validation/schemas.js";

const router = Router();

router.post("/register", validate(authValidation.registerSchema), register);
router.post("/login", validate(authValidation.loginSchema), login);
router.get("/profile", authentication, getProfile);
router.get("/instructor-only", authentication, authorization("instructor", "admin"), instructorOnly);
router.put("/profile", authentication, validate(authValidation.updateProfileSchema), updateProfileController);
router.post("/logout", authentication, logout);
router.post("/forgot-password", validate(authValidation.forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", validate(authValidation.resetPasswordSchema), resetPasswordController);

export default router;