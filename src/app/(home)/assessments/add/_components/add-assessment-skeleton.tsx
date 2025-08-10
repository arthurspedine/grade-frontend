import { Title } from '@/components/title'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AddAssessmentSkeleton() {
  return (
    <section className='mx-auto flex h-full w-full max-w-[1440px] flex-col px-8'>
      <Title>Adicionar Avaliação</Title>

      <div className='relative flex flex-col px-8 py-4'>
        {/* Save Button Skeleton */}
        <Skeleton className='absolute top-[-34px] right-0 h-10 w-36' />

        {/* Name Input Skeleton */}
        <div className='mt-2'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-6 w-12' />
            <Skeleton className='h-10 max-w-md flex-1' />
          </div>
        </div>

        {/* Date Input Skeleton */}
        <div className='mt-2'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-10 w-40' />
          </div>
        </div>

        {/* Class Selection Section */}
        <section className='mt-8'>
          <Skeleton className='mb-4 h-7 w-64' />

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Available Classes Skeleton */}
            <div className='space-y-3'>
              <Skeleton className='h-6 w-40' />
              <div className='max-h-80 overflow-y-auto rounded-lg border bg-muted/20 p-4'>
                <div className='space-y-3'>
                  <Card className='animate-pulse'>
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
                  <Card className='animate-pulse'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <Skeleton className='mb-1 h-4 w-32' />
                          <Skeleton className='h-3 w-20' />
                        </div>
                        <Skeleton className='size-4 rounded' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='animate-pulse'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <Skeleton className='mb-1 h-4 w-28' />
                          <Skeleton className='h-3 w-24' />
                        </div>
                        <Skeleton className='size-4 rounded' />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='animate-pulse'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <Skeleton className='mb-1 h-4 w-20' />
                          <Skeleton className='h-3 w-16' />
                        </div>
                        <Skeleton className='size-4 rounded' />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Selected Classes Skeleton */}
            <div className='space-y-3'>
              <Skeleton className='h-6 w-36' />
              <div className='min-h-[200px] rounded-lg border bg-primary/5 p-4'>
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
      <div className='mt-8 flex flex-col space-y-6 pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='mb-2 h-6 w-48' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        {/* Empty State for Questions */}
        <Card className='border-2 border-muted-foreground/25 border-dashed'>
          <CardContent className='p-8 text-center'>
            <Skeleton className='mx-auto mb-4 h-4 w-40' />
            <Skeleton className='mx-auto h-10 w-48' />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
