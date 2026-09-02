import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../common/middleware/authentication.js";
import {
  addModule,
  getModulesByCourse,
  editModule,
  removeModule,
} from "./module.service.js";

export async function createModuleController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, course, order } = req.body;
    const module = await addModule({ title, course, order });
    res.status(201).json({ message: "module created", module });
  } catch (err) {
    next(err);
  }
}

export async function getModulesController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const modules = await getModulesByCourse(req.params.courseId);
    res.status(200).json({ modules });
  } catch (err) {
    next(err);
  }
}

export async function updateModuleController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const module = await editModule(req.params.id, req.body);
    res.status(200).json({ message: "module updated", module });
  } catch (err) {
    next(err);
  }
}

export async function deleteModuleController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await removeModule(req.params.id);
    res.status(200).json({ message: "module deleted" });
  } catch (err) {
    next(err);
  }
}