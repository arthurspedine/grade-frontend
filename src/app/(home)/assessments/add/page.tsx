'use client'

import { Title } from '@/components/title'
import { encodeText } from '@/helper/base64-search-params'
import { useAddAssessment } from '@/hooks/useAddAssessment'
import { Plus } from 'lucide-react'
import { AddAssessmentForm } from './_components/add-assessment-form'
import { AddAssessmentSkeleton } from './_components/add-assessment-skeleton'
import { ErrorMessageContainer } from '@/components/error-message-container'
import { NoItemsCard } from '@/components/no-items-card'

export default function AddAssessmentPage() {
  const { classList, loading, error, hasClasses } = useAddAssessment()

  if (loading) {
    return <AddAssessmentSkeleton />
  }

  if (error) {
    return <ErrorMessageContainer message={error} />
  }

  if (!hasClasses) {
    return (
      <NoItemsCard
        title='Nenhuma turma encontrada'
        description='Você precisa criar pelo menos uma turma antes de adicionar uma avaliação.'
        buttonText='Criar primeira turma'
        buttonLink={`/classes/add?returnTo=${encodeText('/assessments/add')}`}
        Icon={Plus}
      />
    )
  }

  return (
    <>
      <Title>Adicionar Avaliação</Title>
      <AddAssessmentForm classList={classList} />
    </>
  )
}
