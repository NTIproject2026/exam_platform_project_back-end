import Joi from "joi";

export const authValidation = {
  registerSchema: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  updateProfileSchema: Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email(),
  }),
  forgotPasswordSchema: Joi.object({
    email: Joi.string().email().required(),
  }),
  resetPasswordSchema: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

export const categoryValidation = {
  createCategorySchema: Joi.object({
    name: Joi.string().min(2).required(),
  }),
  updateCategorySchema: Joi.object({
    name: Joi.string().min(2).required(),
  }),
};