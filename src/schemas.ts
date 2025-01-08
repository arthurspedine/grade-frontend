import { z } from 'zod'

const studentSchema = z.object({
  rm: z.string().min(1, 'RM do estudante é obrigatório.'),
  name: z.string().min(1, 'Nome do estudante é obrigatório.'),
})

export type StudentType = z.infer<typeof studentSchema>

export const genericClassFormSchema = z.object({
  name: z.string().min(1, 'O nome da turma é obrigatório.'),
  category: z.string().nonempty('Selecione uma categoria.'),
  students: z
    .array(studentSchema)
    .min(10, 'É necessário pelo menos 10 estudantes.'),
})

export type GenericClassFormType = z.infer<typeof genericClassFormSchema>
