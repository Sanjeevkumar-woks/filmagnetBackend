import mongoose from "mongoose";
import { FilmModelName, IFilm, filmSchema } from "../validationSchemas";

export const FilmsModel = mongoose.model<IFilm>(FilmModelName, filmSchema);
