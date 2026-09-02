import { Router } from "express";
import { completeLessonController, getProgressController } from "./progress.controller.js";
import { authentication } from "../../common/middleware/authentication.js";

const router = Router();

router.post("/complete", authentication, completeLessonController);
router.get("/:courseId", authentication, getProgressController);

export default router;