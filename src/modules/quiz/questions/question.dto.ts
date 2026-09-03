import type { Types } from 'mongoose'

export type updateQuestionByIdDTO = {
  question_body?: { head?: string; multipleAnswer?: boolean }
  answer_sheet?: Array<{
    id: Types.ObjectId
    answer: string
    correct: boolean
  }>
}
