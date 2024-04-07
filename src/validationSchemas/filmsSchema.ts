import mongoose from "mongoose";

export interface IFilm {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
  Images: string[];
}

export const filmSchema = new mongoose.Schema<IFilm>(
  {
    Title: {
      type: String,
      required: true,
    },
    Year: {
      type: String,
      required: true,
    },
    Rated: {
      type: String,
      required: true,
    },
    Released: {
      type: String,
      required: true,
    },
    Runtime: {
      type: String,
      required: true,
    },
    Genre: {
      type: String,
      required: true,
    },
    Director: {
      type: String,
      required: true,
    },
    Writer: {
      type: String,
      required: true,
    },
    Actors: {
      type: String,
      required: true,
    },
    Plot: {
      type: String,
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
    Awards: {
      type: String,
      required: true,
    },
    Poster: {
      type: String,
      required: true,
    },
    Metascore: {
      type: String,
      required: true,
    },
    imdbRating: {
      type: String,
      required: true,
    },
    imdbVotes: {
      type: String,
      required: true,
    },
    imdbID: {
      type: String,
      required: true,
    },
    Type: {
      type: String,
      required: true,
    },
    Response: {
      type: String,
      required: true,
    },
    Images: {
      type: [String],
      required: true,
    },
  },

  {
    timestamps: true,
    collection: "Films",
  }
);

export const FilmModelName = "film";
