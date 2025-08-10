import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Title } from '@/components/title'

export function AddAssessmentSkeleton() {
  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
      <Title>Adicionar Avaliação</Title>

      <div className='flex flex-col px-8 py-4 relative'>
        {/* Save Button Skeleton */}
        <Skeleton className='absolute right-0 top-[-34px] h-10 w-36' />

        {/* Name Input Skeleton */}
        <div className='mt-2'>
          <div className='flex space-x-2 items-center'>
            <Skeleton className='h-6 w-12' />
            <Skeleton className='h-10 flex-1 max-w-md' />
          </div>
        </div>

        {/* Date Input Skeleton */}
        <div className='mt-2'>
          <div className='flex space-x-2 items-center'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-10 w-40' />
          </div>
        </div>

        {/* Class Selection Section */}
        <section className='mt-8'>
          <Skeleton className='h-7 w-64 mb-4' />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Available Classes Skeleton */}
            <div className='space-y-3'>
              <Skeleton className='h-6 w-40' />
              <div className='border rounded-lg p-4 bg-muted/20 max-h-80 overflow-y-auto'>
                <div className='space-y-3'>
                  <Card className='animate-pulse'>
                    <CardContent className='p-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <Skeleton className='h-4 w-24 mb-1' />
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
                          <Skeleton className='h-4 w-32 mb-1' />
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
                          <Skeleton className='h-4 w-28 mb-1' />
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
                          <Skeleton className='h-4 w-20 mb-1' />
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
              <div className='border rounded-lg p-4 bg-primary/5 min-h-[200px]'>
                <div className='flex items-center justify-center h-full min-h-[150px] text-center'>
                  <div>
                    <Skeleton className='h-5 w-32 mb-2 mx-auto' />
                    <Skeleton className='h-4 w-48 mx-auto' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Questions Section Skeleton */}
      <div className='flex flex-col space-y-6 pb-4 mt-8'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-6 w-48 mb-2' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        {/* Empty State for Questions */}
        <Card className='border-dashed border-2 border-muted-foreground/25'>
          <CardContent className='p-8 text-center'>
            <Skeleton className='h-4 w-40 mb-4 mx-auto' />
            <Skeleton className='h-10 w-48 mx-auto' />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
