'use client'

import { authenticatedFetch } from '@/helper/authenticated-fetch'
import getCategoryOptions from '@/http/handle-category-options'
import type { ClassInfoType } from '@/types'
import { useEffect, useState } from 'react'

interface ClassDetailsData {
  classInfo: ClassInfoType | null
  categoryList: { key: string; label: string }[]
}

interface UseClassDetailsReturn {
  data: ClassDetailsData
  loading: boolean
  error: string | null
}

export function useClassDetails(id: string): UseClassDetailsReturn {
  const [data, setData] = useState<ClassDetailsData>({
    classInfo: null,
    categoryList: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const [classInfo, categoryResponse] = await Promise.all([
          authenticatedFetch<ClassInfoType>(`/classes/${id}`),
          getCategoryOptions(),
        ])

        setData({
          classInfo,
          categoryList: categoryResponse,
        })
      } catch (err) {
        console.error('Error fetching class details:', err)
        setError('Erro ao carregar dados da turma')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClassDetails()
    }
  }, [id])

  return { data, loading, error }
}
