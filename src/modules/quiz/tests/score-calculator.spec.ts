import { describe, it, expect } from '@jest/globals'
import { Types } from 'mongoose'
import {
  calculateScorePercentage,
  calculateScoreTotals,
} from '../utils/score-calculator.js'
import type { HydratedAnswerDoc } from '../quiz.model.js'

describe('Score Calculator', () => {
  it('should count correct and incorrect answers from selected answers', () => {
    const selectedAnswers = [
      new Types.ObjectId().toHexString(),
      new Types.ObjectId(),
    ]
    const answerSheet: HydratedAnswerDoc[] = [
      {
        id: selectedAnswers[0],
        answer: 'Answer A',
        correct: true,
      } as HydratedAnswerDoc,
      {
        id: selectedAnswers[1],
        answer: 'Answer B',
        correct: false,
      } as HydratedAnswerDoc,
    ]

    const result = calculateScoreTotals(selectedAnswers, answerSheet)

    expect(result.correct_answers).toBe(1)
    expect(result.incorrect_answers).toBe(1)
  })

  it('should return zero score when there are no answered items', () => {
    expect(calculateScorePercentage(0, 0)).toBe(0)
  })

  it('should calculate score percentage correctly', () => {
    expect(calculateScorePercentage(2, 1)).toBeCloseTo(66.667, 3)
  })
})
