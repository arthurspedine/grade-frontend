'use client'

import { Title } from '@/components/title'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/helper/format-date'
import { useAssessments } from '@/hooks/useAssessments'
import type { AssessmentDetailsType } from '@/types'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AssessmentsSkeleton } from './_components/assessments-skeleton'

export default function AssessmentsPage() {
  const { data: assessmentsList, loading, error } = useAssessments()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Function to clear all filters
  function clearAllFilters() {
    setSearchTerm('')
    setStatusFilter('all')
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all'

  // Calculate overall progress for an assessment
  function getAssessmentProgress(assessment: AssessmentDetailsType) {
    const totalStudents = assessment.classes.reduce(
      (sum: number, c) => sum + c.countStudents,
      0
    )
    const evaluatedStudents = assessment.classes.reduce(
      (sum: number, c) => sum + c.countEvaluatedStudents,
      0
    )
    return {
      totalStudents,
      evaluatedStudents,
      percentage:
        totalStudents > 0 ? (evaluatedStudents / totalStudents) * 100 : 0,
    }
  }

  // Get status info
  function getStatusInfo(percentage: number) {
    if (percentage === 100)
      return {
        label: 'Concluída',
        variant: 'default' as const,
        icon: CheckCircle,
      }
    if (percentage > 0)
      return {
        label: 'Em andamento',
        variant: 'secondary' as const,
        icon: AlertCircle,
      }
    return {
      label: 'Não iniciada',
      variant: 'outline' as const,
      icon: AlertCircle,
    }
  }

  // Get filter label for display
  function getFilterLabel(filterValue: string) {
    switch (filterValue) {
      case 'completed':
        return 'Concluídas'
      case 'in-progress':
        return 'Em andamento'
      case 'not-started':
        return 'Não iniciadas'
      default:
        return 'Todas'
    }
  }

  // Filter assessments based on search and status
  const filteredAssessments = useMemo(() => {
    let filtered = assessmentsList

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assessment =>
        assessment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assessment => {
        const totalStudents = assessment.classes.reduce(
          (sum: number, c) => sum + c.countStudents,
          0
        )
        const evaluatedStudents = assessment.classes.reduce(
          (sum: number, c) => sum + c.countEvaluatedStudents,
          0
        )
        const percentage =
          totalStudents > 0 ? (evaluatedStudents / totalStudents) * 100 : 0

        switch (statusFilter) {
          case 'completed':
            return percentage === 100
          case 'in-progress':
            return percentage > 0 && percentage < 100
          case 'not-started':
            return percentage === 0
          default:
            return true
        }
      })
    }

    return filtered
  }, [assessmentsList, searchTerm, statusFilter])

  if (loading) {
    return <AssessmentsSkeleton />
  }

  if (error) {
    return (
      <section className='mx-auto w-full max-w-[1440px] flex-grow px-8'>
        <div className='flex flex-col items-center justify-center pt-16'>
          <p className='mb-4 text-red-500'>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className='mx-auto w-full max-w-[1440px] flex-grow px-8'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Title>Avaliações</Title>
        <Button asChild>
          <Link href={'/assessments/add'}>
            <Plus className='mr-2 h-4 w-4' />
            Nova Avaliação
          </Link>
        </Button>
      </div>

      {assessmentsList.length > 0 ? (
        <>
          {/* Search and Filters */}
          <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
            <div className='relative max-w-md flex-1'>
              <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
              <Input
                placeholder='Buscar avaliação...'
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
                <SelectItem value='all'>Todas</SelectItem>
                <SelectItem value='completed'>Concluídas</SelectItem>
                <SelectItem value='in-progress'>Em andamento</SelectItem>
                <SelectItem value='not-started'>Não iniciadas</SelectItem>
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

          {/* Results Counter */}
          <div className='mb-4 text-muted-foreground text-sm'>
            {filteredAssessments.length === assessmentsList.length ? (
              <span>
                Mostrando {filteredAssessments.length} de{' '}
                {assessmentsList.length} avaliações
              </span>
            ) : (
              <span>
                Mostrando {filteredAssessments.length} de{' '}
                {assessmentsList.length} avaliações
                {searchTerm && statusFilter !== 'all' && (
                  <span className='ml-1'>
                    • Filtros: "{searchTerm}" + {getFilterLabel(statusFilter)}
                  </span>
                )}
                {searchTerm && statusFilter === 'all' && (
                  <span className='ml-1'>• Busca: "{searchTerm}"</span>
                )}
                {!searchTerm && statusFilter !== 'all' && (
                  <span className='ml-1'>
                    • Filtro: {getFilterLabel(statusFilter)}
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Assessments Grid */}
          <div className='mb-8 grid gap-6'>
            {filteredAssessments.length === 0 ? (
              <Card>
                <CardContent className='p-8 text-center'>
                  <p className='text-muted-foreground'>
                    Nenhuma avaliação encontrada para "{searchTerm}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAssessments.map(assessment => {
                const progress = getAssessmentProgress(assessment)
                const status = getStatusInfo(progress.percentage)
                const StatusIcon = status.icon

                return (
                  <Card
                    key={assessment.id}
                    className='overflow-hidden transition-shadow hover:shadow-lg'
                  >
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='mb-2 font-semibold text-lg'>
                            {assessment.name}
                          </h3>
                          <div className='mb-3 flex items-center gap-4 text-muted-foreground text-sm'>
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-4 w-4' />
                              {formatDate(assessment.assessmentDate)}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Users className='h-4 w-4' />
                              {assessment.classes.length} turma
                              {assessment.classes.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          {/* Progress Summary */}
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <span className='font-medium text-sm'>
                                Progresso Geral
                              </span>
                              <Badge
                                variant={status.variant}
                                className='flex items-center gap-1'
                              >
                                <StatusIcon className='h-3 w-3' />
                                {status.label}
                              </Badge>
                            </div>
                            <Progress
                              value={progress.percentage}
                              className='h-2'
                            />
                            <p className='text-muted-foreground text-xs'>
                              {progress.evaluatedStudents} de{' '}
                              {progress.totalStudents} alunos avaliados (
                              {Math.round(progress.percentage)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className='pt-0'>
                      {/* Classes Details */}
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='details' className='border-none'>
                          <AccordionTrigger className='py-2 hover:no-underline'>
                            <span className='font-medium text-sm'>
                              Ver detalhes das turmas
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className='pt-2'>
                            <div className='space-y-3'>
                              {assessment.classes.map(classItem => {
                                const classProgress =
                                  classItem.countStudents > 0
                                    ? (classItem.countEvaluatedStudents /
                                        classItem.countStudents) *
                                      100
                                    : 0
                                const isCompleted = classProgress === 100

                                return (
                                  <div
                                    key={classItem.id}
                                    className='rounded-lg border bg-muted/20 p-3'
                                  >
                                    <div className='mb-2 flex items-center justify-between'>
                                      <h4 className='font-medium'>
                                        {classItem.name}
                                      </h4>
                                      <Badge
                                        variant={
                                          isCompleted ? 'default' : 'secondary'
                                        }
                                      >
                                        {isCompleted ? 'Concluída' : 'Pendente'}
                                      </Badge>
                                    </div>

                                    <div className='space-y-2'>
                                      <Progress
                                        value={classProgress}
                                        className='h-1.5'
                                      />
                                      <div className='flex items-center justify-between'>
                                        <span className='text-muted-foreground text-xs'>
                                          {classItem.countEvaluatedStudents} /{' '}
                                          {classItem.countStudents} alunos
                                        </span>
                                        <Button
                                          variant={
                                            isCompleted ? 'outline' : 'default'
                                          }
                                          size='sm'
                                          asChild
                                        >
                                          <Link
                                            href={`/evaluate/${assessment.id}/${classItem.id}`}
                                          >
                                            {isCompleted
                                              ? 'Ver Detalhes'
                                              : 'Avaliar Agora'}
                                          </Link>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </>
      ) : (
        <Card className='mt-8'>
          <CardContent className='p-12 text-center'>
            <div className='mx-auto max-w-md'>
              <h3 className='mb-2 font-semibold text-lg'>
                Nenhuma avaliação criada
              </h3>
              <p className='mb-6 text-muted-foreground'>
                Comece criando sua primeira avaliação para organizar e
                acompanhar o progresso dos seus alunos.
              </p>
              <Button asChild>
                <Link href={'/assessments/add'}>
                  <Plus className='mr-2 h-4 w-4' />
                  Criar primeira avaliação
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
