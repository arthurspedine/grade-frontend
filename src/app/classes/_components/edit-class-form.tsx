'use client'

import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type GenericClassFormType, genericClassFormSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateClass } from '../_http/handle-http-class'

export function EditClassForm({ id, name }: { id: string; name: string }) {
  const { register, handleSubmit, formState } = useForm<GenericClassFormType>({
    resolver: zodResolver(genericClassFormSchema),
  })

  function handleSubmitEditClass(data: GenericClassFormType) {
    data.name = data.name.toLocaleUpperCase()

    const handleRequest = updateClass(id, data)
    toast.promise(handleRequest, {
      loading: 'Editando turma...',
      success: () => {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        return 'Turma editada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <form
      className='flex flex-col space-y-2'
      onSubmit={handleSubmit(handleSubmitEditClass)}
    >
      <div className='flex flex-col space-y-1'>
        <label className='text-base font-medium' htmlFor='name'>
          Nome da turma:
        </label>
        <Input
          id='name'
          type='text'
          placeholder='Digite aqui'
          defaultValue={name}
          {...register('name')}
        />
        {formState.errors.name && (
          <p className='text-destructive text-sm'>
            {formState.errors.name.message}
          </p>
        )}
      </div>
      <div className='w-full flex space-x-4'>
        <DialogTrigger asChild>
          <Button variant={'destructive'} className='grow'>
            Cancelar
          </Button>
        </DialogTrigger>
        <Button variant={'green'} className='grow'>
          Editar
        </Button>
      </div>
    </form>
  )
}
