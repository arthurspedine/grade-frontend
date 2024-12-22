import React from 'react'
import { getAccessToken, getSession } from '@auth0/nextjs-auth0'
import handleClassesList from './handle-classes-list'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddClassForm } from './_components/add-class-form'

type ClassType = {
  id: string
  name: string
  active: boolean
}

export default async function ClassesPage() {
  const classesList: ClassType[] = await handleClassesList()

  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      <h1 className='font-bold text-2xl'>Turmas</h1>
      {!classesList ? (
        <Skeleton className='w-20 h-6' />
      ) : (
        <div>
          {classesList.length > 0 ? (
            <div>
              {classesList.map(c => (
                <div key={c.id}>
                  <p>{c.id}</p>
                  <p>{c.name}</p>
                  <p>{c.active ? 'Active' : 'Inactive'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground text-center pt-16'>
              Parece que você ainda não adicionou turmas na sua conta.{' '}
              <Dialog>
                <DialogTrigger className='underline text-primary cursor-pointer'>
                  Adicione agora mesmo!
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
            </p>
          )}
        </div>
      )}
    </section>
  )
}
