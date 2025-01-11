import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import getCategoryOptions from '../../_http/handle-education-options'
import { authenticatedFetch } from '@/helper/authenticated-fetch'

export default async function AddClassPage({
  params,
}: { params: { id: string } }) {
  const { id } = await params
  if (!isValid(id)) {
    redirect('/classes')
  }
  const categoryList = await getCategoryOptions()

  const classInfo = await authenticatedFetch(`/classes/${id}`)

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <h1 className='font-bold text-2xl'>Editar turma {id}</h1>
      {/* <AddClassForm categoryList={mappedCategoryList} /> */}
    </section>
  )
}
