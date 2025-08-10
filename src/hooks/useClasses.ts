'use client'

import getCategoryOptions from '@/http/handle-category-options'
import { handleClassesList } from '@/http/handle-http-class'
import type { ClassType } from '@/types'
import { useEffect, useState } from 'react'

interface ClassesData {
  classesList: ClassType[]
  categoryList: { key: string; label: string }[]
}

interface UseClassesReturn {
  data: ClassesData
  loading: boolean
  error: string | null
}

export function useClasses(): UseClassesReturn {
  const [data, setData] = useState<ClassesData>({
    classesList: [],
    categoryList: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassesData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [classesList, categoryResponse] = await Promise.all([
          handleClassesList(),
          getCategoryOptions(),
        ])

        setData({
          classesList,
          categoryList: categoryResponse,
        })
      } catch (err) {
        console.error('Error fetching classes data:', err)
        setError('Erro ao carregar dados das turmas')
      } finally {
        setLoading(false)
      }
    }

    fetchClassesData()
  }, [])

  return { data, loading, error }
}
