import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { encodeText } from '@/helper/base64-search-params'
import { useAddAssessment } from '@/hooks/useAddAssessment'
import { redirect } from 'next/navigation'
import { AddAssessmentForm } from './_components/add-assessment-form'
import { AddAssessmentSkeleton } from './_components/add-assessment-skeleton'

export default function AddAssessmentPage() {
  const { classList, loading, error, hasClasses } = useAddAssessment()

  if (loading) {
    return <AddAssessmentSkeleton />
  }

  if (error) {
    return (
      <section className='mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-center px-8'>
        <div className='text-center'>
          <h2 className='mb-2 font-semibold text-destructive text-lg'>
            Erro ao carregar dados
          </h2>
          <p className='mb-4 text-muted-foreground'>{error}</p>
          <Button onClick={() => window.location.reload()} variant='outline'>
            Tentar novamente
          </Button>
        </div>
      </section>
    )
  }

  if (!hasClasses) {
    return (
      <section className='mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-center px-8'>
        <div className='text-center'>
          <h2 className='mb-2 font-semibold text-lg'>
            Nenhuma turma encontrada
          </h2>
          <p className='mb-4 text-muted-foreground'>
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
    <section className='mx-auto flex h-full w-full max-w-[1440px] flex-col px-8'>
      <Title>Adicionar Avaliação</Title>
      <AddAssessmentForm classList={classList} />
    </section>
  )
}
