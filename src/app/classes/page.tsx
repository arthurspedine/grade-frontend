import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ClassType } from '@/types'
import Link from 'next/link'
import { DisableClassDialog } from './_components/disable-class-dialog'
import getCategoryOptions from './_http/handle-category-options'
import { handleClassesList } from './_http/handle-http-class'

export const dynamic = 'force-dynamic'

export default async function ClassesPage() {
  const classesList: ClassType[] = await handleClassesList()
  const categoryList: { key: string; label: string }[] =
    await getCategoryOptions()

  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      <div className='flex justify-between'>
        <Title>Turmas</Title>
        {classesList.length > 0 && (
          <Link href={'/classes/add'} className='hover:underline text'>
            Adicionar turma
          </Link>
        )}
      </div>

      <div>
        {classesList.length > 0 ? (
          // WHEN THE USER HAS AT LEAST ONE CLASS
          <Table>
            <TableCaption>Lista de turmas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Turma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className='text-right'>Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesList.map(c => (
                <TableRow key={c.id}>
                  <TableCell className='font-medium'>{c.name}</TableCell>
                  <TableCell>{c.active ? 'ATIVA' : 'INATIVA'}</TableCell>
                  <TableCell>
                    {
                      categoryList.find(category => category.key === c.category)
                        ?.label
                    }
                  </TableCell>
                  <TableCell className='w-full flex justify-end'>
                    <div className='max-w-72 flex-grow flex space-x-2'>
                      <Button variant={'outline'} asChild>
                        <Link href={`/classes/${c.id}`}>Ver turma</Link>
                      </Button>
                      <Button variant={'outline'} asChild>
                        <Link href={`/classes/edit/${c.id}`}>Editar</Link>
                      </Button>
                      <DisableClassDialog {...c} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // WHEN THE USER DOESN'T HAVE ANY CLASSES
          <p className='text-muted-foreground text-center pt-16'>
            Parece que você ainda não adicionou turmas na sua conta.{' '}
            <Link
              href={'/classes/add'}
              className='text-primary hover:underline'
            >
              Adicionar uma nova turma
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
