'use server'

import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type {
  StudentEvaluationInfo,
  StudentFinishedEvaluationInfo,
} from '@/interfaces'
import type { AssessmentInfoType } from '@/types'

export async function handleGetAssessmentInfo(
  assessmentId: string,
  classId: string
): Promise<AssessmentInfoType | null> {
  return authenticatedFetch<AssessmentInfoType>(
    `/assessments/${assessmentId}/${classId}`
  )
    .then(result => {
      return result
    })
    .catch(e => {
      console.error('Error to get evaluation info: ', e)
      return null
    })
}

export async function handleGetStudentEvaluationInfo(id: string) {
  return authenticatedFetch<
    StudentEvaluationInfo | StudentFinishedEvaluationInfo
  >(`/evaluate/student/${id}`)
    .then(result => {
      return result
    })
    .catch(e => {
      console.error('Error to get evaluation info: ', e)
      return null
    })
}
