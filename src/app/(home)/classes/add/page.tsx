import { Title } from '@/components/title'
import { AddClassForm } from './_components/add-class-form'
import { GoBackButton } from '@/components/go-back-button'

export default function AddClassPage() {
  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <div className='flex justify-between'>
        <Title>Adicionar Nova Turma</Title>
        <GoBackButton goBackUrl='/classes' />
      </div>
      <AddClassForm />
    </section>
  )
}
