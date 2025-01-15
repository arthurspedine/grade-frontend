'use server'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type { AddAssessmentFormType } from '@/schemas'
import type { AssessmentDetailsType } from '@/types'

export async function handleAssessmentsList() {
  return authenticatedFetch<AssessmentDetailsType[]>('/assessments')
}

export async function addAssessment(formData: AddAssessmentFormType) {
  return authenticatedFetch<void>('/assessments', {
    method: 'POST',
    body: formData,
  })
}
