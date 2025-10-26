'use client'

import { ErrorMessageContainer } from '@/components/error-message-container'
import { NoItemsCard } from '@/components/no-items-card'
import { Title } from '@/components/title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  BookOpen,
  CheckCircle,
  LayoutGrid,
  LayoutList,
  Plus,
  Search,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ClassesSkeleton } from './_components/classes-skeleton'
import { DisableClassDialog } from './_components/disable-class-dialog'

export default function ClassesPage() {
  const { data, loading, error } = useClasses()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Filter classes based on search and category
  const filteredClasses = useMemo(() => {
    if (!data?.classesList) return []

    let filtered = data.classesList

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter)
    }

    return filtered
  }, [data?.classesList, searchTerm, categoryFilter])

  // Function to clear all filters
  function clearAllFilters() {
    setSearchTerm('')
    setCategoryFilter('all')
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'all'

  if (loading) {
    return <ClassesSkeleton />
  }

  if (error) {
    return <ErrorMessageContainer message={error} />
  }

  const { classesList, categoryList } = data

  return (
    <>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Title>Turmas</Title>
        <Button asChild>
          <Link href={'/classes/add'}>
            <Plus className='mr-2 size-4' />
            Nova Turma
          </Link>
        </Button>
      </div>

      {classesList.length > 0 ? (
        <>
          {/* Search, Filters and View Toggle */}
          <div className='mb-6 flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <div className='relative max-w-md flex-1'>
                <Search className='-translate-y-1/2 absolute top-1/2 left-3 size-4 transform text-muted-foreground' />
                <Input
                  placeholder='Buscar turma...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-full sm:w-48'>
                  <SelectValue placeholder='Categoria' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas</SelectItem>
                  {categoryList.map(category => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='flex gap-2'>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size='icon'
                  onClick={() => setViewMode('table')}
                  title='Visualização em tabela'
                >
                  <LayoutList className='size-4' />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size='icon'
                  onClick={() => setViewMode('grid')}
                  title='Visualização em grade'
                >
                  <LayoutGrid className='size-4' />
                </Button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant='outline'
                  size='default'
                  onClick={clearAllFilters}
                  className='flex items-center gap-2'
                >
                  <X className='size-4' />
                  Limpar
                </Button>
              )}
            </div>

            {/* Results Counter */}
            <div className='text-muted-foreground text-sm'>
              Mostrando {filteredClasses.length} de {classesList.length} turmas
            </div>
          </div>

          {filteredClasses.length === 0 ? (
            <Card>
              <CardContent className='p-8 text-center'>
                <p className='text-muted-foreground'>
                  Nenhuma turma encontrada com os filtros aplicados
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'table' ? (
            // TABLE VIEW
            <div className='overflow-hidden rounded-lg bg-accent p-2 shadow-md'>
              <Table>
                <TableCaption>Lista de turmas</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Turma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className='text-right'>Opções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-3'>
                          <div className='rounded-full bg-green-100 p-2 dark:bg-green-900/30'>
                            <Users className='size-4 text-green-600 dark:text-green-400' />
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.active ? 'default' : 'secondary'}
                          className='flex w-fit items-center gap-1'
                        >
                          {c.active ? (
                            <>
                              <CheckCircle className='size-3' />
                              Ativa
                            </>
                          ) : (
                            <>
                              <XCircle className='size-3' />
                              Inativa
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {
                          categoryList.find(
                            category => category.key === c.category
                          )?.label
                        }
                      </TableCell>
                      <TableCell>
                        <div className='flex justify-end gap-2'>
                          <Button variant='secondary' size='sm' asChild>
                            <Link href={`/classes/${c.id}`}>Ver turma</Link>
                          </Button>
                          <Button variant='outline' size='sm' asChild>
                            <Link href={`/classes/edit/${c.id}`}>Editar</Link>
                          </Button>
                          <DisableClassDialog {...c} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // GRID VIEW
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredClasses.map(c => (
                <Card
                  key={c.id}
                  className='overflow-hidden transition-shadow hover:shadow-lg dark:shadow-white/10'
                >
                  <CardHeader className='rounded-t-md border-b bg-gradient-to-r from-green-50 to-emerald-50 pb-4 dark:from-green-900/20 dark:to-emerald-900/20'>
                    <div className='flex items-start gap-3'>
                      <div className='rounded-full bg-green-500 p-2.5'>
                        <Users className='size-5 text-white' />
                      </div>
                      <div className='flex-1'>
                        <h3 className='mb-2 font-semibold text-lg'>{c.name}</h3>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant={c.active ? 'default' : 'secondary'}
                            className='flex w-fit items-center gap-1'
                          >
                            {c.active ? (
                              <>
                                <CheckCircle className='size-3' />
                                Ativa
                              </>
                            ) : (
                              <>
                                <XCircle className='size-3' />
                                Inativa
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3 rounded-b-md bg-accent p-4'>
                    <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                      <BookOpen className='size-4' />
                      <span>
                        {
                          categoryList.find(
                            category => category.key === c.category
                          )?.label
                        }
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='secondary'
                        size='sm'
                        className='flex-1'
                        asChild
                      >
                        <Link href={`/classes/${c.id}`}>Ver turma</Link>
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1'
                        asChild
                      >
                        <Link href={`/classes/edit/${c.id}`}>Editar</Link>
                      </Button>
                      <DisableClassDialog {...c} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <NoItemsCard
          title='Nenhuma turma encontrada'
          description='Comece criando uma turma para iniciar o acompanhamento.'
          buttonText='Criar nova turma'
          buttonLink='/classes/add'
          Icon={Plus}
        />
      )}
    </>
  )
}
