import type { ClassType } from '@/types'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { EditClassForm } from './edit-class-form'
import { Button } from '@/components/ui/button'

export function EditClassDialog({ id, name, active }: ClassType) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>Editar</Button>
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
