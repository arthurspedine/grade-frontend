import { Title } from '@/components/title'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Calendar, ClipboardCheck } from 'lucide-react'

export function DashboardSkeleton() {
  return (
    <div className='flex flex-col flex-grow'>
      <section className='max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4'>
        <Title>Dashboard</Title>

        {/* Stats cards skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 my-4'>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Upcoming assessments skeleton */}
          <div className='bg-accent rounded-lg shadow-md overflow-hidden'>
            <div className='p-6 border-b border-card'>
              <h2 className='font-semibold text-xl flex items-center'>
                <Calendar className='mr-2 text-bluecolor' size={20} />
                Avaliações não finalizadas
              </h2>
            </div>
            <div>
              <AssessmentItemSkeleton />
              <AssessmentItemSkeleton />
              <AssessmentItemSkeleton />
              <div className='p-4 text-center'>
                <Skeleton className='h-4 w-40 mx-auto' />
              </div>
            </div>
          </div>

          {/* Performance and quick actions skeleton */}
          <div>
            {/* Performance skeleton */}
            <div className='bg-accent rounded-lg shadow-md overflow-hidden mb-4'>
              <div className='p-6 border-b border-card'>
                <h2 className='font-semibold text-xl flex items-center'>
                  <BarChart className='mr-2 text-bluecolor' size={20} />
                  Performance das turmas
                </h2>
              </div>
              <div className='p-6 space-y-4'>
                <PerformanceItemSkeleton />
                <PerformanceItemSkeleton />
                <PerformanceItemSkeleton />
              </div>
            </div>

            {/* Quick actions skeleton */}
            <div className='bg-accent rounded-lg shadow-md overflow-hidden'>
              <div className='p-6 border-b border-card'>
                <h2 className='font-semibold text-xl flex items-center'>
                  <ClipboardCheck className='mr-2 text-bluecolor' size={20} />
                  Ações rápidas
                </h2>
              </div>
              <div className='p-4 space-y-2'>
                <QuickActionSkeleton />
                <QuickActionSkeleton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className='bg-accent rounded-lg p-6 shadow-md flex items-center'>
      <Skeleton className='h-12 w-12 rounded-full mr-4' />
      <div className='flex-1'>
        <Skeleton className='h-3 w-16 mb-2' />
        <Skeleton className='h-6 w-12' />
      </div>
    </div>
  )
}

function AssessmentItemSkeleton() {
  return (
    <div className='p-4 border-b border-input last:border-0'>
      <div className='flex justify-between items-center'>
        <div className='flex-1'>
          <Skeleton className='h-4 w-32 mb-2' />
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
      <div className='flex justify-between mb-1'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-8' />
      </div>
      <Skeleton className='h-2 w-full rounded-full' />
    </>
  )
}

function QuickActionSkeleton() {
  return (
    <div className='flex items-center py-2 h-9 px-4'>
      <Skeleton className='size-7 rounded-md mr-3' />
      <Skeleton className='h-4 w-32' />
    </div>
  )
}
