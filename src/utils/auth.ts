import { Response } from "express";
import { boolean } from "joi";
import moment from "moment-timezone";
import config from "config";

export class AuthUtils {
  static commonCookieOptions = {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "development"
        ? true
        : false,
    domain:
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "development"
        ? config.get("cookieDomain")
        : undefined,
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
  } as any;

  static setRefreshTokenCookie(payload: {
    res: Response;
    refreshToken: string;
    rememberMe?: boolean;
  }) {
    const { res, refreshToken, rememberMe = false } = payload;

    const refreshTokenCookieName =
      process.env.NODE_ENV === "production"
        ? "refreshToken"
        : "refreshTokenDev";
    res.cookie(refreshTokenCookieName, refreshToken, {
      maxAge: rememberMe
        ? moment
            .duration(
              config.get("refreshTokenExpireInDays.withRememberMe"),
              "days"
            )
            .asMilliseconds()
        : moment
            .duration(
              config.get("refreshTokenExpireInDays.withoutRememberMe"),
              "days"
            )
            .asMilliseconds(),
      ...this.commonCookieOptions,
    });
  }

  static setAccessTokenCookie(payload: { res: Response; accessToken: string }) {
    const { res, accessToken } = payload;
    const accessTokenCookieName =
      process.env.NODE_ENV === "production" ? "accessToken" : "accessTokenDev";

    res.cookie(accessTokenCookieName, accessToken, {
      maxAge: moment
        .duration(config.get("accessTokenExpireInHours"), "hours")
        .asMilliseconds(),
      ...this.commonCookieOptions,
    });
  }

  static clearAuthCookies(res: Response) {
    const refreshTokenCookieName =
      process.env.NODE_ENV === "production"
        ? "refreshToken"
        : "refreshTokenDev";
    const accessTokenCookieName =
      process.env.NODE_ENV === "production" ? "accessToken" : "accessTokenDev";

    res.clearCookie(refreshTokenCookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      domain:
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "development"
          ? config.get("cookieDomain")
          : undefined,
    });
    res.clearCookie(accessTokenCookieName, {
      httpOnly: true,
      domain:
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "development"
          ? config.get("cookieDomain")
          : undefined,
    });
  }
}
