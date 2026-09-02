import { Router } from "express";
import {
  createCourseController,
  getCoursesController,
  getCourseController,
  updateCourseController,
  deleteCourseController,
} from "./course.controller.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const router = Router();

router.post("/", authentication, authorization("instructor", "admin"), createCourseController);
router.get("/", getCoursesController);
router.get("/:id", getCourseController);
router.put("/:id", authentication, authorization("instructor", "admin"), updateCourseController);
router.delete("/:id", authentication, authorization("instructor", "admin"), deleteCourseController);

export default router;