'use server'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type { AddAssessmentFormType } from '@/schemas'
import { LIST_ASSESSMENTS_TAG } from '@/tags'
import type { AssessmentDetailsType } from '@/types'
import { revalidateTag } from 'next/cache'

export async function handleAssessmentsList() {
  return authenticatedFetch<AssessmentDetailsType[]>(
    '/assessments',
    { method: 'GET' },
    [LIST_ASSESSMENTS_TAG]
  )
}

export async function addAssessment(formData: AddAssessmentFormType) {
  const result = await authenticatedFetch<void>('/assessments', {
    method: 'POST',
    body: formData,
  })
  revalidateTag(LIST_ASSESSMENTS_TAG)
  return result
}
