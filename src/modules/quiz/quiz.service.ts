import { Types } from 'mongoose'
import {
  BadRequestException,
  InternalSererErrorException,
  NotFoundException,
} from '../../common/errors/message.error.js'

import type {
  createQuizDTO,
  updateQuiz,
  finishQuizAttemptDataDTO,
} from './quiz.dto.js'
import {
  calculateScorePercentage,
  calculateScoreTotals,
} from './utils/score-calculator.js'
import type {
  HydratedAnswerDoc,
  HydratedQuestionDoc,
} from './questions/question.model.js'
import quizRepo from '../../common/repositories/quiz.repo.js'
import quizAttemptRepo from '../../common/repositories/quizAttempt.repo.js'
import answerRepo from '../../common/repositories/answer.repo.js'
import questionRepo from '../../common/repositories/question.repo.js'
import diplomaRepo from '../../common/repositories/diploma.repo.js'
import quizSnapShotsRepo from '../../common/repositories/quizSnapShots.repo.js'
import type { HydratedUserDoc } from '../../database/models/auth.model.js'
import type {
  HydratedQuizAttemptDoc,
  HydratedQuizDoc,
} from '../dashboard/quiz.model.js'

class quizService {
  private readonly _quizRepo = quizRepo
  private readonly _quizAttemptRepo = quizAttemptRepo
  private readonly _answerRepo = answerRepo
  private readonly _questionRepo = questionRepo
  private readonly _diplomaRepo = diplomaRepo
  private readonly _snapShotRepo = quizSnapShotsRepo

  constructor() {}

  // quizzes
  async createQuiz(
    QuizData: createQuizDTO,
    diplomaId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const { desc, img, name, quizType, time } = QuizData
    const diploma = await this._diplomaRepo
      .findDocumentById({
        id: diplomaId,
      })
      .catch(err => InternalSererErrorException())

    if (!diploma) NotFoundException('diploma not found')

    const quiz = await this._quizRepo
      .create({
        data: {
          desc,
          img,
          name,
          quizType,
          time,
          diplomaId,
          createdAt: new Date(),
          createdBy: userId,
        },
      })
      .catch(err => InternalSererErrorException())
    if (!quiz) NotFoundException('failed to create quiz')
    return { quizId: quiz!.id }
  }

  async getAllDiplomaQuizzes(diplomaId: Types.ObjectId) {
    const diploma = await this._diplomaRepo
      .findDocumentById({
        id: diplomaId,
      })
      .catch(err => InternalSererErrorException())

    if (!diploma) NotFoundException('diploma not found')
    const quizzes = await this._quizRepo
      .findAllDocuments({
        filter: { diplomaId: diplomaId },
      })
      .catch(err => InternalSererErrorException())
    if (!quizzes.length) NotFoundException('quiz not found')

    return quizzes
  }

  async getQuizById(quizId: Types.ObjectId) {
    const quiz = await this._quizRepo
      .findDocumentById({
        id: quizId,
      })
      .catch(() => InternalSererErrorException())

    if (!quiz) {
      NotFoundException('quiz not found')
    }

    return quiz
  }

  async updateQuiz(
    quizId: Types.ObjectId,
    updatedData: updateQuiz,
    userId: Types.ObjectId,
  ) {
    const { desc, img, name, quizType, time } = updatedData
    let quiz = await this._quizRepo
      .findDocumentById({
        id: quizId,
      })
      .catch(() => InternalSererErrorException())

    if (!quiz) {
      NotFoundException('quiz not found')
    }

    quiz = await this._quizRepo
      .updateDocumentById({
        id: quizId,
        update: {
          desc,
          img,
          name,
          quizType,
          time,
          updatedAt: new Date(),
          updatedBy: userId,
        },
      })
      .catch(() => InternalSererErrorException())

    if (!quiz) {
      NotFoundException()
    }

    return quiz
  }

  async deleteQuiz(quizId: Types.ObjectId, userId: Types.ObjectId) {
    const quiz = await this._quizRepo.updateDocumentById({
      id: quizId,
      update: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    })
    if (!quiz) NotFoundException()
    return quiz
  }

  async startQuiz(quizId: Types.ObjectId, user: HydratedUserDoc) {
    // 1. Verify the quiz exists
    const quiz = await this._quizRepo
      .findDocumentById({ id: quizId })
      .catch((err: any) => {
        console.error('startQuiz: quiz lookup failed', err)
        InternalSererErrorException()
      })

    if (!quiz) {
      NotFoundException('Quiz not found')
    }

    // 2. Load questions + answers together, so we fail fast if there's nothing to attempt
    const questions = await this._questionRepo
      .findAllDocuments({
        filter: { quizId },
        options: {
          populate: [
            {
              path: 'answers',
              select: 'answer correct',
              match: { deletedAt: { $exists: false } },
            },
          ],
        },
      })
      .catch((err: any) => {
        console.error('startQuiz: question lookup failed', err)
        InternalSererErrorException()
      })

    if (!questions?.length) {
      NotFoundException('This quiz has no questions to attempt')
    }

    // 3. Create the attempt record
    const quizAttempt = await this._quizAttemptRepo
      .create({
        data: {
          quizId,
          userId: user._id,
          time_started: new Date(),
        },
      })
      .catch((err: any) => {
        console.error('startQuiz: attempt creation failed', err)
        InternalSererErrorException(
          'Failed to start quiz due to a server error',
        )
      })

    if (!quizAttempt) {
      InternalSererErrorException('Failed to start quiz due to a server error')
    }

    // 4. Build a snapshot the client can render — never expose `correct` to the client
    const snapshot = questions.map((q: any) => ({
      questionId: q._id,
      question: q.question,
      multipleAnswer: q.multipleAnswer,
      answers: (q.answers ?? []).map((a: any) => ({
        answerId: a._id,
        answer: a.answer,
      })),
    }))

    // 5. Persist the snapshot for grading later (answers WITH `correct` kept server-side)
    const gradingSheet = questions.map((q: any) => ({
      questionId: q._id,
      correctAnswerIds: (q.answers ?? [])
        .filter((a: any) => a.correct)
        .map((a: any) => a._id),
    }))

    // await this._snapShotRepo
    //   .create({
    //     data: {
    //       quizAttemptId: quizAttempt?.id!,
    //       sheet: gradingSheet,
    //     },
    //   })
    //   .catch((err: any) => {
    //     console.error('startQuiz: snapshot creation failed', err)
    //     InternalSererErrorException('Failed to save quiz snapshot')
    //   })

    return {
      quizAttemptId: quizAttempt?.id!,
      questions: snapshot,
    }
  }

  async submitQuiz(
    quizId: Types.ObjectId,
    user: HydratedUserDoc,
    quizAttemptId: Types.ObjectId,
    data: finishQuizAttemptDataDTO,
  ) {
    // 1. Verify quiz + attempt exist and belong to this user
    const quiz: HydratedQuizDoc = await this._quizRepo
      .findDocumentById({ id: quizId })
      .catch((err: any) => {
        console.error('submitQuiz: quiz lookup failed', err)
        InternalSererErrorException()
      })

    if (!quiz) {
      NotFoundException('Quiz not found')
    }

    const quizAttempt: HydratedQuizAttemptDoc = await this._quizAttemptRepo
      .findOneDocument({
        filter: { id: quizAttemptId, user_id: user.id, quiz_id: quizId },
      })
      .catch((err: any) => {
        console.error('submitQuiz: attempt lookup failed', err)
        InternalSererErrorException()
      })

    if (!quizAttempt) {
      NotFoundException('Quiz attempt not found')
    }

    if (quizAttempt.time_finished) {
      BadRequestException('This quiz attempt has already been submitted')
    }

    // 2. Enforce the time limit
    const maxAllowedTimeMs =
      quizAttempt.time_started.getTime() + (quiz.time * 60 + 10) * 1000 // 10s grace period for network latency

    if (Date.now() > maxAllowedTimeMs) {
      BadRequestException('Quiz attempt time has expired')
    }

    if (!data?.length) {
      BadRequestException('No answers submitted')
    }

    // 3. Fetch all questions + their canonical answers straight from the DB —
    // no snapshot model involved, so grading always reflects current data.
    const questionIds = data.map(q => q.questionId)

    const questions: HydratedQuestionDoc[] = await this._questionRepo
      .findAllDocuments({
        filter: { _id: { $in: questionIds }, quizId },
      })
      .catch((err: any) => {
        console.error('submitQuiz: question lookup failed', err)
        InternalSererErrorException()
      })

    if (questions.length !== questionIds.length) {
      BadRequestException(
        'One or more submitted questions do not belong to this quiz',
      )
    }

    const answerSheets: HydratedAnswerDoc[] = await this._answerRepo
      .findAllDocuments({
        filter: { question_id: { $in: questionIds } },
      })
      .catch((err: any) => {
        console.error('submitQuiz: answer lookup failed', err)
        InternalSererErrorException()
      })

    const answersByQuestion = new Map<string, HydratedAnswerDoc[]>()
    for (const answer of answerSheets) {
      const key = answer.question_id.toString()
      if (!answersByQuestion.has(key)) answersByQuestion.set(key, [])
      answersByQuestion.get(key)!.push(answer)
    }

    // 4. Score each submitted question against its canonical answer sheet
    let total_correct_answers = 0
    let total_wrong_answers = 0

    for (const quest of data) {
      const answer_sheet =
        answersByQuestion.get(quest.questionId.toString()) ?? []

      // Guard against forged/stale answer IDs that don't belong to this question
      const validAnswerIds = new Set(answer_sheet.map(a => a._id.toString()))
      const submittedIds: string[] = quest.answers ?? []
      const hasInvalidAnswer = submittedIds.some(
        id => !validAnswerIds.has(id.toString()),
      )

      if (hasInvalidAnswer) {
        BadRequestException(
          `One or more submitted answers do not belong to question ${quest.questionId}`,
        )
      }

      const { correct_answers, incorrect_answers } = calculateScoreTotals(
        quest.answers,
        answer_sheet,
      )

      total_correct_answers += correct_answers
      total_wrong_answers += incorrect_answers
    }

    const score_percentage = calculateScorePercentage(
      total_correct_answers,
      total_wrong_answers,
    )

    const time_finished = new Date()
    const time_spent_ms =
      time_finished.getTime() - quizAttempt.time_started.getTime()

    // 5. Persist results
    const updateResult = await this._quizAttemptRepo
      .updateDocumentById({
        id: quizAttemptId,
        update: {
          correct_answers: total_correct_answers,
          incorrect_answers: total_wrong_answers,
          score_percentage,
          time_finished,
          time_spent: time_spent_ms,
        },
      })
      .catch((err: any) => {
        console.error('submitQuiz: attempt update failed', err)
        InternalSererErrorException('Failed to save quiz results')
      })

    if (!updateResult) {
      InternalSererErrorException('Failed to save quiz results')
    }

    return {
      score_percentage,
      correct_answers: total_correct_answers,
      incorrect_answers: total_wrong_answers,
      time_finished: updateResult.time_finished,
      time_spent: updateResult.time_spent,
    }
  }
}
export default new quizService()
