import { Request, Response } from "express";
import Joi from "joi";
import { validateJoiSchema } from "../validationSchemas/validationSchema";
import { FilmsService } from "../services/filmsService";

const filmValidationSchema = Joi.object({
  Title: Joi.string().required(),
  Year: Joi.string().required(),
  Rated: Joi.string().required(),
  Released: Joi.string().required(),
  Runtime: Joi.string().required(),
  Genre: Joi.string().required(),
  Director: Joi.string().required(),
  Writer: Joi.string().required(),
  Actors: Joi.string().required(),
  Plot: Joi.string().required(),
  Language: Joi.string().required(),
  Country: Joi.string().required(),
  Awards: Joi.string().required(),
  Poster: Joi.string().uri().required(),
  Metascore: Joi.string().required(),
  imdbRating: Joi.string().required(),
  imdbVotes: Joi.string().required(),
  imdbID: Joi.string().required(),
  Type: Joi.string().required(),
  Response: Joi.string().required(),
  Images: Joi.array().items(Joi.string().uri()).required(),
});
export class FilmsController {
  static async getAllFilms(req: Request, res: Response) {
    const { searchKeyword, page = 1, size = 20 } = req.query;

    validateJoiSchema({
      schema: Joi.object({
        searchKeyword: Joi.string().optional().allow(""),
        page: Joi.number().optional(),
        size: Joi.number().optional(),
      }),
      data: req.query,
    });

    const response = await FilmsService.getAllFilms({
      searchKeyword: searchKeyword as string,
      page: Number(page),
      size: Number(size),
    });
    res.send(response);
  }

  static async getFilmById(req: Request, res: Response) {
    const { movieId } = req.query;
    console.log(movieId, "movieId==>");
    validateJoiSchema({
      schema: Joi.object({
        movieId: Joi.string().hex().length(24).required(),
      }),
      data: req.params,
    });

    const response = await FilmsService.getFilmById(movieId as string);
    res.send(response);
  }

  static async createFilm(req: Request, res: Response) {
    validateJoiSchema({
      schema: filmValidationSchema,
      data: req.body,
    });

    const response = await FilmsService.createFilm(req.body);
    res.send(response);
  }

  static async createManyFilms(req: Request, res: Response) {
    const { films } = req.body;
    console.log(films);
    validateJoiSchema({
      schema: Joi.object({
        films: Joi.array().items(filmValidationSchema).required(),
      }),
      data: req.body,
    });
    const response = await FilmsService.createManyFilms(films);
    res.send(response);
  }

  static async updateFilm(req: Request, res: Response) {
    const { id } = req.params;

    validateJoiSchema({
      schema: filmValidationSchema,
      data: req.body,
    });

    const response = await FilmsService.updateFilm(id, req.body);
    res.send(response);
  }

  static async deleteFilm(req: Request, res: Response) {
    const { id } = req.params;
    validateJoiSchema({
      schema: Joi.object({
        id: Joi.string().hex().length(24).required(),
      }),
      data: req.params,
    });

    const response = await FilmsService.deleteFilm(id);
    res.send(response);
  }
}
