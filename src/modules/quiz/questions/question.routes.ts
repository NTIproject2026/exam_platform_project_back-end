import { Router } from 'express'
import { authenticateUser } from '../../../common/middlewares/authentication.js'
import { authorizeRole } from '../../../common/middlewares/authorization.js'
import { validate } from '../../../common/middlewares/validation.js'
import { getQuestionByIdSchema } from './question.validation.js'
import {
  addQuestionToQuiz,
  deleteQuestionById,
  getQuestionById,
  getQuizQuestions,
  updateQuestionById,
} from './question.controller.js'
import {
  addQuestionToQuizSchema,
  deleteQuestion,
  getQuizQuestionSchema,
  updateQuestionByIdSchema,
} from './question.validation.js'
import { UserRoleEnum } from '../../../common/enum/UserRoleEnum.js'

const questionRouter: Router = Router({ mergeParams: true })

questionRouter.post(
  '/',
  authenticateUser,
  validate(addQuestionToQuizSchema),
  authorizeRole([UserRoleEnum.admin]),
  addQuestionToQuiz,
)

questionRouter.get(
  '/',
  authenticateUser,
  validate(getQuizQuestionSchema),
  authorizeRole([UserRoleEnum.admin]),
  getQuizQuestions,
)

questionRouter.get(
  '/:questionId',
  authenticateUser,
  validate(getQuestionByIdSchema),
  authorizeRole([UserRoleEnum.admin]),
  getQuestionById,
)

// question and answers
questionRouter.patch(
  '/:questionId',
  authenticateUser,
  validate(updateQuestionByIdSchema),
  authorizeRole([UserRoleEnum.admin]),
  updateQuestionById,
)

questionRouter.delete(
  '/:questionId',
  authenticateUser,
  validate(deleteQuestion),
  authorizeRole([UserRoleEnum.admin]),
  deleteQuestionById,
)

export default questionRouter
