'use client'

import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import {} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useClasses } from '@/hooks/useClasses'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ClassesSkeleton } from './_components/classes-skeleton'
import { DisableClassDialog } from './_components/disable-class-dialog'

export default function ClassesPage() {
  const { data, loading, error } = useClasses()

  if (loading) {
    return <ClassesSkeleton />
  }

  if (error) {
    return <ErrorMessageContainer message={error} />
  }

  const { classesList, categoryList } = data

  return (
    <>
      <div className='flex items-center justify-between'>
        <Title>Turmas</Title>
        {classesList.length > 0 && (
          <Link href={'/classes/add'} className='text hover:underline'>
            Adicionar turma
          </Link>
        )}
      </div>

      <div className='mt-4'>
        {classesList.length > 0 ? (
          // WHEN THE USER HAS AT LEAST ONE CLASS
          <Table>
            <TableCaption>Lista de turmas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Turma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className='text-right'>Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classesList.map(c => (
                <TableRow key={c.id}>
                  <TableCell className='font-medium'>{c.name}</TableCell>
                  <TableCell>{c.active ? 'ATIVA' : 'INATIVA'}</TableCell>
                  <TableCell>
                    {
                      categoryList.find(category => category.key === c.category)
                        ?.label
                    }
                  </TableCell>
                  <TableCell className='flex w-full justify-end'>
                    <div className='mr-2 flex max-w-72 flex-grow space-x-2'>
                      <Button variant={'secondary'} asChild>
                        <Link href={`/classes/${c.id}`}>Ver turma</Link>
                      </Button>
                      <Button variant={'outline'} asChild>
                        <Link href={`/classes/edit/${c.id}`}>Editar</Link>
                      </Button>
                      <DisableClassDialog {...c} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <NoItemsCard
            title='Nenhuma turma encontrada'
            description='Comece criando uma turma ou avaliação para iniciar o acompanhamento.'
            buttonText='Criar nova turma'
            buttonLink='/classes/add'
            Icon={Plus}
          />
        )}
      </div>
    </>
  )
}
