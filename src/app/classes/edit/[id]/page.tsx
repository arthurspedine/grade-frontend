import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import getCategoryOptions from '../../_http/handle-education-options'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
// import { AddClassForm } from './_components/add-class-form'

export default async function AddClassPage({
  params,
}: { params: { id: string } }) {
  const { id } = await params
  if (!isValid(id)) {
    redirect('/classes')
  }
  const categoryList: Record<string, string> = await getCategoryOptions()
  const mappedCategoryList = Object.entries(categoryList).map(
    ([key, value]) => {
      return {
        key,
        label: value,
      }
    }
  )

  const classInfo = await authenticatedFetch(`/classes/${id}`)
  console.log(classInfo)

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <h1 className='font-bold text-2xl'>Editar turma {id}</h1>
      {/* <AddClassForm categoryList={mappedCategoryList} /> */}
    </section>
  )
}
