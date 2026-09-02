import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../common/middleware/authentication.js";
import { createCategory, findAllCategories } from "../../database/categories/repo.js";

export async function createCategoryController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    const category = await createCategory(name);
    res.status(201).json({ message: "category created", category });
  } catch (err) {
    next(err);
  }
}

export async function getCategoriesController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const categories = await findAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
}