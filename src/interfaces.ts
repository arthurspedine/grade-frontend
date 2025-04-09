import type { AssessmentStudentType } from './types'

interface BaseStudentEvaluation {
  student: AssessmentStudentType
  evaluationCompleted: boolean
}

export interface StudentEvaluationInfo extends BaseStudentEvaluation {
  questions: {
    questionNumber: number
    categories: {
      id: string
      name: string
      score: number
      answeredScore?: number
    }[]
  }[]
}

export interface StudentFinishedEvaluationInfo extends BaseStudentEvaluation {
  answers: {
    questionNumber: number
    categories: { name: string; score: number; answeredScore: number }[]
  }[]
  rawFeedback: string
  finalFeedback: string
  totalScore: number
}
