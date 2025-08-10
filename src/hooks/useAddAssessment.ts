'use client'

import getCategoryOptions from '@/http/handle-category-options'
import { handleClassesList } from '@/http/handle-http-class'
import type { ClassType } from '@/types'
import { useEffect, useState } from 'react'

export function useAddAssessment() {
  const [classList, setClassList] = useState<ClassType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true)
        setError(null)

        const [classes, categoryList] = await Promise.all([
          handleClassesList(),
          getCategoryOptions(),
        ])

        // Map classes with proper category labels
        const mappedClasses = classes.map(c => ({
          ...c,
          category:
            categoryList.find(category => category.key === c.category)?.label ||
            c.category,
        }))

        setClassList(mappedClasses)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Erro ao carregar dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  return {
    classList,
    loading,
    error,
    hasClasses: classList.length > 0,
  }
}
