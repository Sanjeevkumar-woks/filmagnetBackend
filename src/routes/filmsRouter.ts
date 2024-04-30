import express from "express";
import asyncFunction from "express-async-handler";
import { FilmsController } from "../controllers/filmsController";
import { ensureAuthenticated } from "../middlewares/auth";

export const filmsApis = express.Router();

filmsApis.get(
  "/allFilms",

  asyncFunction(FilmsController.getAllFilms)
);

filmsApis.get(
  "/movie",

  asyncFunction(FilmsController.getFilmById)
);

filmsApis.post(
  "/",
  ensureAuthenticated,
  asyncFunction(FilmsController.createFilm)
);

filmsApis.post(
  "/create-films",

  asyncFunction(FilmsController.createManyFilms)
);

filmsApis.put(
  "/:id",
  ensureAuthenticated,
  asyncFunction(FilmsController.updateFilm)
);

filmsApis.delete(
  "/:id",
  ensureAuthenticated,
  asyncFunction(FilmsController.deleteFilm)
);
