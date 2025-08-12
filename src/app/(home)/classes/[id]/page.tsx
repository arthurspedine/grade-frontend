'use client'

import { ErrorMessageContainer } from '@/components/error-message-container'
import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
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
    return <ErrorMessageContainer message={error} />
  }

  const { classInfo, categoryList } = data

  if (!classInfo) {
    return <ClassDetailsSkeleton />
  }
  return (
    <>
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
    </>
  )
}
