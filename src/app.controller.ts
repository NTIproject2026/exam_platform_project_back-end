import type { Application } from 'express'
import express from 'express'
import { connectTodDataBase } from './database/connection.js'
import globalErrorHandler from './common/errors/global.error.handler.js'
import { connect as redisConnection } from './common/services/services/redis.services.js'
import authRouter from './modules/auth/auth.routes.js'

export async function bootstrab(port: number, server: Application) {
  server.use(express.json())
  await connectTodDataBase()
  await redisConnection()

  // server.use("/auth", authRouter);
  // server.use("/courses", courseRoutes);
  // server.use("/categories", categoryRoutes);
  // server.use("/modules", moduleRoutes);
  // server.use("/lessons", lessonRoutes);
  // server.use("/enrollments", enrollmentRoutes);
  // server.use("/progress", progressRoutes);

  server.use(globalErrorHandler)
  server.listen(port, () => {
    console.log(`server is listen on port ${port}`)
  })
}
