import Joi from "joi";
import { quizTypeEnum } from "../enum/quiz.base.js";

const validationGeneralRules = {
  Name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string()
    .min(6)
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    // )
  ,
  id: Joi.string().hex().length(24),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  desc: Joi.string(),
  time: Joi.number(),
  img: Joi.string(),
  quizType: Joi.string(),
  answer: Joi.string().required(),
  correct: Joi.boolean().required(),
  head: Joi.string().optional(),
  multipleAnswer: Joi.boolean().optional(),
};

export default validationGeneralRules;
