import mongoose from "mongoose";
import {
  IRefreshToken,
  RefreshTokenModelName,
  refreshTokenSchema,
} from "../validationSchemas/refreshTokenSchema";

export const RefreshTokenModel = mongoose.model<IRefreshToken>(
  RefreshTokenModelName,
  refreshTokenSchema
);
