'use client'

import { ErrorMessageContainer } from '@/components/error-message-container'
import { NoItemsCard } from '@/components/no-items-card'
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
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Plus,
  Search,
  TrendingUp,
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
    return <ErrorMessageContainer message={error} />
  }

  return (
    <>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Title>Avaliações</Title>
        <Button asChild>
          <Link href={'/assessments/add'}>
            <Plus className='mr-2 size-4' />
            Nova Avaliação
          </Link>
        </Button>
      </div>

      {assessmentsList.length > 0 ? (
        <>
          {/* Search and Filters */}
          <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
            <div className='relative max-w-md flex-1'>
              <Search className='-translate-y-1/2 absolute top-1/2 left-3 size-4 transform text-muted-foreground' />
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
                <X className='size-4' />
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
                    className='group overflow-hidden transition-all hover:shadow-lg dark:shadow-white/10'
                  >
                    <CardHeader className='rounded-t-md border-b bg-gradient-to-r from-purple-50 to-violet-50 pb-4 dark:from-purple-900/20 dark:to-violet-900/20'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex flex-1 items-start gap-3'>
                          <div className='rounded-lg bg-purple-500 p-2.5 transition-colors group-hover:bg-purple-600'>
                            <ClipboardCheck className='size-5 text-white' />
                          </div>
                          <div className='flex-1 space-y-1'>
                            <h3 className='font-semibold text-lg leading-tight'>
                              {assessment.name}
                            </h3>
                            <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm'>
                              <div className='flex items-center gap-1.5'>
                                <Calendar className='size-4' />
                                <span>
                                  {formatDate(assessment.assessmentDate)}
                                </span>
                              </div>
                              <div className='flex items-center gap-1.5'>
                                <Users className='size-4' />
                                <span>
                                  {assessment.classes.length} turma
                                  {assessment.classes.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={status.variant}
                          className='flex shrink-0 items-center gap-1.5 px-3 py-1'
                        >
                          <StatusIcon className='size-3.5' />
                          <span className='font-medium'>{status.label}</span>
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className='rounded-b-md bg-accent p-5'>
                      {/* Progress Summary */}
                      <div className='mb-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <TrendingUp className='size-4 text-purple-600 dark:text-purple-400' />
                            <span className='font-medium text-sm'>
                              Progresso Geral
                            </span>
                          </div>
                          <span className='font-semibold text-sm'>
                            {Math.round(progress.percentage)}%
                          </span>
                        </div>
                        <Progress
                          value={progress.percentage}
                          className='h-2.5'
                        />
                        <p className='text-muted-foreground text-xs'>
                          <span className='font-medium text-foreground'>
                            {progress.evaluatedStudents}
                          </span>{' '}
                          de{' '}
                          <span className='font-medium text-foreground'>
                            {progress.totalStudents}
                          </span>{' '}
                          alunos avaliados
                        </p>
                      </div>
                      {/* Classes Details */}
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='details' className='border-none'>
                          <AccordionTrigger className='rounded-md py-3 hover:bg-muted/50 hover:no-underline'>
                            <div className='flex items-center gap-2'>
                              <BookOpen className='size-4 text-primary' />
                              <span className='font-medium text-sm'>
                                Ver detalhes das turmas
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className='pt-3'>
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
                                    className='group/class rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50'
                                  >
                                    <div className='mb-3 flex items-center justify-between'>
                                      <h4 className='font-semibold text-base'>
                                        {classItem.name}
                                      </h4>
                                      <Badge
                                        variant={
                                          isCompleted ? 'default' : 'secondary'
                                        }
                                        className='flex items-center gap-1'
                                      >
                                        {isCompleted ? (
                                          <>
                                            <CheckCircle className='size-3' />
                                            Concluída
                                          </>
                                        ) : (
                                          <>
                                            <AlertCircle className='size-3' />
                                            Pendente
                                          </>
                                        )}
                                      </Badge>
                                    </div>

                                    <div className='space-y-2.5'>
                                      <Progress
                                        value={classProgress}
                                        className='h-2'
                                      />
                                      <div className='flex items-center justify-between gap-4'>
                                        <span className='text-muted-foreground text-sm'>
                                          <span className='font-medium text-foreground'>
                                            {classItem.countEvaluatedStudents}
                                          </span>{' '}
                                          de{' '}
                                          <span className='font-medium text-foreground'>
                                            {classItem.countStudents}
                                          </span>{' '}
                                          alunos ({Math.round(classProgress)}%)
                                        </span>
                                        <Button
                                          variant={
                                            isCompleted ? 'outline' : 'default'
                                          }
                                          size='sm'
                                          asChild
                                          className='shrink-0'
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
        <NoItemsCard
          title='Nenhuma avaliação encontrada'
          description='Comece criando uma avaliação para iniciar o acompanhamento.'
          buttonText='Criar nova avaliação'
          buttonLink='/assessments/add'
          Icon={Plus}
        />
      )}
    </>
  )
}
