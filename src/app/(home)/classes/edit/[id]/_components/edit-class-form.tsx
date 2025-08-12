'use client'

import { StudentsTable } from '@/app/(home)/classes/_components/students-table'
import { GoBackButton } from '@/components/go-back-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCSVValidation } from '@/hooks/useStudentUpload'
import { updateClass } from '@/http/handle-http-class'
import { type EditClassFormType, editClassFormSchema } from '@/schemas'
import type { ClassType, StudentType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileQuestion } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type EditClassFormProps = {
  categoryList: { key: string; label: string }[]
  classStudents: StudentType[]
}

export function EditClassForm({
  id,
  name,
  category,
  classStudents,
  categoryList,
}: ClassType & EditClassFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditClassFormType>({
    resolver: zodResolver(editClassFormSchema),
    defaultValues: {
      name: name || '',
      category: category || '',
    },
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { students, setStudents, fileError, validateCSV, resetValidation } =
    useCSVValidation()

  useEffect(() => {
    setStudents(classStudents)
  }, [classStudents, setStudents])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      resetValidation()
      return
    }

    const isValid = await validateCSV(file)
    if (!isValid && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function arraysEqual(oldStudents: StudentType[], newStudents: StudentType[]) {
    if (oldStudents.length !== newStudents.length) return false

    const s1 = oldStudents.slice().sort((a, b) => Number(a.rm) - Number(b.rm))
    const s2 = newStudents.slice().sort((a, b) => Number(a.rm) - Number(b.rm))

    for (let i = 0; i < s1.length; i++) {
      if (s1[i].rm !== s2[i].rm || s1[i].name !== s2[i].name) return false
    }

    return true
  }

  async function handleSubmitEditClass(data: EditClassFormType) {
    if (students.length === 0) {
      toast.error('Selecione um arquivo válido da lista de alunos.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      return
    }

    const formData = new FormData()
    formData.append('id', id)
    formData.append('name', data.name)
    formData.append('category', data.category)
    if (!arraysEqual(classStudents, students)) {
      if (data.csvFile instanceof FileList) {
        formData.append('file', data.csvFile[0])
      } else {
        console.error('O arquivo não foi selecionado corretamente')
      }
    }

    const handleRequest = updateClass(formData)
    toast.promise(handleRequest, {
      loading: 'Editando turma...',
      success: () => {
        setTimeout(() => {
          redirect('/classes')
        }, 500)
        return 'Turma editada com sucesso.'
      },
      error:
        'Algo deu errado. Por favor, verifique se os alunos não estão em outras turmas ou tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <form
      className='flex flex-col gap-4 px-2 py-4 lg:gap-8 lg:px-6'
      onSubmit={handleSubmit(handleSubmitEditClass)}
    >
      {/* INPUTS NAME AND CATEGORY */}
      <div className='flex w-full flex-col gap-2 lg:flex-row'>
        {/* NAME */}
        <div className='flex w-full flex-col gap-1 lg:w-1/2'>
          <div className='flex items-center space-x-2'>
            <label className='font-medium text-base' htmlFor='name'>
              Nome:
            </label>
            <Input
              id='name'
              type='text'
              placeholder='Digite aqui'
              autoCapitalize='on'
              {...register('name')}
              defaultValue={name}
              onChange={e => {
                const { value } = e.target
                e.target.value = value.toUpperCase()
              }}
            />
          </div>
          {errors.name && (
            <p className='pt-0.5 text-destructive text-sm'>
              {errors.name.message}
            </p>
          )}
        </div>
        {/* CATEGORY */}
        <div className='flex w-full flex-col gap-1 lg:w-1/2 lg:items-end'>
          <div className='flex items-center space-x-2'>
            <label className='font-medium text-base' htmlFor='category'>
              Categoria:
            </label>
            <Controller
              name='category'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className='w-[180px]' id='category'>
                    <SelectValue placeholder={'Selecione...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map(c => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.category && (
            <p className='pt-0.5 text-destructive text-sm'>
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col-reverse justify-between gap-4 sm:flex-row sm:gap-0'>
        <div className='space-y-1'>
          <div className='flex items-center space-x-2'>
            <Input
              type='file'
              accept='.csv'
              className='w-full sm:w-60'
              {...register('csvFile', {
                onChange: handleFileChange,
              })}
              ref={e => {
                register('csvFile').ref(e)
                fileInputRef.current = e
              }}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type='button'>
                  <FileQuestion />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Arquivo no formato .csv, separado por vírgulas.</p>
                  <p>Colunas: rm, name</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {(errors.csvFile || fileError) && (
            <p className='pb-2 text-destructive text-sm'>
              {errors.csvFile?.message || fileError}
            </p>
          )}
        </div>
        <div className='flex space-x-2'>
          <GoBackButton
            className='grow justify-center text-center'
            goBackUrl='/classes'
          />
          <Button variant={'green'} className='grow'>
            Salvar Turma
          </Button>
        </div>
      </div>
      <StudentsTable students={students} />
    </form>
  )
}
