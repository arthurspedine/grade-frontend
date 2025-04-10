'use client'
import type { StudentEvaluationInfo } from '@/interfaces'
import { redirect } from 'next/navigation'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'studentEvaluation'

interface EvaluationContextType {
  evaluationData: StudentEvaluationInfo | null
  updateCategoryScore: (
    questionNumber: number,
    categoryIndex: number,
    score: number
  ) => void
  isEvaluationComplete: () => boolean
  dataLoaded: boolean
  loadData: (initialData: StudentEvaluationInfo) => void
}

const EvaluationContext = createContext<EvaluationContextType | null>(null)

export const useEvaluation = () => {
  const context = useContext(EvaluationContext)

  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider')
  }
  return context
}

export function EvaluationProvider({
  children,
}: { children: React.ReactNode }) {
  const [evaluation, setEvaluation] = useState<StudentEvaluationInfo | null>(
    null
  )

  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  useEffect(() => {
    const savedEvaluation = localStorage.getItem('studentEvaluation')
    if (savedEvaluation) {
      try {
        setEvaluation(JSON.parse(savedEvaluation))
      } catch (error) {
        console.error('Erro ao carregar avaliação:', error)
        redirect('/assessments')
      }
    }
    setDataLoaded(true)
  }, [])

  function loadData(initialData: StudentEvaluationInfo) {
    const savedEvaluation = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (savedEvaluation) {
      try {
        const evaluation: StudentEvaluationInfo = JSON.parse(savedEvaluation)

        if (evaluation.student.id === initialData.student.id) {
          if (evaluation.questions.length === initialData.questions.length) {
            // Check if all category IDs match
            const hasChangedStructure = evaluation.questions.some(
              (question, qIndex) => {
                const initialQuestion = initialData.questions[qIndex]

                if (
                  question.categories.length !==
                  initialQuestion.categories.length
                ) {
                  return true
                }

                // Check if all categories have matching IDs
                return question.categories.some(
                  (category, cIndex) =>
                    category.id !== initialQuestion.categories[cIndex].id
                )
              }
            )

            // If structure hasn't changed, we can keep the saved data
            if (!hasChangedStructure) {
              setEvaluation(evaluation)
              return
            }
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      }
    }

    // If we got here, we need to use initial data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData))
    setEvaluation(initialData)
  }

  function updateCategoryScore(
    questionNumber: number,
    categoryIndex: number,
    score: number
  ) {
    if (!evaluation) return

    setEvaluation(prev => {
      if (!prev) return null

      const updatedQuestions = prev.questions.map(question => {
        if (question.questionNumber === questionNumber) {
          const updatedCategories = [...question.categories]

          updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            answeredScore: score,
          }
          return {
            ...question,
            categories: updatedCategories,
          }
        }
        return question
      })

      const newEvaluation = { ...prev, questions: updatedQuestions }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEvaluation))

      return newEvaluation
    })
  }

  function isEvaluationComplete(): boolean {
    if (!evaluation) return false

    const valid = evaluation.questions.every(question =>
      question.categories.every(
        category =>
          typeof category.answeredScore === 'number' &&
          category.answeredScore >= 0
      )
    )
    if (valid && !evaluation.evaluationCompleted) {
      const updatedEvaluation = { ...evaluation, evaluationCompleted: true }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(evaluation))
      setEvaluation(updatedEvaluation)
    }
    return valid
  }

  return (
    <EvaluationContext.Provider
      value={{
        evaluationData: evaluation,
        updateCategoryScore,
        isEvaluationComplete,
        dataLoaded: dataLoaded,
        loadData,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}
