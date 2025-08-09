'use client'

import { Title } from '@/components/title'
import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import { StudentsTable } from '../_components/students-table'
import { GoBackButton } from '@/components/go-back-button'
import { useClassDetails } from '@/http/use/useClassDetails'
import { ClassDetailsSkeleton } from './_components/class-details-skeleton'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

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

  const { classInfo, categoryList } = data

  if (!classInfo) {
    return <ClassDetailsSkeleton />
  }
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow max-h-screen'>
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
