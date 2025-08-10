'use client'

import { PerformanceBar } from '@/components/performance-bar'
import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { formatUpcomingDate } from '@/helper/format-date'
import { useDashboard } from '@/hooks/useDashboard'
import {
  BarChart,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardSkeleton } from './_components/dashboard-skeleton'
import { StatsCard } from './_components/stats-card'
import { UpcomingAssessmentItem } from './_components/upcoming-assessment-item'

export default function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className='flex flex-grow flex-col items-center justify-center'>
        <p className='mb-4 text-red-500'>{error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  const { stats, assessments, classes } = data

  if (!stats) {
    return <DashboardSkeleton />
  }

  return (
    <div className='flex flex-grow flex-col'>
      <section className='mx-auto w-full max-w-[1440px] px-4 pb-4 sm:px-6 lg:px-8'>
        <Title>Dashboard</Title>
        <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3'>
          <StatsCard
            icon={Users}
            title='Alunos'
            value={stats.totalStudents}
            color='bg-bluecolor'
          />
          <StatsCard
            icon={BookOpen}
            title='Turmas'
            value={stats.totalClasses}
            color='bg-green-500'
          />
          <StatsCard
            icon={ClipboardCheck}
            title='Avaliações'
            value={stats.totalAssessments}
            color='bg-purple-500'
          />
        </div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {/* Coluna 1: Próximas avaliações */}
          <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
            <div className='border-card border-b p-6'>
              <h2 className='flex items-center font-semibold text-xl'>
                <Calendar className='mr-2 text-bluecolor' size={20} />
                Avaliações não finalizadas
              </h2>
            </div>

            <div>
              {assessments.map(assessment => (
                <UpcomingAssessmentItem
                  key={assessment.id}
                  title={assessment.name}
                  date={formatUpcomingDate(assessment.assessmentDate)}
                  classes={assessment.classesCount}
                />
              ))}
              <div className='p-4 text-center'>
                <Link
                  href={'/assessments'}
                  type='button'
                  className='group relative font-medium text-bluecolor text-sm'
                >
                  Ver todas as avaliações
                  <span className='-bottom-0.5 absolute left-0 h-0.5 w-0 bg-current transition-all duration-300 group-hover:w-full' />
                </Link>
              </div>
            </div>
          </div>

          {/* Coluna 2: Performance */}
          <div>
            <div className='mb-4 overflow-hidden rounded-lg bg-accent shadow-md'>
              <div className='border-card border-b p-6'>
                <h2 className='flex items-center font-semibold text-xl'>
                  <BarChart className='mr-2 text-bluecolor' size={20} />
                  Performance das turmas
                </h2>
              </div>
              <div className='space-y-4 p-6'>
                {classes.map(c => (
                  <PerformanceBar
                    key={c.id}
                    name={c.name}
                    score={c.performanceRate}
                  />
                ))}
              </div>
            </div>

            {/* Ações rápidas */}
            <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
              <div className='border-card border-b p-6'>
                <h2 className='flex items-center font-semibold text-xl'>
                  <ClipboardCheck className='mr-2 text-bluecolor' size={20} />
                  Ações rápidas
                </h2>
              </div>
              <div className='space-y-2 p-4'>
                <Button
                  variant={'ghost'}
                  asChild
                  className='flex w-full justify-start py-6 transition-all duration-300 hover:bg-card/15 hover:shadow-md dark:shadow-white/10'
                >
                  <Link href={'/assessments/add'}>
                    <div className='mr-3 rounded-md bg-blue-100 p-2'>
                      <ClipboardCheck size={20} className='text-bluecolor' />
                    </div>
                    <span>Criar nova avaliação</span>
                  </Link>
                </Button>
                <Button
                  variant={'ghost'}
                  asChild
                  className='flex w-full justify-start py-6 transition-all duration-300 hover:bg-card/15 hover:shadow-md dark:shadow-white/10'
                >
                  <Link href={'/classes/add'}>
                    <div className='mr-3 rounded-md bg-green-100 p-2'>
                      <Users size={20} className='text-green-600' />
                    </div>
                    <span>Adicionar turma</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
