'use client'

import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type {
  ClassPerformanceType,
  DashboardStatsType,
  PendingAssessmentType,
} from '@/types'
import { useEffect, useState } from 'react'

interface DashboardData {
  stats: DashboardStatsType | null
  assessments: PendingAssessmentType[]
  classes: ClassPerformanceType[]
}

interface UseDashboardReturn {
  data: DashboardData
  loading: boolean
  error: string | null
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    assessments: [],
    classes: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [stats, assessments, classes] = await Promise.all([
          authenticatedFetch<DashboardStatsType>('/dashboard/stats'),
          authenticatedFetch<PendingAssessmentType[]>('/assessments/pending'),
          authenticatedFetch<ClassPerformanceType[]>('/classes/performance'),
        ])

        setData({
          stats,
          assessments,
          classes,
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return { data, loading, error }
}
