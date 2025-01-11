'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { genericClassFormSchema, type GenericClassFormType } from '@/schemas'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '@/components/ui/table'
import { FileQuestion } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useRef } from 'react'
import { useCSVValidation } from '@/hooks/useStudentUpload'
import { toast } from 'sonner'
import { addClass } from '../../_http/handle-http-class'
import { redirect } from 'next/navigation'

type AddClassFormProps = {
  categoryList: { key: string; label: string }[]
}

export function AddClassForm({ categoryList }: AddClassFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GenericClassFormType>({
    resolver: zodResolver(genericClassFormSchema),
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { students, fileError, validateCSV, resetValidation } =
    useCSVValidation()

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

  async function handleSubmitNewClass(data: GenericClassFormType) {
    if (students.length === 0) {
      toast.error('Selecione um arquivo válido da lista de alunos.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      return
    }

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('category', data.category)
    if (data.csvFile instanceof FileList) {
      formData.append('file', data.csvFile[0])
    } else {
      console.error('O arquivo não foi selecionado corretamente')
    }

    const handleRequest = addClass(formData)
    toast.promise(handleRequest, {
      loading: 'Adicionando turma...',
      success: () => {
        setTimeout(() => {
          redirect('/classes')
        }, 1000)
        return 'Turma adicionada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <form
      className='flex flex-col px-8 py-4'
      onSubmit={handleSubmit(handleSubmitNewClass)}
    >
      <div className='flex flex-col space-y-8'>
        {/* INPUTS */}
        <div className='w-full flex space-x-2'>
          <div className='w-1/2 flex flex-col space-y-1'>
            <div className='flex items-center space-x-2'>
              <label className='text-base font-medium' htmlFor='name'>
                Nome:
              </label>
              <Input
                id='name'
                type='text'
                placeholder='Digite aqui'
                autoCapitalize='on'
                {...register('name')}
                onChange={e => {
                  const { value } = e.target
                  e.target.value = value.toUpperCase()
                }}
              />
            </div>
            {errors.name && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className='w-1/2 flex flex-col items-end space-y-1'>
            <div className='flex items-center space-x-2'>
              <label className='text-base font-medium' htmlFor='category'>
                Categoria:
              </label>
              <Controller
                name='category'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className='w-[180px]' id='category'>
                      <SelectValue placeholder='Selecione...' />
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
              <p className='text-destructive text-sm pt-0.5'>
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-between'>
          <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
              <Input
                type='file'
                accept='.csv'
                className={`w-60 ${students.length > 0 ? 'border-green-600' : ''}`}
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
              <p className='text-destructive text-sm pb-2'>
                {errors.csvFile?.message || fileError}
              </p>
            )}
          </div>
          <Button variant={'green'}>Adicionar Turma</Button>
        </div>
        <Table>
          <TableCaption>Lista de alunos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>N°</TableHead>
              <TableHead className='w-20'>RM</TableHead>
              <TableHead>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((c, i) => (
              <TableRow key={c.rm}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className='font-medium'>{c.rm}</TableCell>
                <TableCell>{c.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </form>
  )
}
