'use client'
import { handleAssessmentsList } from '@/http/handle-http-assessments'
import type { AssessmentDetailsType } from '@/types'
import { useEffect, useState } from 'react'

interface UseAssessmentsReturn {
  data: AssessmentDetailsType[]
  loading: boolean
  error: string | null
}

export function useAssessments(): UseAssessmentsReturn {
  const [data, setData] = useState<AssessmentDetailsType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true)
        setError(null)

        const assessmentsList = await handleAssessmentsList()

        setData(assessmentsList)
      } catch (err) {
        console.error('Error fetching assessments:', err)
        setError('Erro ao carregar avaliações')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  return { data, loading, error }
}
