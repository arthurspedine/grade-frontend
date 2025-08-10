import { Title } from '@/components/title'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AssessmentsSkeleton() {
  return (
    <section className='mx-auto w-full max-w-[1440px] flex-grow px-8'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Title>Avaliações</Title>
        <Skeleton className='h-10 w-40' /> {/* Nova Avaliação button */}
      </div>

      {/* Search and Filters */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
        <div className='relative max-w-md flex-1'>
          <Skeleton className='h-9 w-full rounded-md' /> {/* Search input */}
        </div>
        {/* Status filter */}
        <Skeleton className='h-9 w-full rounded-md sm:w-48' />{' '}
      </div>

      <Skeleton className='mb-4 h-5 w-48' />

      {/* Assessment Cards */}
      <div className='mb-8 grid gap-6'>
        <AssessmentCardSkeleton />
        <AssessmentCardSkeleton />
      </div>
    </section>
  )
}

function AssessmentCardSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 space-y-3'>
            {/* Assessment name */}
            <Skeleton className='h-6 w-64' />

            {/* Date and classes info */}
            <div className='flex items-center gap-4'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
            </div>

            {/* Progress Section */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-6 w-20 rounded-full' />{' '}
                {/* Status badge */}
              </div>
              <Skeleton className='h-2 w-full rounded-full' />{' '}
              {/* Progress bar */}
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {/* Accordion Details */}
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='details' className='border-none'>
            <AccordionTrigger className='py-2 hover:no-underline'>
              <Skeleton className='h-4 w-36' />
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
