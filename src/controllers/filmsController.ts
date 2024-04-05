import { Request, Response } from "express";
import Joi from "joi";
import { validateJoiSchema } from "../validationSchemas/validationSchema";
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

    const response = await console.log("inContraoller");
    res.send("inContraoller");
  }
}
