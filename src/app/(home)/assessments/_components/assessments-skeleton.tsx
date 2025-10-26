import { Title } from '@/components/title'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AssessmentsSkeleton() {
  return (
    <>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Title>Avaliações</Title>
        <Skeleton className='h-10 w-44' /> {/* Nova Avaliação button */}
      </div>

      {/* Search and Filters */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
        <div className='relative max-w-md flex-1'>
          <Skeleton className='h-10 w-full rounded-md' /> {/* Search input */}
        </div>
        {/* Status filter */}
        <Skeleton className='h-10 w-full rounded-md sm:w-48' />
      </div>

      {/* Results Counter */}
      <Skeleton className='mb-4 h-4 w-64' />

      {/* Assessment Cards */}
      <div className='mb-8 grid gap-6'>
        <AssessmentCardSkeleton />
        <AssessmentCardSkeleton />
        <AssessmentCardSkeleton />
      </div>
    </>
  )
}

function AssessmentCardSkeleton() {
  return (
    <Card className='group overflow-hidden transition-all'>
      {/* Header with gradient */}
      <div className='border-b bg-gradient-to-r from-purple-50 to-violet-50 p-6 dark:from-purple-900/20 dark:to-violet-900/20'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-1 items-start gap-3'>
            {/* Purple icon circle */}
            <Skeleton className='size-11 shrink-0 rounded-lg' />
            <div className='flex-1 space-y-3'>
              {/* Assessment name */}
              <Skeleton className='h-6 w-64' />

              {/* Date and classes info */}
              <div className='flex flex-wrap items-center gap-4'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
          </div>
          {/* Status badge */}
          <Skeleton className='h-7 w-28 shrink-0 rounded-full' />
        </div>
      </div>

      {/* Content with accent background */}
      <CardContent className='bg-accent p-5'>
        {/* Progress Section */}
        <div className='mb-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-4' />
              <Skeleton className='h-4 w-28' />
            </div>
            <Skeleton className='h-4 w-10' />
          </div>
          <Skeleton className='h-2.5 w-full rounded-full' />
          <Skeleton className='h-3 w-40' />
        </div>

        {/* Accordion Details */}
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='details' className='border-none'>
            <AccordionTrigger className='rounded-md py-3 hover:no-underline'>
              <div className='flex items-center gap-2'>
                <Skeleton className='size-4' />
                <Skeleton className='h-4 w-44' />
              </div>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
