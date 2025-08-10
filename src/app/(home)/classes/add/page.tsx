import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { AddClassForm } from './_components/add-class-form'

export default function AddClassPage() {
  return (
    <section className='mx-auto flex h-full w-full max-w-[1440px] flex-col px-8'>
      <div className='flex justify-between'>
        <Title>Adicionar Nova Turma</Title>
        <GoBackButton goBackUrl='/classes' />
      </div>
      <AddClassForm />
    </section>
  )
}
