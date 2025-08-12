import type { LucideProps } from 'lucide-react'
import Link from 'next/link'
import type { ForwardRefExoticComponent } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export function NoItemsCard({
  title,
  description,
  buttonText,
  buttonLink,
  Icon,
}: {
  title: string
  description: string
  buttonText: string
  buttonLink: string
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>
}) {
  return (
    <Card className='mt-8'>
      <CardContent className='px-4 py-6 text-center lg:p-12'>
        <div className='mx-auto w-full lg:max-w-md'>
          <h3 className='mb-2 font-semibold text-lg'>{title}</h3>
          <p className='mb-6 text-muted-foreground'>{description}</p>
          <Button asChild>
            <Link href={buttonLink}>
              {<Icon className='mr-2 h-4 w-4' />}
              {buttonText}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
