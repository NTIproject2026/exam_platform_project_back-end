import type { Types } from 'mongoose'

export type createQuizDTO = {
  name: string
  desc: string
  time: number
  img: string
  quizType: string
  diplomaId: Types.ObjectId
}

export type updateQuiz = {
  name?: string
  desc?: string
  time?: number
  img?: string
  quizType?: string
}

export type finishQuizAttemptDataDTO = [
  {
    questionId: Types.ObjectId
    answers: string[]
  },
]

export type addQuestionToQuizDTO = {
  questionData: {
    head: string
    multipleAnswer: boolean
  }
  answer_sheet: [
    {
      answer: string
      correct: boolean
    },
  ]
}
