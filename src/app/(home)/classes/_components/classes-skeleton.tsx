import { Title } from '@/components/title'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ClassesSkeleton() {
  return (
    <section className='mx-auto w-full max-w-[1440px] flex-grow px-8'>
      <div className='flex justify-between'>
        <Title>Turmas</Title>
        <Skeleton className='h-5 w-32' /> {/* Add class link */}
      </div>

      <div className='mt-4'>
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
            <ClassRowSkeleton />
            <ClassRowSkeleton />
            <ClassRowSkeleton />
            <ClassRowSkeleton />
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

function ClassRowSkeleton() {
  return (
    <TableRow>
      <TableCell className='font-medium'>
        <Skeleton className='h-4 w-20' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-16' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-24' />
      </TableCell>
      <TableCell className='flex w-full justify-end'>
        <div className='mr-2 flex max-w-72 flex-grow space-x-2'>
          <Skeleton className='h-9 w-24' /> {/* Ver turma button */}
          <Skeleton className='h-9 w-20' /> {/* Editar button */}
          <Skeleton className='h-9 w-24' /> {/* Disable button */}
        </div>
      </TableCell>
    </TableRow>
  )
}
