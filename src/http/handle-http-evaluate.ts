'use server'

import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type {
  StudentEvaluationInfo,
  StudentFinishedEvaluationInfo,
} from '@/interfaces'
import { LIST_ASSESSMENTS_TAG } from '@/tags'
import type { AiGeneratedFeedbackType, AssessmentInfoType } from '@/types'
import { revalidateTag } from 'next/cache'

export async function handleGetAssessmentInfo(
  assessmentId: string,
  classId: string
): Promise<AssessmentInfoType | null> {
  return await authenticatedFetch<AssessmentInfoType>(
    `/assessments/${assessmentId}/${classId}`
  )
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

export async function getChatFeedback(
  answeredCategories: string,
  rawFeedback: string
) {
  return await authenticatedFetch<AiGeneratedFeedbackType>('/evaluate/chat', {
    method: 'POST',
    body: { answeredCategories, rawFeedback },
  })
}

export async function handleFinishEvaluation(formData: StudentEvaluationInfo) {
  const result = await authenticatedFetch<void>(
    `/evaluate/student/${formData.student.id}/finish`,
    {
      method: 'POST',
      body: formData,
    }
  )
  revalidateTag(LIST_ASSESSMENTS_TAG)
  return result
}
