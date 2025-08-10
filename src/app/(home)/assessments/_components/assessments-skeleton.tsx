import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Title } from '@/components/title'

export function AssessmentsSkeleton() {
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <Title>Avaliações</Title>
        <Skeleton className='h-10 w-40' /> {/* Nova Avaliação button */}
      </div>

      {/* Search and Filters */}
      <div className='mb-6 flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Skeleton className='h-9 w-full rounded-md' /> {/* Search input */}
        </div>
        {/* Status filter */}
        <Skeleton className='h-9 w-full sm:w-48 rounded-md' />{' '}
      </div>

      <Skeleton className='h-5 w-48 mb-4' />

      {/* Assessment Cards */}
      <div className='grid gap-6 mb-8'>
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
            <AccordionTrigger className='hover:no-underline py-2'>
              <Skeleton className='h-4 w-36' />
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
