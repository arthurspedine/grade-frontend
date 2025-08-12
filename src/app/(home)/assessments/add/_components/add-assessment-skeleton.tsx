import { Title } from '@/components/title'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AddAssessmentSkeleton() {
  return (
    <>
      <Title>Adicionar Avaliação</Title>

      {/* Form Section */}
      <div className='relative flex flex-col gap-4 px-2 py-4 lg:gap-2 lg:px-6'>
        {/* Save Button Skeleton */}
        <Skeleton className='top-[-34px] right-0 h-10 w-36 sm:absolute' />

        {/* Name Input Skeleton */}
        <div>
          <div className='flex items-center space-x-2'>
            <span className='font-medium text-base'>Nome:</span>
            <Skeleton className='h-10 max-w-md flex-1' />
          </div>
        </div>

        {/* Date Input Skeleton */}
        <div>
          <div className='flex items-center space-x-2'>
            <span className='font-medium text-base'>Data da avaliação:</span>
            <Skeleton className='h-10 w-fit' />
          </div>
        </div>

        {/* Class Selection Section */}
        <section className='space-y-2 sm:mt-4'>
          <Skeleton className='h-7 w-80' /> {/* Section title */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Available Classes Skeleton */}
            <div className='space-y-3'>
              <Skeleton className='h-6 w-40' /> {/* "Turmas Disponíveis" */}
              <div className='max-h-80 overflow-y-auto rounded-lg border bg-muted/20 p-4'>
                <div className='space-y-3'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={`index-${i + 1}`} className='animate-pulse'>
                      <CardContent className='p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <Skeleton className='mb-1 h-4 w-24' />
                            <Skeleton className='h-3 w-16' />
                          </div>
                          <Skeleton className='size-4 rounded' />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Classes Skeleton */}
            <div className='space-y-3'>
              <Skeleton className='h-6 w-48' />{' '}
              {/* "Turmas Selecionadas (0)" */}
              <div className='max-h-80 min-h-[200px] overflow-y-auto rounded-lg border bg-primary/5 p-4'>
                <div className='flex h-full min-h-[150px] items-center justify-center text-center'>
                  <div>
                    <Skeleton className='mx-auto mb-2 h-5 w-32' />
                    <Skeleton className='mx-auto h-4 w-48' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Questions Section Skeleton */}
      <div className='flex flex-col gap-4 pb-8 sm:mt-4 sm:gap-6'>
        <div className='flex flex-col justify-between sm:flex-rowitems-center'>
          <div>
            <Skeleton className='mb-2 h-6 w-48' />{' '}
            {/* "Questões da Avaliação" */}
            <Skeleton className='h-4 w-32' /> {/* Score text */}
          </div>
        </div>

        {/* Questions List Skeleton */}
        <div className='space-y-4'>
          {/* Empty State for Questions */}
          <Card className='border-2 border-muted-foreground/25 border-dashed'>
            <CardContent className='p-8 text-center'>
              <Skeleton className='mx-auto mb-4 h-4 w-40' />
              <Skeleton className='mx-auto h-10 w-48' />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
