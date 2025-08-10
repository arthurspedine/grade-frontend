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

export function StudentTablesSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <Table>
      <TableCaption>Lista de alunos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-10'>N°</TableHead>
          <TableHead className='w-20'>RM</TableHead>
          <TableHead>Nome</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <StudentRowSkeleton key={`n-${index + 1}`} number={index + 1} />
        ))}
      </TableBody>
    </Table>
  )
}

function StudentRowSkeleton({ number }: { number: number }) {
  return (
    <TableRow>
      <TableCell>{number}</TableCell>
      <TableCell className='font-medium'>
        <Skeleton className='h-5 w-12' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-40' />
      </TableCell>
    </TableRow>
  )
}
