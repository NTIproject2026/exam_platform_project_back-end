import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../common/middleware/authentication.js";
import {
  createCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
} from "../../database/categories/repo.js";

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

export async function getCategoryController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const category = await findCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 404, message: "category not found" });
    }
    res.status(200).json({ category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategoryController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    const category = await updateCategory(req.params.id, name);
    if (!category) {
      return res.status(404).json({ status: 404, message: "category not found" });
    }
    res.status(200).json({ message: "category updated", category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategoryController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const category = await deleteCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 404, message: "category not found" });
    }
    res.status(200).json({ message: "category deleted" });
  } catch (err) {
    next(err);
  }
}