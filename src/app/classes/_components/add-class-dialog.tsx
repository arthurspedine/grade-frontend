import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddClassForm } from './add-class-form'

export function AddClassDialog({
  text = 'Adicione agora mesmo!',
}: { text?: string }) {
  return (
    <Dialog>
      <DialogTrigger className='underline text-primary cursor-pointer'>
        {text}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar uma nova turma</DialogTitle>
          <DialogDescription>
            Preencha com o nome da turma que deseja adicionar!
          </DialogDescription>
        </DialogHeader>
        <AddClassForm />
      </DialogContent>
    </Dialog>
  )
}
