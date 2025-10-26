import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
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
import { LayoutGrid, LayoutList } from 'lucide-react'

export function ClassesSkeleton() {
  return (
    <>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Title>Turmas</Title>
        <Skeleton className='h-10 w-32' /> {/* Nova Turma button */}
      </div>

      {/* Search, Filters and View Toggle */}
      <div className='mb-6 flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row'>
          {/* Search */}
          <div className='relative max-w-md flex-1'>
            <Skeleton className='h-10 w-full rounded-md' />
          </div>

          {/* Category filter */}
          <Skeleton className='h-10 w-full rounded-md sm:w-48' />

          {/* View toggle buttons */}
          <div className='flex gap-2'>
            <Button variant='outline' size='icon' disabled>
              <LayoutList className='size-4' />
            </Button>
            <Button variant='outline' size='icon' disabled>
              <LayoutGrid className='size-4' />
            </Button>
          </div>
        </div>

        {/* Results Counter */}
        <Skeleton className='h-4 w-48' />
      </div>

      {/* Table View */}
      <div className='overflow-hidden rounded-lg bg-accent p-2 shadow-md'>
        <Table>
          <TableCaption>Lista de turmas</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px]'>Turma</TableHead>
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
    </>
  )
}

function ClassRowSkeleton() {
  return (
    <TableRow>
      <TableCell className='font-medium'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-8 rounded-full' /> {/* Green icon */}
          <Skeleton className='h-4 w-32' />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className='h-6 w-20 rounded-full' /> {/* Badge */}
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-32' />
      </TableCell>
      <TableCell>
        <div className='flex justify-end gap-2'>
          <Skeleton className='h-8 w-20' /> {/* Ver turma button */}
          <Skeleton className='h-8 w-16' /> {/* Editar button */}
          <Skeleton className='size-8 rounded-md' /> {/* Icon button */}
        </div>
      </TableCell>
    </TableRow>
  )
}
