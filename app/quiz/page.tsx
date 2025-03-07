"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LoadingCard,
  QuizCompletedCard,
  QuizHeader,
  SinglePageMode,
  StepByStepMode,
} from "./components"

export interface Option {
  id: string
  text: string
}

export interface Question {
  id: string
  question: string
  options: Option[]
  correctOptionId: string
}

export interface UserAnswer {
  questionId: string
  selectedOptionId: string | null
  isAnswered: boolean
}

// Main QuizPage Component
export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [score, setScore] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [singlePageMode, setSinglePageMode] = useState<boolean>(false)

  useEffect(() => {
    // Get questions from localStorage
    const storedQuestions = localStorage.getItem("mcqQuestions")
    const storedMode = localStorage.getItem("quizMode")

    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions) as Question[]
      setQuestions(parsedQuestions)

      // Initialize user answers array
      setUserAnswers(
        parsedQuestions.map((q: Question) => ({
          questionId: q.id,
          selectedOptionId: null,
          isAnswered: false,
        }))
      )

      // Check if there's a stored quiz mode preference
      if (storedMode) {
        setSinglePageMode(storedMode === "single")
      }
    } else {
      // If no questions found, redirect to home
      router.push("/")
    }
  }, [router])

  const handleOptionSelect = (questionId: string, optionId: string): void => {
    const questionIndex = questions.findIndex((q) => q.id === questionId)
    const question = questions[questionIndex]

    // Check if already answered
    const existingAnswer = userAnswers.find((a) => a.questionId === questionId)
    if (existingAnswer?.isAnswered) return

    // Update the answer and mark as answered in one operation
    const newUserAnswers = [...userAnswers]
    const answerIndex = newUserAnswers.findIndex(
      (a) => a.questionId === questionId
    )

    if (answerIndex !== -1) {
      newUserAnswers[answerIndex] = {
        questionId,
        selectedOptionId: optionId,
        isAnswered: true,
      }
    }

    setUserAnswers(newUserAnswers)

    // Update score if correct
    if (optionId === question.correctOptionId) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRestartQuiz = (): void => {
    setCurrentQuestionIndex(0)
    setUserAnswers(
      questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: null,
        isAnswered: false,
      }))
    )
    setScore(0)
    setQuizCompleted(false)
  }

  const handleToggleMode = (): void => {
    const newMode = !singlePageMode
    setSinglePageMode(newMode)
    localStorage.setItem("quizMode", newMode ? "single" : "step")
  }

  const handleSubmitQuiz = (): void => {
    // Check any unanswered questions
    const answeredQuestions = userAnswers.filter((a) => a.isAnswered).length

    if (answeredQuestions === 0) {
      return // Don't submit if nothing answered
    }

    setQuizCompleted(true)
  }

  const navigateHome = (): void => {
    router.push("/")
  }

  // Handle loading state
  if (questions.length === 0 || userAnswers.length === 0) {
    return <LoadingCard />
  }

  // Handle completed quiz
  if (quizCompleted) {
    const answeredQuestions = userAnswers.filter((a) => a.isAnswered).length

    return (
      <QuizCompletedCard
        score={score}
        answeredQuestions={answeredQuestions}
        totalQuestions={questions.length}
        onRestart={handleRestartQuiz}
        onHome={navigateHome}
      />
    )
  }

  // Default to step-by-step mode
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <QuizHeader
        userAnswers={userAnswers}
        score={score}
        onToggleMode={handleToggleMode}
        singlePageMode={singlePageMode}
      />
      {singlePageMode ? (
        <SinglePageMode
          questions={questions}
          userAnswers={userAnswers}
          onOptionSelect={handleOptionSelect}
          onSubmit={handleSubmitQuiz}
          onHome={navigateHome}
        />
      ) : (
        <StepByStepMode
          currentQuestion={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          userAnswers={userAnswers}
          onOptionSelect={handleOptionSelect}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
        />
      )}
    </div>
  )
}
