import type { Types } from 'mongoose'
import type { HydratedAnswerDoc } from '../questions/question.model.js'

export function calculateScoreTotals(
  selectedAnswers: Array<Types.ObjectId | string>,
  answerSheet: HydratedAnswerDoc[],
) {
  let correct_answers = 0
  let incorrect_answers = 0

  for (const selectedAnswer of selectedAnswers) {
    const matchedAnswer = answerSheet.find(
      answer => String(answer.id) === String(selectedAnswer),
    )

    if (!matchedAnswer) continue

    if (matchedAnswer.correct) correct_answers += 1
    else incorrect_answers += 1
  }

  return { correct_answers, incorrect_answers }
}

export function calculateScorePercentage(
  correct_answers: number,
  incorrect_answers: number,
) {
  const total = correct_answers + incorrect_answers
  if (total === 0) return 0
  return (correct_answers / total) * 100
}
