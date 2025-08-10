'use client'

import { Title } from '@/components/title'
import { AddAssessmentForm } from './_components/add-assessment-form'
import { AddAssessmentSkeleton } from './_components/add-assessment-skeleton'
import { useAddAssessment } from '@/hooks/useAddAssessment'
import { redirect } from 'next/navigation'
import { encodeText } from '@/helper/base64-search-params'
import { Button } from '@/components/ui/button'

export default function AddAssessmentPage() {
  const { classList, loading, error, hasClasses } = useAddAssessment()

  if (loading) {
    return <AddAssessmentSkeleton />
  }

  if (error) {
    return (
      <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold text-destructive mb-2'>
            Erro ao carregar dados
          </h2>
          <p className='text-muted-foreground mb-4'>{error}</p>
          <Button onClick={() => window.location.reload()} variant='outline'>
            Tentar novamente
          </Button>
        </div>
      </section>
    )
  }

  if (!hasClasses) {
    return (
      <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold mb-2'>
            Nenhuma turma encontrada
          </h2>
          <p className='text-muted-foreground mb-4'>
            Você precisa criar pelo menos uma turma antes de adicionar uma
            avaliação.
          </p>
          <Button
            onClick={() => {
              redirect(
                `/classes/add?returnTo=${encodeText('/assessments/add')}`
              )
            }}
          >
            Criar primeira turma
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>Adicionar Avaliação</Title>
      <AddAssessmentForm classList={classList} />
    </section>
  )
}
