import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Calendar, ClipboardCheck } from 'lucide-react'

export function DashboardSkeleton() {
  return (
    <>
      {/* Stats cards skeleton */}
      <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3'>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {/* Upcoming assessments skeleton */}
        <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
          <div className='border-card border-b p-6'>
            <h2 className='flex items-center font-semibold text-xl'>
              <Calendar className='mr-2 text-bluecolor' size={20} />
              Avaliações não finalizadas
            </h2>
          </div>
          <div>
            <AssessmentItemSkeleton />
            <AssessmentItemSkeleton />
            <AssessmentItemSkeleton />
            <div className='p-4 text-center'>
              <Skeleton className='mx-auto h-4 w-40' />
            </div>
          </div>
        </div>

        {/* Performance and quick actions skeleton */}
        <div>
          {/* Performance skeleton */}
          <div className='mb-4 overflow-hidden rounded-lg bg-accent shadow-md'>
            <div className='border-card border-b p-6'>
              <h2 className='flex items-center font-semibold text-xl'>
                <BarChart className='mr-2 text-bluecolor' size={20} />
                Performance das turmas
              </h2>
            </div>
            <div className='space-y-4 p-6'>
              <PerformanceItemSkeleton />
              <PerformanceItemSkeleton />
              <PerformanceItemSkeleton />
            </div>
          </div>

          {/* Quick actions skeleton */}
          <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
            <div className='border-card border-b p-6'>
              <h2 className='flex items-center font-semibold text-xl'>
                <ClipboardCheck className='mr-2 text-bluecolor' size={20} />
                Ações rápidas
              </h2>
            </div>
            <div className='space-y-2 p-4'>
              <QuickActionSkeleton />
              <QuickActionSkeleton />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCardSkeleton() {
  return (
    <div className='flex items-center rounded-lg bg-accent p-6 shadow-md'>
      <Skeleton className='mr-4 size-12 rounded-full' />
      <div className='flex-1'>
        <Skeleton className='mb-2 h-3 w-16' />
        <Skeleton className='h-6 w-12' />
      </div>
    </div>
  )
}

function AssessmentItemSkeleton() {
  return (
    <div className='border-input border-b p-4 last:border-0'>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <Skeleton className='mb-2 h-4 w-32' />
          <Skeleton className='h-3 w-24' />
        </div>
        <Skeleton className='h-3 w-16' />
      </div>
    </div>
  )
}

function PerformanceItemSkeleton() {
  return (
    <>
      <div className='mb-1 flex justify-between'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-8' />
      </div>
      <Skeleton className='h-2 w-full rounded-full' />
    </>
  )
}

function QuickActionSkeleton() {
  return (
    <div className='flex h-9 items-center px-4 py-2'>
      <Skeleton className='mr-3 size-7 rounded-md' />
      <Skeleton className='h-4 w-32' />
    </div>
  )
}
