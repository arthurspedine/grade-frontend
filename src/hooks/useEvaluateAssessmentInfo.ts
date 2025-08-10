import { isValid } from '@/helper/validate-uuid'
import { handleGetAssessmentInfo } from '@/http/handle-http-evaluate'
import type { AssessmentInfoType } from '@/types'
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface UseEvaluateAssessmentProps {
  assessmentId: string
  classId: string
}

interface UseEvaluateAssessmentReturn {
  assessmentInfo: AssessmentInfoType | null
  loading: boolean
  error: string | null
}

export function useEvaluateAssessmentInfo({
  assessmentId,
  classId,
}: UseEvaluateAssessmentProps): UseEvaluateAssessmentReturn {
  const [assessmentInfo, setAssessmentInfo] =
    useState<AssessmentInfoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssessmentInfo = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isValid(assessmentId) || !isValid(classId)) {
        redirect('/assessments')
      }

      const data = await handleGetAssessmentInfo(assessmentId, classId)

      if (!data) {
        redirect('/assessments')
      }

      setAssessmentInfo(data)
    } catch (err) {
      console.error('Erro ao buscar informações da avaliação:', err)
      setError('Erro ao carregar informações da avaliação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [assessmentId, classId])

  useEffect(() => {
    fetchAssessmentInfo()
  }, [fetchAssessmentInfo])

  return {
    assessmentInfo,
    loading,
    error,
  }
}
