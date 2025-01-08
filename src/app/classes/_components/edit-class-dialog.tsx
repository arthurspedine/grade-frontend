import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { ClassType } from '@/types'
import { EditClassForm } from './edit-class-form'

export function EditClassDialog({ id, name, active }: ClassType) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full' disabled={!active}>
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Editar turma <span className='italic font-semibold'>{name}</span>
          </DialogTitle>
          <DialogDescription>
            Preencha com o novo nome desta turma.
          </DialogDescription>
        </DialogHeader>
        <EditClassForm id={id} name={name} />
      </DialogContent>
    </Dialog>
  )
}
