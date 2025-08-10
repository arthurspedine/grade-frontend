import type {} from '@/types'
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  LogIn,
  type LucideProps,
  UserPlus,
} from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import type { ForwardRefExoticComponent } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>
  title: string
  description: string
}) => {
  const Icon = icon
  return (
    <div className='rounded-lg bg-accent p-6 shadow-md'>
      <div className='mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
        <Icon size={32} className='text-bluecolor' />
        <h3 className='font-semibold text-lg md:text-xl'>{title}</h3>
      </div>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  )
}

export default async function MainPage() {
  const session = await getServerSession(authOptions)
  const isAuthenticated = !!session
  return (
    <div className='flex flex-grow flex-col'>
      <section className='mx-auto w-full max-w-[1440px] px-4 pb-4 sm:px-6 lg:px-8'>
        {/* HERO SECTION */}
        <div className='rounded-xl bg-gradient-to-b from-bluecolor via-blue-700 to-blue-900 px-4 py-16 text-white shadow-blue-900 shadow-lg sm:px-6'>
          <div className='mx-auto flex max-w-4xl flex-col items-center text-center'>
            <h1 className='mb-4 font-bold text-3xl md:text-4xl'>
              Revolucione a forma de avaliar seus alunos
            </h1>
            <p className='mb-8 max-w-3xl text-lg opacity-90 md:text-xl'>
              Gerencie turmas, crie avaliações e obtenha insights com
              inteligência artificial para fornecer feedbacks personalizados aos
              seus alunos.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href={'/dashboard'}
                className='flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-bluecolor transition-all duration-300 hover:scale-105'
              >
                <LogIn className='mr-2' size={20} />
                Acessar plataforma
              </Link>
              {!isAuthenticated && (
                <Link
                  href={'/auth/signin'}
                  className='flex items-center justify-center rounded-lg bg-bluecolor px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105'
                >
                  <UserPlus className='mr-2' size={20} />
                  Criar conta
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* CONTENT */}
        <div className='py-16'>
          <h2 className='mb-4 text-center font-bold text-lg sm:mb-8 md:text-2xl lg:mb-12'>
            Como o{' '}
            <span className='mr-1 font-bold text-xl italic md:text-3xl'>
              Grade
            </span>{' '}
            pode te ajudar
          </h2>
          {/* CARDS */}
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <FeatureCard
              icon={BookOpen}
              title='Gerenciamento de Turmas'
              description='Organize facilmente suas turmas, adicione alunos e mantenha todos os dados acadêmicos em um só lugar.'
            />
            <FeatureCard
              icon={ClipboardCheck}
              title='Criação de Avaliações'
              description='Crie provas personalizadas e distribua para suas turmas selecionadas com apenas alguns cliques.'
            />
            <FeatureCard
              icon={Brain}
              title='Feedback com IA'
              description='Utilize inteligência artificial para gerar feedbacks personalizados e insights valiosos sobre o desempenho dos alunos.'
            />
          </div>
        </div>
      </section>
    </div>
  )
}
