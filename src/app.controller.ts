import type { Application } from "express";
import express from "express";
import { connectTodDataBase } from "./database/connection.js";
import { globalErrorHandling } from "./common/response/app.error.js";
import authRoutes from "./modules/auth/auth.routes.js";
import courseRoutes from "./modules/courses/course.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import moduleRoutes from "./modules/modules/module.routes.js";
import lessonRoutes from "./modules/lessons/lesson.routes.js";
import enrollmentRoutes from "./modules/enrollments/enrollment.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js"; // جديد

export async function bootstrab(port: number, server: Application) {
  server.use(express.json());
  await connectTodDataBase();

  server.use("/auth", authRoutes);
  server.use("/courses", courseRoutes);
  server.use("/categories", categoryRoutes);
  server.use("/modules", moduleRoutes);
  server.use("/lessons", lessonRoutes);
  server.use("/enrollments", enrollmentRoutes);
  server.use("/progress", progressRoutes); // جديد

  server.use(globalErrorHandling);
  server.listen(port, () => {
    console.log(`server is listen on port ${port}`);
  });
}