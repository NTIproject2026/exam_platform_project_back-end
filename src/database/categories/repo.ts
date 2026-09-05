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

export function updateCategory(id: string, name?: string) {
  return CategoryModel.findByIdAndUpdate(id, { name }, { new: true });
}

export function deleteCategory(id: string) {
  return CategoryModel.findByIdAndDelete(id);
}