import express from "express";
import { filmsApis } from "./filmsRouter";
import { authApis } from "./authRoutes";

export const apis = express.Router();

apis.use("/films", filmsApis);
apis.use("/auth-service", authApis);
