import express from "express";
import asyncFunction from "express-async-handler";
import { FilmsController } from "../controllers/filmsController";

export const filmsApis = express.Router();

filmsApis.get("/allFilms", asyncFunction(FilmsController.getAllFilms));
