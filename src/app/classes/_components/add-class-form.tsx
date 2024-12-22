'use client'

import { addClassSchema, type AddClassType } from '@/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { handleAddNewClass } from '../handle-add-new-class'
import { useRouter } from 'next/navigation'

export function AddClassForm() {
  const router = useRouter()

  const { register, handleSubmit, formState } = useForm<AddClassType>({
    resolver: zodResolver(addClassSchema),
  })

  function handleSubmitNewClass(data: AddClassType) {
    data.name = data.name.toLocaleUpperCase()

    const handleRequest = handleAddNewClass(data)
    toast.promise(handleRequest, {
      loading: 'Adicionando turma...',
      success: () => {
        setTimeout(() => {
          router.replace('/classes')
          router.refresh()
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
      </div>
      <div className='w-full flex space-x-4'>
        <DialogTrigger asChild>
          <Button variant={'destructive'} className='grow'>
            Cancelar
          </Button>
        </DialogTrigger>
        <Button variant={'add'} className='grow'>
          Adicionar
        </Button>
      </div>
    </form>
  )
}
