import Joi from "joi";

export const loginSchema = Joi.object({
  emailId: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const verifyUserSchema = Joi.object({
  token: Joi.string().required(),
  userPassword: Joi.string().optional().allow(""),
});

export const forgotPasswordSchema = Joi.object({
  emailId: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});
