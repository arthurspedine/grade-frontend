'use client'

import { genericClassFormSchema, type GenericClassFormType } from '@/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { addClass } from '../_http/handle-http-class'

export function AddClassForm() {
  const { register, handleSubmit, formState } = useForm<GenericClassFormType>({
    resolver: zodResolver(genericClassFormSchema),
  })

  function handleSubmitNewClass(data: GenericClassFormType) {
    data.name = data.name.toLocaleUpperCase()
    const handleRequest = addClass(data)
    toast.promise(handleRequest, {
      loading: 'Adicionando turma...',
      success: () => {
        setTimeout(() => {
          window.location.reload()
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
      className='flex flex-col space-y-2'
      onSubmit={handleSubmit(handleSubmitNewClass)}
    >
      <div className='flex flex-col space-y-1'>
        <label className='text-base font-medium' htmlFor='name'>
          Nome da turma:
        </label>
        <Input
          id='name'
          type='text'
          placeholder='Digite aqui'
          {...register('name')}
        />
        {formState.errors.name ? (
          <p className='text-destructive text-sm pt-0.5'>
            {formState.errors.name.message}
          </p>
        ) : (
          ''
        )}
      </div>
      <div className='w-full flex space-x-4'>
        <DialogTrigger asChild>
          <Button variant={'destructive'} className='grow'>
            Cancelar
          </Button>
        </DialogTrigger>
        <Button variant={'green'} className='grow'>
          Adicionar
        </Button>
      </div>
    </form>
  )
}
