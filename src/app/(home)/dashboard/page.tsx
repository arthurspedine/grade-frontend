import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import { formatUpcomingDate } from '@/helper/format-date'
import type {
  ClassPerformanceType,
  DashboardStatsType,
  PendingAssessmentType,
} from '@/types'
import {
  BarChart,
  BookOpen,
  Calendar,
  ClipboardCheck,
  type LucideProps,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import type { ForwardRefExoticComponent } from 'react'

const StatCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>
  title: string
  value: number
  color: string
}) => {
  const Icon = icon
  return (
    <div className='bg-accent rounded-lg p-6 shadow-md flex items-center'>
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon size={24} className='text-white' />
      </div>
      <div>
        <p className='text-gray-500 text-sm'>{title}</p>
        <p className='text-2xl font-semibold'>{value}</p>
      </div>
    </div>
  )
}

const UpcomingAssessment = ({
  title,
  date,
  classes,
}: { title: string; date: string; classes: number }) => {
  return (
    <div className='p-4 border-b border-input last:border-0'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-medium'>{title}</h3>
          <p className='text-gray-500 text-sm mt-1'>
            {classes}{' '}
            {classes === 1
              ? 'turma a ser avaliada'
              : 'turmas a serem avaliadas'}
          </p>
        </div>
        <div className='text-bluecolor text-sm'>{date}</div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, assessments, classes] = await Promise.all([
    authenticatedFetch<DashboardStatsType>('/dashboard/stats'),
    authenticatedFetch<PendingAssessmentType[]>('/assessments/pending'),
    authenticatedFetch<ClassPerformanceType[]>('/classes/performance'),
  ])

  return (
    <div className='flex flex-col flex-grow'>
      <section className='max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4'>
        <Title>Dashboard</Title>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 my-4'>
          <StatCard
            icon={Users}
            title='Alunos'
            value={stats.totalStudents}
            color='bg-bluecolor'
          />
          <StatCard
            icon={BookOpen}
            title='Turmas'
            value={stats.totalClasses}
            color='bg-green-500'
          />
          <StatCard
            icon={ClipboardCheck}
            title='Avaliações'
            value={stats.totalAssessments}
            color='bg-purple-500'
          />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Coluna 1: Próximas avaliações */}
          <div className='bg-accent rounded-lg shadow-md overflow-hidden'>
            <div className='p-6 border-b border-card'>
              <h2 className='font-semibold text-xl flex items-center'>
                <Calendar className='mr-2 text-bluecolor' size={20} />
                Avaliações não finalizadas
              </h2>
            </div>

            <div>
              {assessments.map(assessment => (
                <UpcomingAssessment
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
                  className='text-bluecolor text-sm font-medium relative group'
                >
                  Ver todas as avaliações
                  <span className='absolute h-0.5 bg-current left-0 -bottom-0.5 w-0 group-hover:w-full transition-all duration-300' />
                </Link>
              </div>
            </div>
          </div>

          {/* Coluna 2: Performance */}
          <div>
            <div className='bg-accent rounded-lg shadow-md overflow-hidden mb-4'>
              <div className='p-6 border-b border-card'>
                <h2 className='font-semibold text-xl flex items-center'>
                  <BarChart className='mr-2 text-bluecolor' size={20} />
                  Performance das turmas
                </h2>
              </div>
              <div className='p-6 space-y-4'>
                {classes.map(c => {
                  const rate = c.performanceRate
                  let barColor = 'bg-red-400'

                  if (rate >= 80)
                    barColor = 'bg-gradient-to-r from-green-400 to-green-600'
                  else if (rate >= 70)
                    barColor = 'bg-gradient-to-r from-blue-400 to-blue-600'
                  else if (rate >= 60)
                    barColor = 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  else barColor = 'bg-gradient-to-r from-red-400 to-red-600'

                  return (
                    <div key={c.id}>
                      <div className='flex justify-between mb-1'>
                        <span className='text-sm font-medium'>{c.name}</span>
                        <span className='text-sm font-semibold'>{rate}%</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`${barColor} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Ações rápidas */}
            <div className='bg-accent rounded-lg shadow-md overflow-hidden'>
              <div className='p-6 border-b border-card'>
                <h2 className='font-semibold text-xl'>Ações rápidas</h2>
              </div>
              <div className='p-4 space-y-2'>
                <Button
                  variant={'ghost'}
                  asChild
                  className='w-full hover:shadow-md hover:bg-card/15 flex justify-start py-6 transition-all duration-300'
                >
                  <Link href={'/assessments/add'}>
                    <div className='bg-blue-100 p-2 rounded-md mr-3'>
                      <ClipboardCheck size={20} className='text-bluecolor' />
                    </div>
                    <span>Criar nova avaliação</span>
                  </Link>
                </Button>
                <Button
                  variant={'ghost'}
                  asChild
                  className='w-full hover:shadow-md hover:bg-card/15 flex justify-start py-6 transition-all duration-300'
                >
                  <Link href={'/classes/add'}>
                    <div className='bg-green-100 p-2 rounded-md mr-3'>
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
