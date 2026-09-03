import baseRepo from './base.repo.js'
import type { Model } from 'mongoose'
import mongoose from 'mongoose'
import { IQuizAttempt } from '../../database/models/quiz.model.js'


class quizAttemptRepo extends baseRepo<IQuizAttempt> {
  constructor(
    protected readonly _model: Model<IQuizAttempt> = mongoose.models.quizzesattempts!,
  ) {
    super(_model)
  }
}

export default new quizAttemptRepo()
