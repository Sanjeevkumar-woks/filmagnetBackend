import mongoose from "mongoose";

export interface IFilm {
  name: string;
}

export const filmSchema = new mongoose.Schema<IFilm>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Films",
  }
);

export const FilmModelName = "film";
