import { Router } from "express";
import { createCategoryController, getCategoriesController } from "./category.controller.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const router = Router();

router.post("/", authentication, authorization("instructor", "admin"), createCategoryController);
router.get("/", getCategoriesController);

export default router;