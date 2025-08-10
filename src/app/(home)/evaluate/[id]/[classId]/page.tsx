import { GoBackButton } from '@/components/go-back-button'
import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { isValid } from '@/helper/validate-uuid'
import { handleGetAssessmentInfo } from '@/http/handle-http-evaluate'
import type { AssessmentInfoType } from '@/types'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EvaluateInfoAssessmentPage({
  params,
}: { params: Promise<{ id: string; classId: string }> }) {
  const { id, classId } = await params

  if (!isValid(id) || !isValid(classId)) {
    return redirect('/assessments')
  }

  const assessmentInfo: AssessmentInfoType | null =
    await handleGetAssessmentInfo(id, classId)

  if (!assessmentInfo) return redirect('/assessments')

  return (
    <section className='mx-auto max-h-screen w-full max-w-[1440px] flex-grow px-8'>
      <div className='flex flex-col space-y-1'>
        <div className='flex items-center justify-between'>
          <Title>
            Avaliação <span className='italic'>{assessmentInfo.name}</span>
          </Title>
          <div className='flex items-center space-x-2'>
            <p>Alunos avalidados</p>
            <span className='font-semibold text-sm'>
              {assessmentInfo.countEvaluatedStudents} /{' '}
              {assessmentInfo.students.length}
            </span>
          </div>
        </div>
        <GoBackButton className='self-end' />
      </div>
      <Table className={'mt-8'}>
        <TableCaption>Lista de alunos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-10'>N°</TableHead>
            <TableHead className='w-20'>RM</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className='text-right'>Avaliado</TableHead>
            <TableHead className='w-32 text-right'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessmentInfo.students.map((student, i) => (
            <TableRow key={student.info.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className='font-medium'>{student.info.rm}</TableCell>
              <TableCell>{student.info.name}</TableCell>
              <TableCell>
                <span className='flex justify-end gap-2'>
                  <CheckCircle
                    className={
                      student.evaluationCompleted
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-primary'
                    }
                    size={24}
                  />
                  {student.evaluationCompleted ? 'Avaliado' : 'Não avaliado'}
                </span>
              </TableCell>
              <TableCell className='text-right'>
                <Button variant={'green'} asChild>
                  <Link href={`/evaluate/student/${student.info.id}`}>
                    {student.evaluationCompleted ? 'Ver avaliação' : 'Avaliar'}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
