'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type {
  StudentEvaluationInfo,
  StudentFinishedEvaluationInfo,
} from '@/interfaces'
import { LIST_ASSESSMENTS_TAG } from '@/tags'
import type { AiGeneratedFeedbackType, AssessmentInfoType } from '@/types'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

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
  return await authenticatedFetch<AiGeneratedFeedbackType>(
    '/evaluate/feedback',
    {
      method: 'POST',
      body: { answeredCategories, rawFeedback },
    }
  )
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

export async function handleDownloadEvaluationPDF(id: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.error === 'RefreshAccessTokenError') {
    redirect('/auth/signin?error=SessionExpired')
  }

  if (!session.idToken) {
    redirect('/auth/signin?error=TokenMissing')
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session?.idToken}`,
    'Content-Type': 'application/json',
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/evaluate/student/${id}/feedback-file`,
    {
      method: 'GET',
      headers,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to download PDF file.')
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get('Content-Disposition')
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
    : 'feedback.pdf'

  // Convert blob to base64 to send to client
  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  return {
    data: base64,
    filename,
    contentType: 'application/pdf',
  }
}
