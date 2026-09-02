import { Router } from "express";
import {
  createLessonController,
  getLessonsController,
  updateLessonController,
  deleteLessonController,
} from "./lesson.controller.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const router = Router();

router.post("/", authentication, authorization("instructor", "admin"), createLessonController);
router.get("/module/:moduleId", getLessonsController);
router.put("/:id", authentication, authorization("instructor", "admin"), updateLessonController);
router.delete("/:id", authentication, authorization("instructor", "admin"), deleteLessonController);

export default router;