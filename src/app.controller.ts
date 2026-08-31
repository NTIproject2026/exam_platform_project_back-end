import type { Application } from "express";
import express from "express";
import { connectTodDataBase } from "./database/connection.js";
import { globalErrorHandling } from "./common/response/app.error.js";

export async function bootstrab(port: number, server: Application) {
  server.use(express.json());
  await connectTodDataBase();

  server.use(globalErrorHandling);
  server.listen(port, () => {
    console.log(`server is listen on port ${port}`);
  });
}
