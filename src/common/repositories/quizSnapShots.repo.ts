import baseRepo from './base.repo.js'
import type { Model } from 'mongoose'
import mongoose from 'mongoose'
import type { IQuizSnapShot } from '../../database/quizzes/model.js'

class snapShotRepo extends baseRepo<IQuizSnapShot> {
  constructor(
    protected readonly _model: Model<IQuizSnapShot> = mongoose.models
      .snapshots!,
  ) {
    super(_model)
  }
}

export default new snapShotRepo()
