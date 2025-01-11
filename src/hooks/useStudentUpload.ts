import type { StudentType } from '@/types'
import { CSVValidator } from '@/utils/CSVValidator'
import { useState } from 'react'

export const useCSVValidation = () => {
  const [students, setStudents] = useState<StudentType[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const validateCSV = async (file: File): Promise<boolean> => {
    try {
      const content = await file.text()
      const lines = content.trim().split('\n')
      const [headerLine, ...studentLines] = lines

      const headerError = CSVValidator.validateHeaders(headerLine.split(','))
      if (headerError) {
        handleError(headerError.message)
        return false
      }

      const studentCount = studentLines.filter(line => line.trim()).length
      const countError = CSVValidator.validateStudentCount(studentCount)
      if (countError) {
        handleError(countError.message)
        return false
      }

      const validatedStudents: StudentType[] = []

      for (let i = 0; i < studentLines.length; i++) {
        const line = studentLines[i].trim()
        if (!line) continue

        const result = CSVValidator.validateStudentLine(line, i + 2)
        if ('message' in result) {
          handleError(result.message)
          return false
        }

        validatedStudents.push(result)
      }

      setStudents(validatedStudents)
      setFileError(null)
      return true
    } catch (error) {
      handleError('Erro ao processar o arquivo.')
      return false
    }
  }

  function handleError(message: string) {
    setFileError(message)
    setStudents([])
  }

  return {
    students,
    fileError,
    validateCSV,
    resetValidation: () => {
      setStudents([])
      setFileError(null)
    },
  }
}
