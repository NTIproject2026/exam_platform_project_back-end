import { CourseModel } from "./model.js";

export function createCourse(data: {
  title: string;
  description: string;
  image?: string;
  level: string;
  category: string;
  duration: number;
  instructor: string;
}) {
  return CourseModel.create(data);
}

export function findAllCourses(filter: { category?: string; level?: string; search?: string }) {
  const query: any = {};

  if (filter.category) query.category = filter.category;
  if (filter.level) query.level = filter.level;
  if (filter.search) query.title = { $regex: filter.search, $options: "i" };

  return CourseModel.find(query).populate("category").populate("instructor", "name email");
}

export function findCourseById(id: string) {
  return CourseModel.findById(id).populate("category").populate("instructor", "name email");
}

export function updateCourse(id: string, data: Partial<{
  title: string;
  description: string;
  image: string;
  level: string;
  category: string;
  duration: number;
}>) {
  return CourseModel.findByIdAndUpdate(id, data, { new: true });
}

export function deleteCourse(id: string) {
  return CourseModel.findByIdAndDelete(id);
}