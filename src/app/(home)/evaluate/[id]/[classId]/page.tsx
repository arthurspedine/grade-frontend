'use client'

import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Card, CardContent } from '@/components/ui/card'
import { useEvaluateAssessmentInfo } from '@/hooks/useEvaluateAssessmentInfo'
import type { AssessmentStudentType } from '@/types'
import { AlertCircle, BarChart, CheckCircle, GraduationCap } from 'lucide-react'
import { redirect } from 'next/navigation'
import { use } from 'react'
import { EvaluatePageSkeleton } from './_components/evaluate-page-skeleton'
import { StudentsFilterableList } from './_components/students-filterable-list'
import { ErrorMessageContainer } from '@/components/error-message-container'

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
    return <ErrorMessageContainer message={error} />
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
    <>
      {/* Header */}

      <div className='flex justify-between'>
        <Title>Avaliação: {assessmentInfo.name}</Title>

        <GoBackButton goBackUrl='/assessments' />
      </div>

      <div className='space-y-1'>
        <p className='text-muted-foreground'>Gerenciar avaliações dos alunos</p>
        {/* Progress Summary */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <SummaryCard bgColor='bg-blue-500'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-white'>Total de Alunos</h3>
              <div className='rounded-full bg-white/20 p-2'>
                <GraduationCap className='size-4 text-white' />
              </div>
            </div>
            <div>
              <div className='font-bold text-2xl text-white'>
                {totalStudents}
              </div>
              <p className='text-blue-100 text-xs'>
                Alunos cadastrados na turma
              </p>
            </div>
          </SummaryCard>

          <SummaryCard bgColor='bg-green-500'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-white'>Avaliados</h3>
              <div className='rounded-full bg-white/20 p-2'>
                <CheckCircle className='size-4 text-white' />
              </div>
            </div>
            <div>
              <div className='font-bold text-2xl text-white'>
                {evaluatedStudents}
              </div>
              <p className='text-green-100 text-xs'>
                {evaluatedStudents > 0
                  ? `${Math.round((evaluatedStudents / totalStudents) * 100)}% concluído`
                  : 'Nenhum aluno avaliado'}
              </p>
            </div>
          </SummaryCard>

          <SummaryCard bgColor='bg-orange-500'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-white'>Pendentes</h3>
              <div className='rounded-full bg-white/20 p-2'>
                <AlertCircle className='size-4 text-white' />
              </div>
            </div>
            <div>
              <div className='font-bold text-2xl text-white'>
                {pendingStudents}
              </div>
              <p className='text-orange-100 text-xs'>
                {pendingStudents > 0
                  ? `${Math.round((pendingStudents / totalStudents) * 100)}% restante`
                  : 'Todos os alunos avaliados'}
              </p>
            </div>
          </SummaryCard>

          <SummaryCard bgColor='bg-purple-500'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-white'>Progresso</h3>
              <div className='rounded-full bg-white/20 p-2'>
                <BarChart className='size-4 text-white' />
              </div>
            </div>
            <div>
              <div className='font-bold text-2xl text-white'>
                {Math.round(progress)}%
              </div>
              <p className='mt-2 text-purple-100 text-xs'>
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
    </>
  )
}

function SummaryCard({
  children,
  bgColor = 'bg-card',
}: {
  children: React.ReactNode
  bgColor?: string
}) {
  return (
    <Card className={`${bgColor} border shadow-md`}>
      <CardContent className='p-4'>{children}</CardContent>
    </Card>
  )
}
