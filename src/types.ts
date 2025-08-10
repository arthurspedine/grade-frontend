export type ClassType = {
  id: string
  name: string
  category: string
  active: boolean
}

export type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // biome-ignore lint/suspicious/noExplicitAny: receive any context
  body?: any
}

export type StudentType = {
  rm: string
  name: string
}

export type ClassInfoType = {
  details: ClassType
  students: StudentType[]
}

export type AssessmentDetailsType = {
  id: string
  name: string
  assessmentDate: string
  classes: {
    id: string
    name: string
    countEvaluatedStudents: number
    countStudents: number
  }[]
}

export type AssessmentStudentType = {
  id: string
  assessmentId: string
  classId: string
  rm: string
  name: string
}

export type AssessmentInfoType = {
  name: string
  countEvaluatedStudents: number
  students: {
    info: AssessmentStudentType
    evaluationCompleted: boolean
  }[]
}

export type AiGeneratedFeedbackType = {
  message: string
}

export type DashboardStatsType = {
  totalStudents: number
  totalClasses: number
  totalAssessments: number
}

export type PendingAssessmentType = {
  id: string
  name: string
  assessmentDate: string
  classesCount: number
}

export type ClassPerformanceType = {
  id: string
  name: string
  performanceRate: number
}
