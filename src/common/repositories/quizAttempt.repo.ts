import baseRepo from './base.repo.js'
import type { Model } from 'mongoose'
import mongoose from 'mongoose'
import type { IQuizAttempt } from '../../database/quizzes/model.js'


class quizAttemptRepo extends baseRepo<IQuizAttempt> {
  constructor(
    protected readonly _model: Model<IQuizAttempt> = mongoose.models.quizzesattempts!,
  ) {
    super(_model)
  }
}

export default new quizAttemptRepo()
