import type { AssessmentStudentType } from './types'

interface BaseStudentEvaluation {
  student: AssessmentStudentType
  evaluationCompleted: boolean
  rawFeedback: string
  finalFeedback: string
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
    categories: {
      id: string
      name: string
      score: number
      answeredScore: number
    }[]
  }[]
  totalScore: number
}
