import express from "express";
import { PORT } from "./config/config.js";
import { bootstrab } from "./app.controller.js";

const app = express();
const port = Number(PORT) ?? 6000;
bootstrab(port, app);
