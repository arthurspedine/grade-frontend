'use client'

import { Title } from '@/components/title'
import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import { EditClassForm } from './_components/edit-class-form'
import { useEditClass } from '@/hooks/useEditClass'
import { EditClassSkeleton } from './_components/edit-class-skeleton'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

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
    return <EditClassSkeleton />
  }

  return (
    <section className='max-w-[1440px] mx-auto w-full h-full px-8 flex flex-col'>
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
