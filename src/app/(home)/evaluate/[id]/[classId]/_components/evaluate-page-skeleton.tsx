import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function EvaluatePageSkeleton() {
  return (
    <div className='container mx-auto flex flex-col gap-6 px-4 pb-4'>
      {/* Header Skeleton */}
      <div className='flex justify-between'>
        <div className='flex gap-1'>
          <Title>Avaliação:</Title>
          <Skeleton className='h-9 w-24' />
        </div>
        <GoBackButton goBackUrl='/assessments' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='h-5 w-64' />
        {/* Progress Summary Skeleton */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <SummaryCardSkeleton key={`summary-card-${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        <Skeleton className='h-10 w-full max-w-md' />
        <Skeleton className='h-10 w-full sm:w-48' />
      </div>

      <div className='space-y-2'>
        {/* Results Counter Skeleton */}
        <Skeleton className='h-4 w-48' />

        {/* Table Skeleton */}
        <Card>
          <CardContent className='p-0'>
            <div className='border-b'>
              <div className='flex h-12 items-center px-4'>
                <Skeleton className='h-4 w-8' />
                <Skeleton className='ml-4 h-4 w-16' />
                <Skeleton className='ml-4 h-4 w-32' />
                <Skeleton className='ml-auto h-4 w-16' />
                <Skeleton className='ml-4 h-4 w-20' />
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items
                key={i}
                className='flex h-16 items-center border-b px-4 last:border-b-0'
              >
                <Skeleton className='h-4 w-6' />
                <Skeleton className='ml-4 h-4 w-16' />
                <Skeleton className='ml-4 h-4 w-40' />
                <Skeleton className='ml-auto h-6 w-20' />
                <Skeleton className='ml-4 h-8 w-24' />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SummaryCardSkeleton() {
  return (
    <Card className='flex h-[120px] flex-col'>
      <CardContent className='flex flex-1 flex-col justify-between py-2'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-4 rounded-full' />
        </div>
        <div>
          <Skeleton className='mb-2 h-8 w-12' />
          <Skeleton className='h-3 w-full' />
        </div>
      </CardContent>
    </Card>
  )
}
