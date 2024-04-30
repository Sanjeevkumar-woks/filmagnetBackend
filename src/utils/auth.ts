import { Response } from "express";
import { boolean } from "joi";
import moment from "moment-timezone";
import config from "config";

export class AuthUtils {
  static commonCookieOptions = {
    httpOnly: true,
    secure: false,
    domain:
      config.get("cookieDomain"),
    sameSite: "none",
  } as any;

  static setRefreshTokenCookie(payload: {
    res: Response;
    refreshToken: string;
    rememberMe?: boolean;
  }) {
    const { res, refreshToken, rememberMe = false } = payload;

    const refreshTokenCookieName = "refreshTokenDev";
    res.cookie(refreshTokenCookieName, refreshToken);
  }

  static setAccessTokenCookie(payload: { res: Response; accessToken: string }) {
    const { res, accessToken } = payload;
    const accessTokenCookieName = "accessTokenDev";

    res.cookie(accessTokenCookieName, accessToken, {
      maxAge: moment
        .duration(config.get("accessTokenExpireInHours"), "hours")
        .asMilliseconds(),
      ...this.commonCookieOptions,
    });
  }

  static clearAuthCookies(res: Response) {
    const refreshTokenCookieName = "refreshTokenDev";
    const accessTokenCookieName =
      process.env.NODE_ENV === "production" ? "accessToken" : "accessTokenDev";

    res.clearCookie(refreshTokenCookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      domain:
        config.get("cookieDomain")
    });
    res.clearCookie(accessTokenCookieName, {
      httpOnly: true,
      domain: config.get("cookieDomain")

    });
  }
}
