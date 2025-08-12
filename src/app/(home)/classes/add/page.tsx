import { GoBackButton } from '@/components/go-back-button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Title } from '@/components/title'
import { Suspense } from 'react'
import { AddClassForm } from './_components/add-class-form'

export default function AddClassPage() {
  return (
    <>
      <div className='flex justify-between'>
        <Title>Adicionar Nova Turma</Title>
        <GoBackButton goBackUrl='/classes' />
      </div>
      <Suspense
        fallback={
          <div className='flex justify-center py-4'>
            <LoadingSpinner />
          </div>
        }
      >
        <AddClassForm />
      </Suspense>
    </>
  )
}
