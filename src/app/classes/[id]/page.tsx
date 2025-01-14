import { Title } from '@/components/title'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import { isValid } from '@/helper/validate-uuid'
import type { ClassInfoType } from '@/types'
import { redirect } from 'next/navigation'
import { StudentsTable } from '../_components/students-table'
import getCategoryOptions from '../_http/handle-category-options'

export default async function ClassInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!isValid(id)) {
    redirect('/classes')
  }

  const categoryList = await getCategoryOptions()

  const classInfo: ClassInfoType = await authenticatedFetch(`/classes/${id}`)
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow max-h-screen'>
      <div className='flex items-center justify-between'>
        <Title>
          Turma <span className='italic'>{classInfo.details.name}</span>
        </Title>
        <div
          className={`px-4 py-2 bg-${classInfo.details.active ? 'green' : 'red'}-600 rounded-xl text-secondary font-medium`}
        >
          <p>{classInfo.details.active ? 'ATIVA' : 'INATIVA'}</p>
        </div>
      </div>
      <p>
        Categoria:{' '}
        {categoryList.find(c => c.key === classInfo.details.category)?.label}
      </p>
      <StudentsTable students={classInfo.students} className='my-8' />
    </section>
  )
}
