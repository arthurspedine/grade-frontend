import { handleClassesList } from '@/app/(home)/classes/_http/handle-http-class'
import { Title } from '@/components/title'
import type { ClassType } from '@/types'
import { AddAssessmentForm } from './_components/add-assessment-form'
import { redirect } from 'next/navigation'
import { encodeText } from '@/helper/base64-search-params'

export const dynamic = 'force-dynamic'

export default async function AddAssessmentPage() {
  const classList: ClassType[] = await handleClassesList()

  if (classList.length === 0) {
    redirect(`/classes/add?returnTo=${encodeText('/assessments/add')}`)
  }

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>Adicionar Avaliação</Title>
      <AddAssessmentForm classList={classList} />
    </section>
  )
}
