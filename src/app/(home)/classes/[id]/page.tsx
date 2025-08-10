'use client'

import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { isValid } from '@/helper/validate-uuid'
import { useClassDetails } from '@/hooks/useClassDetails'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { StudentsTable } from '../_components/students-table'
import { ClassDetailsSkeleton } from './_components/class-details-skeleton'

export default function ClassInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      if (!isValid(resolvedParams.id)) {
        redirect('/classes')
      }
      setId(resolvedParams.id)
    }
    getParams()
  }, [params])

  const { data, loading, error } = useClassDetails(id)

  if (loading || !id) {
    return <ClassDetailsSkeleton />
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

  const { classInfo, categoryList } = data

  if (!classInfo) {
    return <ClassDetailsSkeleton />
  }
  return (
    <section className='mx-auto max-h-screen w-full max-w-[1440px] flex-grow px-8'>
      <div className='flex items-center justify-between'>
        <Title>
          Turma <span className='italic'>{classInfo.details.name}</span>
        </Title>
        <GoBackButton goBackUrl='/classes' />
      </div>
      <p>
        Categoria:{' '}
        {categoryList.find(c => c.key === classInfo.details.category)?.label}
      </p>
      <StudentsTable students={classInfo.students} className='my-8' />
    </section>
  )
}
