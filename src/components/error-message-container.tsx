import { Button } from './ui/button'

export function ErrorMessageContainer({ message }: { message: string }) {
  return (
    <div className='text-center'>
      <h2 className='mb-2 font-semibold text-destructive text-lg'>
        Erro ao carregar dados
      </h2>
      <p className='mb-4 text-muted-foreground'>{message}</p>
      <Button onClick={() => window.location.reload()} variant='outline'>
        Tentar novamente
      </Button>
    </div>
  )
}
