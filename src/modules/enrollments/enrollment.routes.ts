import { Router } from "express";
import { enrollController, myEnrollmentsController, checkEnrollmentController } from "./enrollment.controller.js";
import { authentication } from "../../common/middleware/authentication.js";

const router = Router();

router.post("/", authentication, enrollController);
router.get("/my-courses", authentication, myEnrollmentsController);
router.get("/check/:courseId", authentication, checkEnrollmentController);

export default router;