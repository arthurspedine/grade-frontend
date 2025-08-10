import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Skeleton } from '@/components/ui/skeleton'
import {} from '@/components/ui/table'
import { StudentTablesSkeleton } from '../../_components/students-table-skeleton'

export function ClassDetailsSkeleton() {
  return (
    <section className='mx-auto max-h-screen w-full max-w-[1440px] flex-grow px-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Title>Turma</Title>
          <Skeleton className='h-8 w-32' /> {/* Class name */}
        </div>
        <GoBackButton goBackUrl='/classes' />
      </div>

      <div className='flex items-center gap-1'>
        Categoria: <Skeleton className='h-4 w-48' /> {/* Category info */}
      </div>

      {/* Students table skeleton */}
      <div className='my-8'>
        <StudentTablesSkeleton />
      </div>
    </section>
  )
}
