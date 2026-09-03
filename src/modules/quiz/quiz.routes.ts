import { Router } from 'express'
import { authenticateUser } from '../../common/middlewares/authentication.js'
import { authorizeRole } from '../../common/middlewares/authorization.js'
import {
  createQuiz,
  deleteQuiz,
  getAllDiplomaQuizzes,
  getQuizById,
  startQuiz,
  submitQuiz,
  updateQuiz,
} from './quiz.controller.js'
import { validate } from '../../common/middlewares/validation.js'
import {
  createQuizSchema,
  deleteQuizSchema,
  getAllDiplomaQuizzesSchema,
  getQuizByIdSchema,
  startQuizSchema,
  updateQuizSchema,
} from './quiz.validation.js'
import questionRouter from './questions/question.routes.js'
import { UserRoleEnum } from '../../common/enum/UserRoleEnum.js'

const quizRouter: Router = Router({ mergeParams: true })

quizRouter.use('/:id/questions', questionRouter)

quizRouter.get(
  '/',
  authenticateUser,
  authorizeRole([UserRoleEnum.admin, UserRoleEnum.user]),
  validate(getAllDiplomaQuizzesSchema),
  getAllDiplomaQuizzes,
)

quizRouter.post(
  '/',
  authenticateUser,
  authorizeRole([UserRoleEnum.admin]),
  validate(createQuizSchema),
  createQuiz,
)

quizRouter.get(
  '/:id',
  authenticateUser,
  validate(getQuizByIdSchema),
  authorizeRole([UserRoleEnum.user, UserRoleEnum.admin]),
  getQuizById,
)

quizRouter.patch(
  '/:id',
  authenticateUser,
  validate(updateQuizSchema),
  authorizeRole([UserRoleEnum.admin]),
  updateQuiz,
)

quizRouter.delete(
  '/:id',
  authenticateUser,
  authorizeRole([UserRoleEnum.admin]),
  validate(deleteQuizSchema),
  deleteQuiz,
)

quizRouter.post(
  '/:id/startQuiz',
  authenticateUser,
  validate(startQuizSchema),
  authorizeRole([UserRoleEnum.user, UserRoleEnum.admin]),
  startQuiz,
)

quizRouter.post(
  '/:id/submitQuiz',
  authenticateUser,
  validate(updateQuizSchema),
  authorizeRole([UserRoleEnum.user, UserRoleEnum.admin]),
  submitQuiz,
)

export default quizRouter
