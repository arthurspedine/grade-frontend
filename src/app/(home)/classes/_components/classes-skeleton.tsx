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
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
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
      <TableCell className='w-full flex justify-end'>
        <div className='max-w-72 flex-grow flex space-x-2 mr-2'>
          <Skeleton className='h-9 w-24' /> {/* Ver turma button */}
          <Skeleton className='h-9 w-20' /> {/* Editar button */}
          <Skeleton className='h-9 w-24' /> {/* Disable button */}
        </div>
      </TableCell>
    </TableRow>
  )
}
