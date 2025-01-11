import { Title } from '@/components/title'
import getCategoryOptions from '../_http/handle-education-options'
import { AddClassForm } from './_components/add-class-form'

export default async function AddClassPage() {
  const categoryList: { key: string; label: string }[] =
    await getCategoryOptions()

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>Adicionar Nova Turma</Title>
      <AddClassForm categoryList={categoryList} />
    </section>
  )
}
