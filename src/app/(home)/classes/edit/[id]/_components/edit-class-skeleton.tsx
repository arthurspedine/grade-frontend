import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Skeleton } from '@/components/ui/skeleton'
import {} from '@/components/ui/table'
import { StudentTablesSkeleton } from '../../../_components/students-table-skeleton'

export function EditClassSkeleton() {
  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      {/* Title skeleton */}
      <div className='flex items-center gap-2'>
        <Title>Editar turma</Title>
        <Skeleton className='h-8 w-32' /> {/* Class name */}
      </div>

      {/* Form skeleton */}
      <div className='w-full space-y-6 px-8 py-4'>
        {/* Name and Category row */}
        <div className='w-full flex justify-between items-start'>
          <div className='w-1/2 flex items-center gap-2'>
            <span className='text-base font-medium'>Nome:</span>
            <Skeleton className='h-10 w-full' /> {/* Name input */}
          </div>
          <div className='w-1/2 flex flex-col items-end space-y-1'>
            <div className='flex items-center space-x-2'>
              <span className='text-base font-medium'>Categoria:</span>
              <Skeleton className='h-10 w-[180px]' /> {/* Category select */}
            </div>
          </div>
        </div>

        {/* CSV upload section */}
        <div className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-60' /> {/* "Arquivo CSV" label */}
            <Skeleton className='size-9' /> {/* Info icon */}
          </div>
          <div className='flex gap-2'>
            <GoBackButton goBackUrl='/classes' />
            <Skeleton className='h-9 w-32' />
          </div>
        </div>

        {/* Students table skeleton */}
        <div className='space-y-4'>
          <StudentTablesSkeleton />
        </div>
      </div>
    </section>
  )
}
