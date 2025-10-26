'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { disableClass } from '@/http/handle-http-class'
import type { ClassType } from '@/types'
import { Ban } from 'lucide-react'
import { toast } from 'sonner'

export function DisableClassDialog({ id, name, active }: ClassType) {
  function handleButtonClick() {
    const handleRequest = disableClass(id)
    toast.promise(handleRequest, {
      loading: 'Desativando turma...',
      success: () => {
        window.location.reload()
        return 'Turma desativada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          disabled={!active}
          className='text-destructive hover:bg-destructive/10 hover:text-destructive'
          title='Desativar turma'
        >
          <Ban className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Desativar turma <span className='font-semibold italic'>{name}</span>
          </DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja desativar está turma?
          </DialogDescription>
        </DialogHeader>
        <div className='flex w-full space-x-4'>
          <DialogTrigger asChild>
            <Button variant={'green'} className='grow'>
              Cancelar
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button
              onClick={handleButtonClick}
              variant={'destructive'}
              className='grow'
            >
              Desativar
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  )
}
