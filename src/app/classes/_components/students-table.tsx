import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { StudentType } from '@/types'

export function StudentsTable({
  students,
  className,
}: { students: StudentType[]; className?: string }) {
  return (
    <Table className={className}>
      <TableCaption>Lista de alunos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-10'>N°</TableHead>
          <TableHead className='w-20'>RM</TableHead>
          <TableHead>Nome</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((c, i) => (
          <TableRow key={c.rm}>
            <TableCell>{i + 1}</TableCell>
            <TableCell className='font-medium'>{c.rm}</TableCell>
            <TableCell>{c.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
