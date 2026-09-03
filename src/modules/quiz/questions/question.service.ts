import type { Types } from 'mongoose'
import {
  InternalSererErrorException,
  NotFoundException,
} from '../../../common/errors/message.error.js'
import type { addQuestionToQuizDTO } from '../quiz.dto.js'
import type { updateQuestionByIdDTO } from './question.dto.js'

import type { HydratedQuestionDoc } from './question.model.js'
import appError from '../../../common/errors/app.error.js'
import questionRepo from '../../../common/repositories/question.repo.js'
import quizRepo from '../../../common/repositories/quiz.repo.js'
import answerRepo from '../../../common/repositories/answer.repo.js'

class questionService {
  private readonly _questionRepo = questionRepo
  private readonly _quizRepo = quizRepo
  private readonly _answerRepo = answerRepo

  constructor() {}
  async addQuestionToQuiz(quizId: Types.ObjectId, body: addQuestionToQuizDTO) {
    const { questionData, answer_sheet } = body
    const quiz = await this._quizRepo
      .findDocumentById({
        id: quizId,
      })
      .catch(err => InternalSererErrorException())
    if (!quiz) NotFoundException()

    const question = await this._questionRepo
      .create({
        data: {
          multipleAnswer: questionData.multipleAnswer,
          question: questionData.head,
          quizId,
        },
      })
      .catch(err => InternalSererErrorException())
    if (!question) InternalSererErrorException()

    let answers = []
    for (let cnt = 0; cnt < answer_sheet.length; cnt++) {
      answers.push(
        await this._answerRepo
          .create({
            data: {
              answer: answer_sheet[cnt]?.answer!,
              correct: answer_sheet[cnt]?.correct!,
              question_id: question!._id,
            },
          })
          .catch(err => InternalSererErrorException()),
      )
    }

    if (!answers.length) NotFoundException()

    return { questionId: question!.id }
  }

  async getQuestionById(questionId: Types.ObjectId, quizId: Types.ObjectId) {
    const quiz = await this._quizRepo
      .findDocumentById({
        id: quizId,
      })
      .catch(() => InternalSererErrorException())

    if (!quiz) {
      NotFoundException('quiz not found')
    }
    const question: HydratedQuestionDoc =
      await this._questionRepo.findDocumentById({
        id: questionId,
        options: {
          populate: [
            {
              path: 'answers',
              select: 'answer',
              match: [{ deletedAt: { $exists: false } }],
            },
          ],
        },
      })
    return question
  }

  async updateQuestionById(
    questId: Types.ObjectId,
    body: updateQuestionByIdDTO,
  ) {
    const { answer_sheet, question_body } = body
    if (question_body) {
      const question: any = await this._questionRepo
        .updateDocumentById({
          id: questId,
          update: {
            question: question_body?.head ? question_body.head : undefined,
            multipleAnswer: question_body?.multipleAnswer
              ? question_body.multipleAnswer
              : undefined,
          },
        })
        .catch(err => InternalSererErrorException())

      if (!question) NotFoundException()
    }

    if (answer_sheet) {
      for (let answer of answer_sheet) {
        const ans = await this._answerRepo
          .updateDocument({
            filter: { id: answer.id, questionId: questId },
            update: {
              answer: answer.answer,
              correct: answer.correct,
            },
          })
          .catch(err => InternalSererErrorException())
      }
    }

    return 'update succeed'
  }

  async getQuizQuestions(quizId: Types.ObjectId) {
    const quiz = await this._quizRepo
      .findDocumentById({ id: quizId })
      .catch(err => InternalSererErrorException())

    if (!quiz) NotFoundException()

    const questions = await this._questionRepo
      .findAllDocuments({
        filter: { quizId: quizId },
        options: {
          populate: [
            {
              path: 'answers',
              select: 'answer',
              match: [{ deletedAt: { $exists: false } }],
            },
          ],
        },
      })
      .catch(err => {
        console.log(err)
        InternalSererErrorException()
      })

    if (!questions) NotFoundException()
    return { quiz, questions }
  }

  async deleteQuestionById(id: Types.ObjectId, userId: Types.ObjectId) {
    const question = await this._questionRepo
      .updateDocumentById({
        id,
        update: {
          deletedAt: new Date(),
          deletedBy: userId,
        },
      })
      .catch(err => InternalSererErrorException())
    if (!question.deletedCount) NotFoundException()
    if (!question.acknowledged)
      throw new appError('failed to delete document', 400)

    return 'deletion succeed'
  }
}

export default new questionService()
