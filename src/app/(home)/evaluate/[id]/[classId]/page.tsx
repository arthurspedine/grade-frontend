'use client'

import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useEvaluateAssessmentInfo } from '@/hooks/useEvaluateAssessmentInfo'
import type { AssessmentStudentType } from '@/types'
import { AlertCircle, CheckCircle, GraduationCap } from 'lucide-react'
import { redirect } from 'next/navigation'
import { use } from 'react'
import { EvaluatePageSkeleton } from './_components/evaluate-page-skeleton'
import { StudentsFilterableList } from './_components/students-filterable-list'

export default function EvaluateInfoAssessmentPage({
  params,
}: { params: Promise<{ id: string; classId: string }> }) {
  const { id: assessmentId, classId } = use(params)

  const { assessmentInfo, loading, error } = useEvaluateAssessmentInfo({
    assessmentId,
    classId,
  })

  if (loading) {
    return <EvaluatePageSkeleton />
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center gap-4 py-12'>
          <AlertCircle className='h-12 w-12 text-destructive' />
          <h2 className='font-semibold text-lg'>Erro ao carregar</h2>
          <p className='text-center text-muted-foreground'>{error}</p>
          <Button onClick={() => window.location.reload()} variant='outline'>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!assessmentInfo) {
    return redirect('/assessments')
  }

  const totalStudents = assessmentInfo.students.length
  const evaluatedStudents = assessmentInfo.students.filter(
    (student: {
      info: AssessmentStudentType
      evaluationCompleted: boolean
    }) => student.evaluationCompleted
  ).length
  const pendingStudents = totalStudents - evaluatedStudents
  const progress =
    totalStudents > 0 ? (evaluatedStudents / totalStudents) * 100 : 0

  return (
    <div className='container mx-auto flex flex-col gap-6 px-4 pb-4'>
      {/* Header */}

      <div className='flex justify-between'>
        <Title>Avaliação: {assessmentInfo.name}</Title>

        <GoBackButton goBackUrl='/assessments' />
      </div>

      <div className='space-y-1'>
        <p className='text-muted-foreground'>Gerenciar avaliações dos alunos</p>
        {/* Progress Summary */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <SummaryCard>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Total de Alunos</h3>
              <GraduationCap className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <div className='font-bold text-2xl'>{totalStudents}</div>
              <p className='text-muted-foreground text-xs'>
                Alunos cadastrados na turma
              </p>
            </div>
          </SummaryCard>

          <SummaryCard>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Avaliados</h3>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </div>
            <div>
              <div className='font-bold text-2xl text-green-600'>
                {evaluatedStudents}
              </div>
              <p className='text-muted-foreground text-xs'>
                {evaluatedStudents > 0
                  ? `${Math.round((evaluatedStudents / totalStudents) * 100)}% concluído`
                  : 'Nenhum aluno avaliado'}
              </p>
            </div>
          </SummaryCard>

          <SummaryCard>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Pendentes</h3>
              <AlertCircle className='h-4 w-4 text-orange-600' />
            </div>
            <div>
              <div className='font-bold text-2xl text-orange-600'>
                {pendingStudents}
              </div>
              <p className='text-muted-foreground text-xs'>
                {pendingStudents > 0
                  ? `${Math.round((pendingStudents / totalStudents) * 100)}% restante`
                  : 'Todos os alunos avaliados'}
              </p>
            </div>
          </SummaryCard>

          <SummaryCard>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Progresso</h3>
              <div className='flex items-center gap-2'>
                <Badge
                  variant={progress === 100 ? 'default' : 'outline'}
                  className='text-xs'
                >
                  {Math.round(progress)}%
                </Badge>
              </div>
            </div>
            <div>
              <Progress value={progress} className='h-2' />
              <p className='mt-2 text-muted-foreground text-xs'>
                {progress === 100
                  ? 'Avaliação concluída!'
                  : `${Math.round(100 - progress)}% para completar`}
              </p>
            </div>
          </SummaryCard>
        </div>
      </div>

      {/* Students List with Filters */}
      <StudentsFilterableList
        assessmentInfo={assessmentInfo}
        assessmentId={assessmentId}
        classId={classId}
      />
    </div>
  )
}

function SummaryCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className='flex h-[120px] flex-col'>
      <CardContent className='flex flex-1 flex-col justify-between py-2'>
        {children}
      </CardContent>
    </Card>
  )
}
