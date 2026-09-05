import { Router } from "express";
import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { validate } from "../../common/middleware/validation.js";
import { categoryValidation } from "../../common/utils/validation/schemas.js";

const router = Router();

router.post("/", authentication, authorization("instructor", "admin"), validate(categoryValidation.createCategorySchema), createCategoryController);
router.get("/", getCategoriesController);
router.get("/:id", getCategoryController);
router.put("/:id", authentication, authorization("instructor", "admin"), validate(categoryValidation.updateCategorySchema), updateCategoryController);
router.delete("/:id", authentication, authorization("instructor", "admin"), deleteCategoryController);

export default router;