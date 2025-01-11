import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import getCategoryOptions from '../../_http/handle-education-options'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type { ClassInfoType } from '@/types'
import { Title } from '@/components/title'

export default async function AddClassPage({
  params,
}: { params: { id: string } }) {
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
      {/* <AddClassForm categoryList={mappedCategoryList} /> */}
    </section>
  )
}
