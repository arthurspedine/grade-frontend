'use client'

import { authenticatedFetch } from '@/helper/authenticated-fetch'
import getCategoryOptions from '@/http/handle-category-options'
import type { ClassInfoType } from '@/types'
import { useEffect, useState } from 'react'

interface EditClassData {
  classInfo: ClassInfoType | null
  categoryList: { key: string; label: string }[]
}

interface UseEditClassReturn {
  data: EditClassData
  loading: boolean
  error: string | null
}

export function useEditClass(id: string): UseEditClassReturn {
  const [data, setData] = useState<EditClassData>({
    classInfo: null,
    categoryList: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEditClassData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Artificial delay to see loading state
        await new Promise(resolve => setTimeout(resolve, 1000))

        const [classInfo, categoryResponse] = await Promise.all([
          authenticatedFetch<ClassInfoType>(`/classes/${id}`),
          getCategoryOptions(),
        ])

        setData({
          classInfo,
          categoryList: categoryResponse,
        })
      } catch (err) {
        console.error('Error fetching edit class data:', err)
        setError('Erro ao carregar dados da turma')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEditClassData()
    }
  }, [id])

  return { data, loading, error }
}
