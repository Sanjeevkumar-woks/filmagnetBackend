import mongoose from "mongoose";
import { FilmsModel } from "../models/FilmsModel";

export class FilmsService {
  static async getAllFilms(payload: {
    searchKeyword?: string;
    page: number;
    size: number;
  }) {
    const { searchKeyword, page, size } = payload;

    let query = {};
    if (searchKeyword) {
      query = {
        title: { $regex: searchKeyword, $options: "i" }, // Case-insensitive search
      };
    }

    const response = await FilmsModel.find(query)
      .skip((Number(page) - 1) * Number(size))
      .limit(Number(size));
    return response;
  }

  static async getFilmById(id: string) {
    const response = await FilmsModel.findById({ _id: id });
    return response;
  }

  static async createFilm(payload: {
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    awards: string;
    poster: string;
    metascore: string;
    imdbRating: string;
    imdbID: string;
    type: string;
    response: string;
    images: string[];
  }) {
    const response = await FilmsModel.create(payload);
    return response;
  }

  static async createManyFilms(
    payload: {
      title: string;
      year: string;
      rated: string;
      released: string;
      runtime: string;
      genre: string;
      director: string;
      writer: string;
      actors: string;
      plot: string;
      language: string;
      country: string;
      awards: string;
      poster: string;
      metascore: string;
      imdbRating: string;
      imdbID: string;
      type: string;
      response: string;
      images: string[];
    }[]
  ) {
    const response = await FilmsModel.insertMany(payload);
    return response;
  }

  static async updateFilm(
    id: string,
    payload: {
      title: string;
      description: string;
      releaseDate: string;
      rating: number;
    }
  ) {
    const response = await FilmsModel.findByIdAndUpdate({ _id: id }, payload);
    return response;
  }

  static async deleteFilm(id: string) {
    const response = await FilmsModel.findByIdAndDelete({ _id: id });
    return response;
  }
}
