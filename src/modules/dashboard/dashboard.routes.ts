import { Router } from 'express'
import { validate } from '../../common/middlewares/validation.js'
import * as dashboardController from './dashboard.controller.js'
import {
  createDiplomaValidation,
  updateDiplomaValidation,
  getAllDiplomasValidation,
  deleteDiplomaValidation,
  getDiplomaByIdValidation,
} from './dashboard.validation.js'
import { authenticateUser } from '../../common/middlewares/authentication.js'
import { authorizeRole } from '../../common/middlewares/authorization.js'
import quizRouter from '../quiz/quiz.routes.js'
import { UserRoleEnum } from '../../common/enum/UserRoleEnum.js'

const dashboardRouter: Router = Router({ mergeParams: true })
dashboardRouter.use('/:diplomaId/quizzes', quizRouter)

// Diploma routes
dashboardRouter.post(
  '/',
  validate(createDiplomaValidation),
  authenticateUser,
  authorizeRole([UserRoleEnum.admin]),
  dashboardController.createDiploma,
)

dashboardRouter.get(
  '/',
  authenticateUser,
  validate(getAllDiplomasValidation),
  authorizeRole([UserRoleEnum.admin, UserRoleEnum.user]),
  dashboardController.getAllDiplomas,
)

dashboardRouter.get(
  '/:id',
  authenticateUser,
  validate(getDiplomaByIdValidation),
  authorizeRole([UserRoleEnum.admin, UserRoleEnum.user]),
  dashboardController.getDiplomaById,
)

dashboardRouter.patch(
  '/:id',
  validate(updateDiplomaValidation),
  authenticateUser,
  authorizeRole([UserRoleEnum.admin]),
  dashboardController.updateDiploma,
)

dashboardRouter.delete(
  '/:id',
  validate(deleteDiplomaValidation),
  authenticateUser,
  authorizeRole([UserRoleEnum.admin]),
  dashboardController.deleteDiploma,
)

dashboardRouter.delete(
  '/dashboard',
  validate(deleteDiplomaValidation),
  authenticateUser,
  authorizeRole([UserRoleEnum.admin]),
  dashboardController.getDashBoard,
)

export default dashboardRouter
