'use client'

import getCategoryOptions from '@/http/handle-category-options'
import { useEffect, useState } from 'react'

interface UseCategoriesReturn {
  categories: { key: string; label: string }[]
  loading: boolean
  error: string | null
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<
    { key: string; label: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getCategoryOptions()

        setCategories(response)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Erro ao carregar categorias')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
