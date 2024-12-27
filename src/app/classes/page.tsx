import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddClassDialog } from './_components/add-class-dialog'
import type { ClassType } from '@/types'
import { DisableClassDialog } from './_components/disable-class-dialog'
import { EditClassDialog } from './_components/edit-class-dialog'
import { handleClassesList } from './_http/handle-http-class'

export default async function ClassesPage() {
  const classesList: ClassType[] = await handleClassesList()

  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      <div className='flex justify-between'>
        <h1 className='font-bold text-2xl'>Turmas</h1>
        {classesList.length > 0 && <AddClassDialog text='Adicionar turma' />}
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
                <TableHead className='text-right'>Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesList.map(c => (
                <TableRow key={c.id}>
                  <TableCell className='font-medium'>{c.name}</TableCell>
                  <TableCell>{c.active ? 'ATIVA' : 'INATIVA'}</TableCell>
                  <TableCell className='w-full flex justify-end'>
                    <div className='max-w-52 flex-grow flex space-x-2'>
                      <EditClassDialog {...c} />
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
            <AddClassDialog />
          </p>
        )}
      </div>
    </section>
  )
}
