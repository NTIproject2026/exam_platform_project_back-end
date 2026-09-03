import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { Types } from 'mongoose'

import quizService from '../quiz.service.js'
import questionService from '../questions/question.service.js'
import quizRepo from '../../../DataBase/repos/quiz.repo.js'
import questionRepo from '../../../DataBase/repos/question.repo.js'
import quizAttemptRepo from '../../../DataBase/repos/quizAttempt.repo.js'
import answerRepo from '../../../DataBase/repos/answer.repo.js'
import quizSnapShotsRepo from '../../../DataBase/repos/quizSnapShots.repo.js'
import { QuestionModel } from '../questions/question.model.js'

describe('Quiz Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should expose an answers virtual for question population', () => {
    const answersVirtual = QuestionModel.schema.virtuals.answers

    expect(answersVirtual).toBeDefined()
    expect(answersVirtual.options.ref).toBe('answers')
    expect(answersVirtual.options.localField).toBe('_id')
    expect(answersVirtual.options.foreignField).toBe('question_id')
  })

  it('should return quiz details when quiz exists', async () => {
    const quizId = new Types.ObjectId()
    const mockQuiz = {
      _id: quizId,
      name: 'Sample Quiz',
      desc: 'A sample quiz',
      time: 15,
      img: 'image.png',
      quizType: 'practice',
    }

    jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(mockQuiz as any)

    const result = await quizService.getQuizById(quizId)

    expect(result).toBe(mockQuiz)
    expect(quizRepo.findDocumentById).toHaveBeenCalledWith({ id: quizId })
  })

  it('should throw when quiz does not exist', async () => {
    const quizId = new Types.ObjectId()
    jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(null)

    await expect(quizService.getQuizById(quizId)).rejects.toThrow()
  })

  // it('should return quiz questions when quiz exists', async () => {
  //   const quizId = new Types.ObjectId()
  //   const mockQuiz = { _id: quizId } as any
  //   const mockQuestions = [
  //     {
  //       _id: new Types.ObjectId(),
  //       quiz_id: quizId,
  //       question: 'What is 2 + 2?',
  //       answers: [{ answer: '4' }],
  //     },
  //   ]

  //   jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(mockQuiz)
  //   jest
  //     .spyOn(questionRepo, 'findAllDocuments')
  //     .mockResolvedValue(mockQuestions as any)

  //   const result = await quizService.getQuizQuestions(quizId)

  //   // expect(result).toBe(mockQuestions)
  //   // expect(questionRepo.findAllDocuments).toHaveBeenCalledWith({
  //   //   filter: { quiz_id: quizId },
  //   //   options: {
  //   //     populate: [
  //   //       {
  //   //         path: 'answers',
  //   //         match: { questionId: '$$questionId' },
  //   //         select: 'answer',
  //   //       },
  //   //     ],
  //   //   },
  //   // })
  // })

  // it('should throw when quiz questions are requested for a missing quiz', async () => {
  //   const quizId = new Types.ObjectId()
  //   jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(null)

  //   await expect(quizService.getQuizQuestions(quizId)).rejects.toThrow()
  // })

  it('should update quiz metadata successfully', async () => {
    const quizId = new Types.ObjectId()
    const userId = new Types.ObjectId()
    const updateData = {
      quizData: { name: 'Updated Quiz', desc: 'Updated desc' },
    }
    const mockQuiz = { _id: quizId } as any

    jest.spyOn(quizRepo, 'updateDocumentById').mockResolvedValue(mockQuiz)

    const result = await quizService.updateQuiz(
      quizId,
      updateData as any,
      userId,
    )

    // expect(result).toBe(' data updated ')
    expect(quizRepo.updateDocumentById).toHaveBeenCalled()
  })

  it('should throw when updating a quiz that does not exist', async () => {
    const quizId = new Types.ObjectId()
    const userId = new Types.ObjectId()

    const updateData = { quizData: { name: 'Updated Quiz' } }

    jest.spyOn(quizRepo, 'updateDocumentById').mockResolvedValue(null)

    await expect(
      quizService.updateQuiz(quizId, updateData as any, userId),
    ).rejects.toThrow()
  })

  it('should return question details by id', async () => {
    const questionId = new Types.ObjectId()
    const mockQuestion = {
      _id: questionId,
      question: 'What is the capital of France?',
      answers: [{ _id: new Types.ObjectId(), answer: 'Paris' }],
    }

    jest
      .spyOn(questionRepo, 'findDocumentById')
      .mockResolvedValue(mockQuestion as any)

    const result = await questionService.getQuestionById(questionId)

    expect(result).toBe(mockQuestion)
    expect(questionRepo.findDocumentById).toHaveBeenCalledWith({
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
  })

  it('should update question body and save changes', async () => {
    const questionId = new Types.ObjectId()
    const answerId = new Types.ObjectId()
    const mockQuestion = {
      _id: questionId,
      answers: [{ id: answerId, answer: 'True', correct: true }],
      save: jest.fn().mockResolvedValue(true as never),
    } as any

    jest.spyOn(questionRepo, 'findDocumentById').mockResolvedValue(mockQuestion)
    jest
      .spyOn(questionRepo, 'updateDocumentById')
      .mockResolvedValue(mockQuestion)
    jest.spyOn(answerRepo, 'updateDocumentById').mockResolvedValue(mockQuestion)

    const result = await questionService.updateQuestionById(questionId, {
      question_body: {
        head: 'Is this a sample question?',
        multipleAnswer: true,
      },
      answer_sheet: [{ id: answerId, answer: 'True', correct: true }],
    } as any)

    expect(result).toBe('update succeed')
    expect(questionRepo.updateDocumentById).toHaveBeenCalled()
    expect(answerRepo.updateDocumentById).toHaveBeenCalled()
    expect(mockQuestion.save).not.toHaveBeenCalled()
  })

  it('should start a quiz attempt and return quiz attempt id with questions', async () => {
    const quizId = new Types.ObjectId()
    const userId = new Types.ObjectId()
    const mockUser = { _id: userId } as any
    const mockQuiz = { _id: quizId } as any
    const mockQuizAttempt = { id: new Types.ObjectId() } as any
    const mockQuestionsAndAnswers = [{ question: 'Example question' }]

    jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(mockQuiz)
    jest.spyOn(quizAttemptRepo, 'create').mockResolvedValue(mockQuizAttempt)
    jest
      .spyOn(questionRepo, 'findAllDocuments')
      .mockResolvedValue(mockQuestionsAndAnswers as any)
    jest.spyOn(quizSnapShotsRepo, 'create').mockResolvedValue({} as any)

    const result = await quizService.startQuiz(quizId, mockUser)

    expect(result).toEqual({
      quizAttemptId: mockQuizAttempt.id,
      questionsAndAnswers: mockQuestionsAndAnswers,
    })
    expect(quizAttemptRepo.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        quizId,
        time_started: expect.any(Date),
        user_id: userId,
      }) as any,
    })
  })

  it('should serialize populated answers into the snapshot sheet when starting a quiz', async () => {
    const quizId = new Types.ObjectId()
    const userId = new Types.ObjectId()
    const mockUser = { _id: userId, id: userId } as any
    const mockQuiz = { _id: quizId } as any
    const mockQuizAttempt = { id: new Types.ObjectId() } as any
    const populatedQuestion = {
      _id: new Types.ObjectId(),
      question: 'Example question',
      answers: [{ answer: 'Option 1' }],
      toObject: jest.fn().mockReturnValue({
        _id: new Types.ObjectId(),
        question: 'Example question',
        answers: [{ answer: 'Option 1' }],
      }),
    } as any

    jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(mockQuiz)
    jest.spyOn(quizAttemptRepo, 'create').mockResolvedValue(mockQuizAttempt)
    jest
      .spyOn(questionRepo, 'findAllDocuments')
      .mockResolvedValue([populatedQuestion] as any)
    jest.spyOn(quizSnapShotsRepo, 'create').mockResolvedValue({} as any)

    const result = await quizService.startQuiz(quizId, mockUser)

    expect(result.questionsAndAnswers).toEqual([
      expect.objectContaining({
        question: 'Example question',
        answers: [{ answer: 'Option 1' }],
      }),
    ])
    expect(quizSnapShotsRepo.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        quizAttemptId: mockQuizAttempt.id,
        sheet: [
          expect.objectContaining({
            question: 'Example question',
            answers: [{ answer: 'Option 1' }],
          }),
        ],
      }),
    })
  })

  it('should submit quiz answers and calculate score correctly', async () => {
    const quizId = new Types.ObjectId()
    const userId = new Types.ObjectId()
    const quizAttemptId = new Types.ObjectId()
    const selectedAnswerId = new Types.ObjectId()
    const now = Date.now()
    const mockQuiz = { id: quizId, time: 10 } as any
    const mockQuizAttempt = { time_started: new Date(now - 1000) } as any
    const mockQuestion = { id: new Types.ObjectId() } as any
    const mockAnswerSheet = [
      {
        id: selectedAnswerId,
        answer: 'Correct Answer',
        correct: true,
      },
    ] as any

    const timeFinished = new Date(now)
    const timeSpent = new Date(now - mockQuizAttempt.time_started.getTime())

    jest.spyOn(Date, 'now').mockReturnValue(now)
    jest.spyOn(quizRepo, 'findDocumentById').mockResolvedValue(mockQuiz)
    jest
      .spyOn(quizAttemptRepo, 'findOneDocument')
      .mockResolvedValue(mockQuizAttempt)
    jest.spyOn(questionRepo, 'findDocumentById').mockResolvedValue(mockQuestion)
    jest
      .spyOn(answerRepo, 'findAllDocuments')
      .mockResolvedValue(mockAnswerSheet)
    jest.spyOn(quizAttemptRepo, 'updateDocumentById').mockResolvedValue({
      time_finished: timeFinished,
      time_spent: timeSpent,
    } as any)

    const result = await quizService.submitQuiz(
      quizId,
      { _id: userId, id: userId } as any,
      quizAttemptId,
      [
        {
          questionId: mockQuestion.id,
          answers: [selectedAnswerId],
        },
      ] as any,
    )

    expect(result.correct_answers).toBe(1)
    expect(result.incorrect_answers).toBe(0)
    expect(result.score_percentage).toBe(100)
    expect(result.time_finished).toBeInstanceOf(Date)
    expect(result.time_spent).toBeInstanceOf(Date)
    expect(quizAttemptRepo.updateDocumentById).toHaveBeenCalledWith({
      id: quizAttemptId,
      update: expect.objectContaining({
        correct_answers: 1,
        incorrect_answers: 0,
        score_percentage: 100,
        time_finished: expect.any(Date),
        time_spent: expect.any(Date),
      }),
    })
  })
})
