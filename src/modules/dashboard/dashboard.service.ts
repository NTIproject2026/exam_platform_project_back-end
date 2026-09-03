import { NotFoundException } from '../../common/errors/message.error.js'
import diplomaRepo from '../../common/repositories/diploma.repo.js'
import quizAttemptRepo from '../../common/repositories/quizAttempt.repo.js'
import type { HydratedUserDoc } from '../../database/models/auth.model.js'

import type { createDiplomaDTO, updateDiplomaDTO } from './dashboard.dto.js'
import { Types } from 'mongoose'
import type { HydratedQuizAttemptDoc } from './quiz.model.js'

class dashboardService {
  private readonly _diplomaRepo = diplomaRepo
  private readonly _quizAttemptsRepo = quizAttemptRepo

  constructor() {}

  async createDiploma(body: createDiplomaDTO , user : HydratedUserDoc) {
    const newDiploma = await this._diplomaRepo.create({
      data: {...body, createdBy : user.id , createdAt : new Date()},
    })
    return newDiploma
  }

  async getAllDiplomas(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [diplomas, totalCount] = await Promise.all([
      this._diplomaRepo.findAllDocuments({
        filter: {},
        options: {
          skip,
          limit,
        },
      }),
      this._diplomaRepo.countDocuments({ filter: {} }),
    ])
    return { records: diplomas, totalCount }
  }

  async getDiplomaById(id: string) {
    const diploma = await this._diplomaRepo.findDocumentById({
      id: new Types.ObjectId(id),
    })
    if (!diploma) {
      NotFoundException('Diploma not found')
    }
    return diploma
  }

  async updateDiploma(id: string, body: updateDiplomaDTO) {
    const updatedDiploma = await this._diplomaRepo.updateDocumentById({
      id: new Types.ObjectId(id),
      update: body,
    })
    if (!updatedDiploma) {
      NotFoundException('Diploma not found')
    }
    return updatedDiploma
  }

  async deleteDiploma(id: string,user : HydratedUserDoc) {
    const deletedDiploma = await this._diplomaRepo.updateDocumentById({
       id: new Types.ObjectId(id) ,
       update : {
        deletedAt : new Date(),
        deletedBy : user.id
       }
    })
    if (deletedDiploma?.deletedCount === 0) {
      NotFoundException('Diploma not found')
    }
    return 'Diploma deleted successfully'
  }

  async getDashBoard(userId: Types.ObjectId) {
    const quizzesAttempts: HydratedQuizAttemptDoc[] =
      await this._quizAttemptsRepo.findAllDocuments({
        filter: {
          user_id: userId,
        },
      })
    let fastestTime = Number.MAX_SAFE_INTEGER
    let countCorrectAnswers = 0
    let countQuizzesPassed = 0
    for (let doc of quizzesAttempts) {
      if (doc.time_spent && doc.time_spent?.getMilliseconds() < fastestTime)
        fastestTime = doc?.time_spent.getMilliseconds()

      if (doc?.correct_answers) countCorrectAnswers += doc?.correct_answers

      if (doc?.score_percentage && doc?.score_percentage > 70)
        countQuizzesPassed++
    }

    if (fastestTime == Number.MAX_SAFE_INTEGER) fastestTime = 0
    else fastestTime = (fastestTime / 1000) * 60

    return {
      fastestTime,
      countCorrectAnswers,
      countQuizzesPassed,
    }
  }

  
}

export default new dashboardService()
