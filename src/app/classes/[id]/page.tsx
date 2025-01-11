import { Title } from '@/components/title'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import { isValid } from '@/helper/validate-uuid'
import type { ClassInfoType } from '@/types'
import { redirect } from 'next/navigation'

export default async function ClassInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!isValid(id)) {
    redirect('/classes')
  }

  const classInfo: ClassInfoType = await authenticatedFetch(`/classes/${id}`)
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      <Title>
        Turma <span className='italic'>{classInfo.details.name}</span>
      </Title>
    </section>
  )
}
