'use client'

import { Title } from '@/components/title'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/helper/format-date'
import { useState, useMemo } from 'react'
import {
  Plus,
  Calendar,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import type { AssessmentDetailsType } from '@/types'
import { AssessmentsSkeleton } from './_components/assessments-skeleton'
import { useAssessments } from '@/hooks/useAssessments'

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
      <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
        <div className='flex flex-col items-center justify-center pt-16'>
          <p className='text-red-500 mb-4'>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <Title>Avaliações</Title>
        <Button asChild>
          <Link href={'/assessments/add'}>
            <Plus className='w-4 h-4 mr-2' />
            Nova Avaliação
          </Link>
        </Button>
      </div>

      {assessmentsList.length > 0 ? (
        <>
          {/* Search and Filters */}
          <div className='mb-6 flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
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
                <X className='w-4 h-4' />
                Limpar filtros
              </Button>
            )}
          </div>

          {/* Results Counter */}
          <div className='mb-4 text-sm text-muted-foreground'>
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
          <div className='grid gap-6 mb-8'>
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
                    className='overflow-hidden hover:shadow-lg transition-shadow'
                  >
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold mb-2'>
                            {assessment.name}
                          </h3>
                          <div className='flex items-center gap-4 text-sm text-muted-foreground mb-3'>
                            <div className='flex items-center gap-1'>
                              <Calendar className='w-4 h-4' />
                              {formatDate(assessment.assessmentDate)}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Users className='w-4 h-4' />
                              {assessment.classes.length} turma
                              {assessment.classes.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          {/* Progress Summary */}
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <span className='text-sm font-medium'>
                                Progresso Geral
                              </span>
                              <Badge
                                variant={status.variant}
                                className='flex items-center gap-1'
                              >
                                <StatusIcon className='w-3 h-3' />
                                {status.label}
                              </Badge>
                            </div>
                            <Progress
                              value={progress.percentage}
                              className='h-2'
                            />
                            <p className='text-xs text-muted-foreground'>
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
                          <AccordionTrigger className='hover:no-underline py-2'>
                            <span className='text-sm font-medium'>
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
                                    className='p-3 border rounded-lg bg-muted/20'
                                  >
                                    <div className='flex items-center justify-between mb-2'>
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
                                        <span className='text-xs text-muted-foreground'>
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
            <div className='max-w-md mx-auto'>
              <h3 className='text-lg font-semibold mb-2'>
                Nenhuma avaliação criada
              </h3>
              <p className='text-muted-foreground mb-6'>
                Comece criando sua primeira avaliação para organizar e
                acompanhar o progresso dos seus alunos.
              </p>
              <Button asChild>
                <Link href={'/assessments/add'}>
                  <Plus className='w-4 h-4 mr-2' />
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
