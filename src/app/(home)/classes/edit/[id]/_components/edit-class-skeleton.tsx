import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Skeleton } from '@/components/ui/skeleton'
import {} from '@/components/ui/table'
import { StudentTablesSkeleton } from '../../../_components/students-table-skeleton'

export function EditClassSkeleton() {
  return (
    <>
      {/* Title skeleton */}
      <div className='flex items-center gap-2'>
        <Title>Editar turma</Title>
        <Skeleton className='h-8 w-32' /> {/* Class name */}
      </div>

      {/* Form skeleton */}
      <div className='flex flex-col gap-4 px-2 py-4 lg:gap-8 lg:px-6'>
        {/* Name and Category row */}
        <div className='flex w-full flex-col gap-2 lg:flex-row'>
          {/* Name input */}
          <div className='flex w-full flex-col gap-1 lg:w-1/2'>
            <div className='flex items-center space-x-2'>
              <span className='font-medium text-base'>Nome:</span>
              <Skeleton className='h-9 flex-1' />
            </div>
          </div>

          {/* Category select */}
          <div className='flex w-full flex-col gap-1 lg:w-1/2'>
            <div className='flex items-center space-x-2'>
              <span className='font-medium text-base'>Categoria:</span>
              <Skeleton className='h-9 flex-1' />
            </div>
          </div>
        </div>

        {/* CSV upload section and buttons */}
        <div className='flex flex-col-reverse justify-between gap-4 sm:flex-row sm:gap-0'>
          <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
              <Skeleton className='h-9 w-full sm:w-60' /> {/* CSV file input */}
              <Skeleton className='size-10 lg:size-6' /> {/* Question icon */}
            </div>
          </div>
          <div className='flex space-x-2'>
            <GoBackButton
              className='grow justify-center text-center'
              goBackUrl='/classes'
            />
            <Skeleton className='h-9 grow sm:h-10' /> {/* Save button */}
          </div>
        </div>

        {/* Students table skeleton */}
        <StudentTablesSkeleton />
      </div>
    </>
  )
}
