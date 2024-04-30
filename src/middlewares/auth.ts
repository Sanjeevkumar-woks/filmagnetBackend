import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { isValidAccessToken, isValidRefreshToken } from "../constants/jwt";

export const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      process.env.NODE_ENV === "production"
        ? req.cookies?.refreshToken
        : req.cookies?.refreshTokenDev;
    const accessToken =
      process.env.NODE_ENV === "production"
        ? req.cookies?.accessToken
        : req.cookies?.accessTokenDev;

    console.log("refreshToken", refreshToken);
    console.log("accessToken", accessToken);

    if (!refreshToken || !accessToken) {
      throw new createHttpError.Unauthorized("Unauthorized");
    }

    const [isValidRefresh, isValidAccess] = await Promise.all([
      isValidRefreshToken(refreshToken),
      isValidAccessToken(accessToken),
    ]);

    if (isValidRefresh?.error || isValidAccess?.error) {
      throw new createHttpError.Unauthorized("Unauthorized");
    }

    req.query = {
      userId: isValidAccess?.data?.userId as string,
    };

    return next();
  } catch (err) {
    return next(err);
  }
};
