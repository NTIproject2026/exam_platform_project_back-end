import Joi from "joi";
import validationGeneralRules from '../../common/utils/validation/validation.general.js';

export const createDiplomaValidation = {
  body: Joi.object().keys({
    name: validationGeneralRules.Name.required(),
    desc: validationGeneralRules.desc.required(),
    img: validationGeneralRules.img.optional(),
  }),
};

export const updateDiplomaValidation = {
  body: Joi.object()
    .keys({
      name: validationGeneralRules.Name.required(),
      desc: Joi.string().required(),
      img: Joi.string().optional(),
    })
    .min(1),
};

export const getAllDiplomasValidation = {
  query: Joi.object().keys({
    page: validationGeneralRules.page,
    limit: validationGeneralRules.limit,
  }),
};

export const getDiplomaByIdValidation = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
};

export const deleteDiplomaValidation = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
};
