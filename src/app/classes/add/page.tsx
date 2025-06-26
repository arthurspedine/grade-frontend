import { Title } from '@/components/title'
import getCategoryOptions from '../_http/handle-category-options'
import { AddClassForm } from './_components/add-class-form'
import { Suspense } from 'react'

export default async function AddClassPage() {
  const categoryList: { key: string; label: string }[] =
    await getCategoryOptions()

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>Adicionar Nova Turma</Title>
      <Suspense
        fallback={
          <p className='text-muted-foreground text-sm text-center'>
            Carregando...
          </p>
        }
      >
        <AddClassForm categoryList={categoryList} />
      </Suspense>
    </section>
  )
}
