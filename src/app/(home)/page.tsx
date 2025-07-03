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
    <div className='bg-accent rounded-lg p-6 shadow-md'>
      <div className='flex items-start sm:items-center gap-2 mb-2 flex-col sm:flex-row'>
        <Icon size={32} className='text-bluecolor' />
        <h3 className='text-lg md:text-xl font-semibold'>{title}</h3>
      </div>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  )
}

export default async function MainPage() {
  const session = await getServerSession(authOptions)
  const isAuthenticated = !!session
  return (
    <div className='flex flex-col flex-grow'>
      <section className='max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4'>
        {/* HERO SECTION */}
        <div className='bg-gradient-to-b from-bluecolor via-blue-700 to-blue-900 py-16 px-4 sm:px-6 rounded-xl text-white shadow-lg shadow-blue-900'>
          <div className='max-w-4xl mx-auto text-center flex flex-col items-center'>
            <h1 className='text-3xl md:text-4xl font-bold mb-4'>
              Revolucione a forma de avaliar seus alunos
            </h1>
            <p className='max-w-3xl text-lg md:text-xl mb-8 opacity-90'>
              Gerencie turmas, crie avaliações e obtenha insights com
              inteligência artificial para fornecer feedbacks personalizados aos
              seus alunos.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href={'/dashboard'}
                className='bg-white text-bluecolor font-medium py-3 px-6 hover:scale-105 rounded-lg flex items-center justify-center transition-all duration-300'
              >
                <LogIn className='mr-2' size={20} />
                Acessar plataforma
              </Link>
              {!isAuthenticated && (
                <Link
                  href={'/auth/signin'}
                  className='bg-bluecolor text-white font-medium py-3 px-6 rounded-lg hover:scale-105 flex items-center justify-center transition-all duration-300'
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
          <h2 className='text-center text-lg md:text-2xl font-bold mb-4 sm:mb-8 lg:mb-12'>
            Como o{' '}
            <span className='font-bold text-xl md:text-3xl italic mr-1'>
              Grade
            </span>{' '}
            pode te ajudar
          </h2>
          {/* CARDS */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
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
