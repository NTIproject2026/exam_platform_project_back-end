import { Router } from "express";
import {
  createModuleController,
  getModulesController,
  updateModuleController,
  deleteModuleController,
} from "./module.controller.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";

const router = Router();

router.post("/", authentication, authorization("instructor", "admin"), createModuleController);
router.get("/course/:courseId", getModulesController);
router.put("/:id", authentication, authorization("instructor", "admin"), updateModuleController);
router.delete("/:id", authentication, authorization("instructor", "admin"), deleteModuleController);

export default router;