'use client'

import { ErrorMessageContainer } from '@/components/error-message-container'
import { Title } from '@/components/title'
import { isValid } from '@/helper/validate-uuid'
import { useEditClass } from '@/hooks/useEditClass'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EditClassForm } from './_components/edit-class-form'
import { EditClassSkeleton } from './_components/edit-class-skeleton'

export default function EditClassPage({
  params,
}: { params: Promise<{ id: string }> }) {
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

  const { data, loading, error } = useEditClass(id)

  if (loading || !id) {
    return <EditClassSkeleton />
  }

  if (error) {
    return <ErrorMessageContainer message={error} />
  }

  const { classInfo, categoryList } = data

  if (!classInfo) {
    return <EditClassSkeleton />
  }

  return (
    <>
      <Title>
        Editar turma <span className='italic'>{classInfo.details.name}</span>
      </Title>
      <EditClassForm
        {...classInfo.details}
        classStudents={classInfo.students}
        categoryList={categoryList}
      />
    </>
  )
}
