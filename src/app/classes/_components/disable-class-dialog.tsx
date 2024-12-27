'use client'
import type { ClassType } from '@/types'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { disableClass } from '../_http/handle-http-class'

export function DisableClassDialog({ id, name, active }: ClassType) {
  function handleButtonClick() {
    const handleRequest = disableClass(id)
    toast.promise(handleRequest, {
      loading: 'Desativando turma...',
      success: () => {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
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
        <Button variant={'destructive'} className='w-full'>
          Desativar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Desativar turma <span className='italic font-semibold'>{name}</span>
          </DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja desativar está turma?
          </DialogDescription>
        </DialogHeader>
        <div className='w-full flex space-x-4'>
          <DialogTrigger asChild>
            <Button variant={'green'} className='grow'>
              Cancelar
            </Button>
          </DialogTrigger>
          <Button
            onClick={handleButtonClick}
            variant={'destructive'}
            className='grow'
          >
            Desativar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
