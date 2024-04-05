import mongoose from "mongoose";
import { FilmsModel } from "../models/FilmsModel";

export class FilmsService {
  static async getAllFilms(payload: {
    searchKeyword?: string;
    page: number;
    size: number;
    companyId: string;
  }) {
    const { searchKeyword, page, size, companyId } = payload;
    console.log(payload);
  }
}
