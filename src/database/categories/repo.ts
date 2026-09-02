import { CategoryModel } from "./model.js";

export function createCategory(name: string) {
  return CategoryModel.create({ name });
}

export function findAllCategories() {
  return CategoryModel.find();
}

export function findCategoryById(id: string) {
  return CategoryModel.findById(id);
}