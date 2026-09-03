import Joi from 'joi'
import validationGeneralRules from '../../common/utils/validation/validation.general.js'

export const getQuizByIdSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
}

export const updateQuizSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
  query: Joi.object().keys({
    quizAttempt: validationGeneralRules.id.required(),
  }),
  body: Joi.object().min(1).keys({
    name: validationGeneralRules.Name.optional(),
    desc: validationGeneralRules.desc.optional(),
    time: validationGeneralRules.time.optional(),
    img: validationGeneralRules.img.optional(),
    quizType: validationGeneralRules.quizType.optional(),
  }),
}

export const getAllDiplomaQuizzesSchema = {
  params: Joi.object().keys({
    diplomaId: validationGeneralRules.id.required(),
  }),
}

export const createQuizSchema = {
  body: Joi.object().keys({
    name: validationGeneralRules.Name.required(),
    desc: validationGeneralRules.desc.required(),
    time: validationGeneralRules.time.required(),
    img: validationGeneralRules.desc.required(),
    quizType: validationGeneralRules.desc.required(),
  }),
}

export const deleteQuizSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
}

export const finishQuizSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
  body: Joi.object().keys({
    answers: Joi.array()
      .items({
        question_id: validationGeneralRules.id.required(),
        answer_ids: validationGeneralRules.id.required(),
      })
      .required(),
  }),
}

export const startQuizSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
}
