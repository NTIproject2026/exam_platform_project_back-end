import { Router } from 'express'
import {
  completeLessonController,
  getProgressController,
} from './progress.controller.js'
import { authenticateUser } from '../../common/middlewares/authentication.js'

const router = Router()

router.post('/complete', authenticateUser, completeLessonController)
router.get('/:courseId', authenticateUser, getProgressController)

export default router
