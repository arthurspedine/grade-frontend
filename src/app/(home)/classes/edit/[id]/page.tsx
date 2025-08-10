'use client'

import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
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
    return <EditClassSkeleton />
  }

  return (
    <section className='mx-auto flex h-full w-full max-w-[1440px] flex-col px-8'>
      <Title>
        Editar turma <span className='italic'>{classInfo.details.name}</span>
      </Title>
      <EditClassForm
        {...classInfo.details}
        classStudents={classInfo.students}
        categoryList={categoryList}
      />
    </section>
  )
}
