import { Title } from '@/components/title'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import { handleAssessmentsList } from './_http/handle-http-assessments'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AssessmentsPage() {
  const assessmentsList = await handleAssessmentsList()
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      <div className='flex justify-between items-center'>
        <Title>Avaliações</Title>
        {assessmentsList.length > 0 && (
          <Link href={'/assessments/add'} className='hover:underline text'>
            Adicionar avaliação
          </Link>
        )}
      </div>
      {assessmentsList.length > 0 ? (
        <Accordion type='single' collapsible className='w-5/6 mx-auto py-4'>
          {assessmentsList.map((assessment, i) => (
            <AccordionItem key={assessment.id} value={`item-${i + 1}`}>
              <AccordionTrigger>{assessment.name}</AccordionTrigger>
              <AccordionContent>
                <ul className='space-y-2'>
                  {assessment.classes.map(c => (
                    <li
                      key={c.id}
                      className='flex justify-between items-center'
                    >
                      <p>{c.name}</p>
                      <Button variant={'green'} size={'sm'} asChild>
                        <Link href={`/evaluate/${assessment.id}/${c.id}`}>
                          Avaliar
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className='text-muted-foreground text-center pt-16 flex flex-col'>
          Parece que você ainda não adicionou avaliações na sua conta.{' '}
          <Link
            href={'/assessments/add'}
            className='text-primary hover:underline'
          >
            Adicionar uma nova avaliação
          </Link>
        </p>
      )}
    </section>
  )
}
