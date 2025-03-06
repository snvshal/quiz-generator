"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Home,
  RefreshCw,
  XCircle,
} from "lucide-react"

interface Option {
  id: string
  text: string
}

interface Question {
  id: string
  question: string
  options: Option[]
  correctOptionId: string
}

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    // Get questions from localStorage
    const storedQuestions = localStorage.getItem("mcqQuestions")

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions))
    } else {
      // If no questions found, redirect to home
      router.push("/")
    }
  }, [router])

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return
    setSelectedOptionId(optionId)
  }

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isAnswered) return

    setIsAnswered(true)

    if (selectedOptionId === currentQuestion.correctOptionId) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOptionId(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedOptionId(null)
      setIsAnswered(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOptionId(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                Your Score: {score} / {questions.length}
              </p>
              <p className="text-muted-foreground">
                ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button onClick={handleRestartQuiz} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Restart Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Score: {score} / {currentQuestionIndex + (isAnswered ? 1 : 0)}
            </p>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                selectedOptionId === option.id
                  ? isAnswered
                    ? option.id === currentQuestion.correctOptionId
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-primary bg-primary/5"
                  : isAnswered && option.id === currentQuestion.correctOptionId
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : ""
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="flex-1">{option.text}</div>
              {isAnswered && option.id === currentQuestion.correctOptionId && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isAnswered &&
                selectedOptionId === option.id &&
                option.id !== currentQuestion.correctOptionId && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-2">
            {!isAnswered ? (
              <Button onClick={handleCheckAnswer} disabled={!selectedOptionId}>
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="gap-2">
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Finish Quiz"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
