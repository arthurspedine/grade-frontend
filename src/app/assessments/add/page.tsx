import { handleClassesList } from '@/app/classes/_http/handle-http-class'
import { Title } from '@/components/title'
import type { ClassType } from '@/types'
import { AddAssessmentForm } from './_components/add-assessment-form'

export default async function AddAssessmentPage() {
  const classList: ClassType[] = await handleClassesList()

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>Adicionar Avaliação</Title>
      <AddAssessmentForm classList={classList} />
    </section>
  )
}
