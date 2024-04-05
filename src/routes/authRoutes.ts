import { Router } from "express";
import asyncFunction from "express-async-handler";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  refreshToken,
  resetPassword,
  signup,
  verifyUser,
} from "../controllers/authController";
import { ensureAuthenticated } from "../middlewares/auth";

export const authApis = Router();

authApis.post("/signUp", asyncFunction(signup));
authApis.post("/verifyUser", asyncFunction(verifyUser));
authApis.post("/login", asyncFunction(login));
authApis.post("/forgotPassword", asyncFunction(forgotPassword));
authApis.post("/resetPassword", asyncFunction(resetPassword));
authApis.get("/refreshToken", asyncFunction(refreshToken));
authApis.get("/logout", asyncFunction(logout));
authApis.put(
  "/changePassword",
  ensureAuthenticated,
  asyncFunction(changePassword)
);
