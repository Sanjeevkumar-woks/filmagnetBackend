import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../validationSchemas/authSchema";
import { validateJoiSchema } from "../validationSchemas/validationSchema";
import { Request, Response } from "express";
import * as authService from "../services/authService";
import { AuthUtils } from "../utils/auth";
import { HttpError } from "http-errors";
import Joi from "joi";

export async function signup(req: Request, res: Response) {
  const { emailId, password, rememberMe } = req.body;
  validateJoiSchema({
    schema: loginSchema,
    data: { emailId, password, rememberMe },
  });

  const data = await authService.signUp({
    emailId,
    password,
    rememberMe,
  });
  res.send(data);
}

export async function verifyUser(req: Request, res: Response) {
  const { token, userPassword } = req.body;
  validateJoiSchema({
    schema: verifyUserSchema,
    data: { token, userPassword },
  });
  const data = await authService.verifyUser({ token, userPassword });

  res.send(data);
}

export async function login(req: Request, res: Response) {
  const { emailId, password, rememberMe } = req.body;

  validateJoiSchema({
    schema: loginSchema,
    data: { emailId, password, rememberMe },
  });

  const data = await authService.login({
    emailId,
    password,
    rememberMe,
  });

  if (data?.accessToken && data?.refreshToken) {
    AuthUtils.setRefreshTokenCookie({
      res,
      refreshToken: data.refreshToken,
      rememberMe,
    });
    AuthUtils.setAccessTokenCookie({
      res,
      accessToken: data.accessToken,
    });
    res.send({ message: "Login Successful" });
  } else {
    res.send(data);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { emailId } = req.body;
  validateJoiSchema({
    schema: forgotPasswordSchema,
    data: { emailId },
  });
  await authService.forgotPassword({ emailId });
  res.send({ message: "Password reset link sent to your email" });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;

  validateJoiSchema({
    schema: resetPasswordSchema,
    data: { token, password },
  });

  await authService.resetPassword({ token, password });
  res.send({ message: "Password rest successful" });
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken =
    process.env.NODE_ENV === "production"
      ? req.cookies?.refreshToken
      : req.cookies?.refreshTokenDev;

  try {
    const accessToken = await authService.refreshToken({
      refreshToken,
    });

    AuthUtils.setAccessTokenCookie({
      res,
      accessToken,
    });

    res.send({ message: "Token refreshed successfully" });
  } catch (err) {
    AuthUtils.clearAuthCookies(res);

    if (err instanceof HttpError) {
      res.status(err.statusCode).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: "Internal Server Error" });
  }
}

export async function logout(req: Request, res: Response) {
  const refreshTokenCookieName =
    process.env.NODE_ENV === "production" ? "refreshToken" : "refreshTokenDev";
  const accessTokenCookieName =
    process.env.NODE_ENV === "production" ? "accessToken" : "accessTokenDev";

  const refreshToken = req.cookies?.[refreshTokenCookieName];

  await authService.logout({ refreshToken });

  AuthUtils.clearAuthCookies(res);

  res.send({ message: "Logout successful" });
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;

  validateJoiSchema({
    schema: Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().required().min(8),
    }),
    data: { currentPassword, newPassword },
  });

  // await authService.changePassword({
  //   currentPassword,
  //   newPassword,
  //   userId,
  // });

  res.send({ message: "Password changed successfully" });
}
