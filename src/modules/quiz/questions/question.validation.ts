import Joi from 'joi'
import validationGeneralRules from '../../../common/utils/validation/validation.general.js'

export const updateQuestionByIdSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(), // quizId
    questionId: validationGeneralRules.id.required(),
  }),
  body: Joi.object()
    .keys({
      question_body: Joi.object()
        .min(1)
        .keys({
          head: validationGeneralRules.head.optional(),
          multipleAnswer: validationGeneralRules.head.optional(),
        })
        .optional(),
      answer_sheet: Joi.array()
        .items({
          id: validationGeneralRules.id.required(),
          answer: validationGeneralRules.answer.required(),
          correct: validationGeneralRules.correct.required(),
        })
        .optional(),
    })
    .required(),
}

export const getQuizQuestionSchema = {
  params: Joi.object().keys({
    id: validationGeneralRules.id.required(),
  }),
}

export const addQuestionToQuizSchema = {
  params: Joi.object().keys({ id: Joi.string().required() }).required(),
  body: Joi.object()
    .keys({
      questionData: Joi.object()
        .keys({
          head: validationGeneralRules.head.required(),
          multipleAnswer: validationGeneralRules.multipleAnswer.required(),
        })
        .required(),
      answer_sheet: Joi.array()
        .items({
          answer: validationGeneralRules.answer.required(),
          correct: validationGeneralRules.correct.required(),
          delete: Joi.boolean().default(false),
        })
        .required(),
    })
    .required(),
}

export const deleteQuestion = {
  params: Joi.object()
    .keys({
      id: validationGeneralRules.id.required(),
      questionId: validationGeneralRules.id.required(),
    })
    .required(),
}

export const getQuestionByIdSchema = {
  params: Joi.object()
    .keys({
      id: validationGeneralRules.id.required(),
      questionId: validationGeneralRules.id.required(),
    })
    .required(),
}
