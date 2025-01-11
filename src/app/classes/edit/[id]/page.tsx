'use server'
import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import getCategoryOptions from '../../_http/handle-category-options'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type { ClassInfoType } from '@/types'
import { Title } from '@/components/title'
import { EditClassForm } from './_components/edit-class-form'

export default async function AddClassPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isValid(id)) {
    redirect('/classes')
  }
  const categoryList = await getCategoryOptions()

  const classInfo: ClassInfoType = await authenticatedFetch(`/classes/${id}`)

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>
        Editar turma <span className='italic'>{classInfo.details.name}</span>
      </Title>
      <EditClassForm
        categoryList={categoryList}
        {...classInfo.details}
        classStudents={classInfo.students}
      />
    </section>
  )
}
