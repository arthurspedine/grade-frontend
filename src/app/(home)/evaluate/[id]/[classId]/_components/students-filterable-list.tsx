'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AssessmentInfoType } from '@/types'
import { AlertCircle, CheckCircle, Search, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

interface StudentsFilterableListProps {
  assessmentInfo: AssessmentInfoType
}

export function StudentsFilterableList({
  assessmentInfo,
}: StudentsFilterableListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Function to clear all filters
  function clearAllFilters() {
    setSearchTerm('')
    setStatusFilter('all')
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all'

  // Helper function for status labels
  function getStatusLabel(filterValue: string) {
    switch (filterValue) {
      case 'evaluated':
        return 'Avaliados'
      case 'not-evaluated':
        return 'Não avaliados'
      default:
        return 'Todos'
    }
  }

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    let filtered = assessmentInfo.students

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        student =>
          student.info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.info.rm.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => {
        switch (statusFilter) {
          case 'evaluated':
            return student.evaluationCompleted
          case 'not-evaluated':
            return !student.evaluationCompleted
          default:
            return true
        }
      })
    }

    return filtered
  }, [assessmentInfo.students, searchTerm, statusFilter])

  return (
    <>
      {/* Search and Filters */}
      <div className='my-4 flex flex-col gap-4 sm:flex-row'>
        <div className='relative max-w-md flex-1'>
          <Search className='-translate-y-1/2 absolute top-1/2 left-3 size-4 transform text-muted-foreground' />
          <Input
            placeholder='Buscar por nome ou RM...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos os alunos</SelectItem>
            <SelectItem value='evaluated'>Avaliados</SelectItem>
            <SelectItem value='not-evaluated'>Não avaliados</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant='outline'
            size='default'
            onClick={clearAllFilters}
            className='flex items-center gap-2 whitespace-nowrap'
          >
            <X className='h-4 w-4' />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className='space-y-2'>
        {/* Results Counter */}
        <div className='text-muted-foreground text-sm'>
          {filteredStudents.length === assessmentInfo.students.length ? (
            <span>
              Mostrando {filteredStudents.length} de{' '}
              {assessmentInfo.students.length} alunos
            </span>
          ) : (
            <span>
              Mostrando {filteredStudents.length} de{' '}
              {assessmentInfo.students.length} alunos
              {searchTerm && statusFilter !== 'all' && (
                <span className='ml-1'>
                  • Filtros: "{searchTerm}" + {getStatusLabel(statusFilter)}
                </span>
              )}
              {searchTerm && statusFilter === 'all' && (
                <span className='ml-1'>• Busca: "{searchTerm}"</span>
              )}
              {!searchTerm && statusFilter !== 'all' && (
                <span className='ml-1'>
                  • Filtro: {getStatusLabel(statusFilter)}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Students Table */}
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-10'>N°</TableHead>
                  <TableHead className='w-20'>RM</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className='text-right'>Status</TableHead>
                  <TableHead className='w-32 text-center'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='py-8 text-center'>
                      <div className='flex flex-col items-center gap-2'>
                        <Users className='size-8 text-muted-foreground' />
                        <p className='text-muted-foreground'>
                          Nenhum aluno encontrado
                          {searchTerm && ` para "${searchTerm}"`}
                          {statusFilter !== 'all' &&
                            ` com status "${getStatusLabel(statusFilter)}"`}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, i) => (
                    <TableRow key={student.info.id}>
                      <TableCell className='font-medium'>{i + 1}</TableCell>
                      <TableCell className='font-mono text-sm'>
                        {student.info.rm}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {student.info.name}
                      </TableCell>
                      <TableCell className='flex items-center justify-end gap-2'>
                        {student.evaluationCompleted ? (
                          <Badge
                            variant='default'
                            className='flex items-center gap-1'
                          >
                            <CheckCircle className='size-3' />
                            Avaliado
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='flex items-center gap-1'
                          >
                            <AlertCircle className='size-3' />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant={
                            student.evaluationCompleted ? 'outline' : 'default'
                          }
                          size='sm'
                          asChild
                        >
                          <Link href={`/evaluate/student/${student.info.id}`}>
                            {student.evaluationCompleted
                              ? 'Ver Detalhes'
                              : 'Avaliar Agora'}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
