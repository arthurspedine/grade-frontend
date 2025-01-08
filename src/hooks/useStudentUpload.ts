import type { StudentType } from '@/schemas'
import { CSVValidator } from '@/utils/CSVValidator'

const useStudentUpload = (
  // biome-ignore lint/complexity/noBannedTypes: receive any content
  setValue: Function,
  // biome-ignore lint/complexity/noBannedTypes: receive any content
  setError: Function,
  onError?: () => void
) => {
  const validateCSV = (content: string): StudentType[] | null => {
    const lines = content.trim().split('\n')
    const [headerLine, ...studentLines] = lines

    const headerError = CSVValidator.validateHeaders(headerLine.split(','))
    if (headerError) {
      handleError(headerError.message)
      return null
    }

    const studentCount = studentLines.filter(line => line.trim()).length
    const countError = CSVValidator.validateStudentCount(studentCount)
    if (countError) {
      handleError(countError.message)
      return null
    }

    const students: StudentType[] = []

    for (let i = 0; i < studentLines.length; i++) {
      const line = studentLines[i].trim()
      if (!line) continue

      const result = CSVValidator.validateStudentLine(line, i + 2)
      if ('message' in result) {
        handleError(result.message)
        return null
      }

      students.push(result)
    }

    return students
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      handleError('Por favor, selecione um arquivo')
      return
    }

    if (file.type !== 'text/csv') {
      handleError('Por favor, envie apenas arquivos CSV')
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      const validatedStudents = validateCSV(content)

      if (validatedStudents) {
        setValue('students', validatedStudents)
        clearError()
      }
    }

    reader.readAsText(file)
  }

  const handleError = (message: string) => {
    setValue('students', [])
    setError('students', { type: 'manual', message })
    if (onError) onError()
  }

  const clearError = () => {
    setError('students', { type: 'manual', message: '' })
  }

  return handleFileUpload
}

export default useStudentUpload
