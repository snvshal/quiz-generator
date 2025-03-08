"use client"

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
  ListChecks,
  ChevronsRight,
} from "lucide-react"
import { Option, Question, UserAnswer } from "./page"

// ScoreDisplay Component
interface QuizHeaderProps {
  score: number
  showPercentage?: boolean
  userAnswers: UserAnswer[]
  singlePageMode: boolean
  onToggleMode: () => void
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  userAnswers,
  singlePageMode,
  onToggleMode,
  score,
  showPercentage = false,
}) => {
  const answeredQuestionsCount = userAnswers.filter((a) => a.isAnswered).length

  return (
    <Card className="w-full max-w-3xl mb-4">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={singlePageMode ? "default" : "outline"}
              onClick={onToggleMode}
              className="gap-1"
            >
              <ListChecks className="h-4 w-4" />
              Thread
            </Button>
            <Button
              size="sm"
              variant={!singlePageMode ? "default" : "outline"}
              onClick={onToggleMode}
              className="gap-1"
            >
              <ChevronsRight className="h-4 w-4" />
              Step
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Score: {score} / {answeredQuestionsCount}
            {showPercentage &&
              answeredQuestionsCount > 0 &&
              ` (${Math.round((score / answeredQuestionsCount) * 100)}%)`}
          </p>
        </div>
      </CardHeader>
    </Card>
  )
}

// QuestionOption Component
interface QuestionOptionProps {
  option: Option
  question: Question
  userAnswer: UserAnswer | undefined
  onSelect: (questionId: string, optionId: string) => void
}

export const QuestionOption: React.FC<QuestionOptionProps> = ({
  option,
  question,
  userAnswer,
  onSelect,
}) => (
  <div
    className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
      userAnswer?.selectedOptionId === option.id
        ? option.id === question.correctOptionId
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : "border-red-500 bg-red-50 dark:bg-red-950"
        : userAnswer?.isAnswered && option.id === question.correctOptionId
        ? "border-green-500 bg-green-50 dark:bg-green-950"
        : ""
    }`}
    onClick={() => onSelect(question.id, option.id)}
  >
    <div className="flex-1">{option.text}</div>
    {userAnswer?.isAnswered && option.id === question.correctOptionId && (
      <CheckCircle className="h-5 w-5 text-green-500" />
    )}
    {userAnswer?.isAnswered &&
      userAnswer.selectedOptionId === option.id &&
      option.id !== question.correctOptionId && (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
  </div>
)

// Loading Component
export const LoadingCard: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <Card className="w-full max-w-md">
      <CardContent className="pt-0">
        <p className="text-center">Loading questions...</p>
      </CardContent>
    </Card>
  </div>
)

// QuizCompletedCard Component
interface QuizCompletedCardProps {
  score: number
  answeredQuestions: number
  totalQuestions: number
  onRestart: () => void
  onHome: () => void
}

export const QuizCompletedCard: React.FC<QuizCompletedCardProps> = ({
  score,
  answeredQuestions,
  totalQuestions,
  onRestart,
  onHome,
}) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Quiz Completed!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">
            Your Score: {score} / {answeredQuestions}
          </p>
          <p className="text-muted-foreground">
            (
            {answeredQuestions > 0
              ? Math.round((score / answeredQuestions) * 100)
              : 0}
            %)
          </p>
          {answeredQuestions < totalQuestions && (
            <p className="text-sm text-muted-foreground mt-2">
              {totalQuestions - answeredQuestions} questions unanswered
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onHome} className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button onClick={onRestart} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Restart Quiz
        </Button>
      </CardFooter>
    </Card>
  </div>
)

// SinglePageMode Component
interface SinglePageModeProps {
  questions: Question[]
  userAnswers: UserAnswer[]
  onOptionSelect: (questionId: string, optionId: string) => void
  onSubmit: () => void
  onHome: () => void
}

export const SinglePageMode: React.FC<SinglePageModeProps> = ({
  questions,
  userAnswers,
  onOptionSelect,
  onSubmit,
  onHome,
}) => {
  return (
    <div className="w-full max-w-3xl space-y-6 mb-6">
      {questions.map((question, index) => {
        const answer = userAnswers.find((a) => a.questionId === question.id)

        return (
          <Card key={question.id} className="w-full mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Question {index + 1} of {questions.length}
                </p>
                {answer?.isAnswered && (
                  <p className="text-sm font-medium">
                    {answer.selectedOptionId === question.correctOptionId
                      ? "Correct ✓"
                      : "Incorrect ✗"}
                  </p>
                )}
              </div>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option) => (
                <QuestionOption
                  key={option.id}
                  option={option}
                  question={question}
                  userAnswer={answer}
                  onSelect={onOptionSelect}
                />
              ))}
            </CardContent>
          </Card>
        )
      })}
      <Card className="w-full max-w-3xl">
        <CardFooter className="flex justify-between pt-0">
          <Button variant="outline" onClick={onHome} className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            onClick={onSubmit}
            disabled={userAnswers.filter((a) => a.isAnswered).length === 0}
            className="gap-2"
          >
            Finish Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// StepByStepMode Component
interface StepByStepModeProps {
  currentQuestion: Question
  currentQuestionIndex: number
  totalQuestions: number
  userAnswers: UserAnswer[]
  onOptionSelect: (questionId: string, optionId: string) => void
  onPrevious: () => void
  onNext: () => void
}

export const StepByStepMode: React.FC<StepByStepModeProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  userAnswers,
  onOptionSelect,
  onPrevious,
  onNext,
}) => {
  const currentAnswer = userAnswers.find(
    (a) => a.questionId === currentQuestion?.id
  )

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
        <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQuestion.options.map((option) => (
          <QuestionOption
            key={option.id}
            option={option}
            question={currentQuestion}
            userAnswer={currentAnswer}
            onSelect={onOptionSelect}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        {currentAnswer?.isAnswered && (
          <Button
            onClick={onNext}
            className="gap-2"
            disabled={currentQuestionIndex >= totalQuestions}
          >
            {currentQuestionIndex < totalQuestions - 1 ? (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
