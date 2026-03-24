'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { AppContextProvider, AppContext } from '@/app/context/AppContext'
import Navbar from '@/components/student/Navbar'
import Footer from '@/components/student/Footer'
import { toast } from 'react-toastify'
import Loading from '@/components/student/Loading'

const QuizContent = () => {
  const { quizId } = useParams()
  const router = useRouter()
  const { getToken } = useContext(AppContext)

  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [previousAttempts, setPreviousAttempts] = useState([])

  const fetchQuiz = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setQuiz(data.quiz)
        setTimeLeft(data.quiz.duration_minutes * 60)
        setStartTime(new Date().toISOString())
        setAnswers(
          data.quiz.questions.map(q => ({
            questionId: q.id,
            selectedOptionId: null
          }))
        )
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPreviousAttempts = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/quiz/attempts/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setPreviousAttempts(data.attempts)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAnswer = (optionId) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex].selectedOptionId = optionId
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a.selectedOptionId === null).length
    if (unanswered > 0) {
      if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
        return
      }
    }

    try {
      const token = await getToken()
      const { data } = await axios.post('/api/quiz/attempt/submit', {
        quizId,
        answers,
        startedAt: startTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setResults(data.result)
        setShowResults(true)
        toast.success('Quiz submitted successfully')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchQuiz()
    fetchPreviousAttempts()
  }, [quizId])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResults])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (loading) return <Loading />

  if (!quiz) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Quiz not found</p>
        </div>
        <Footer />
      </>
    )
  }

  if (showResults) {
    const passed = results.score >= quiz.passing_score

    return (
      <>
        <Navbar />
        <div className="min-h-screen py-10 px-4 md:px-36">
          <div className="max-w-3xl mx-auto bg-white border rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
            <h2 className="text-xl text-gray-600 mb-6">{quiz.title}</h2>

            <div className={`p-6 rounded-lg mb-6 ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-2xl font-bold mb-2 ${passed ? 'text-green-800' : 'text-red-800'}`}>
                {passed ? 'Passed!' : 'Failed'}
              </p>
              <p className={`text-lg ${passed ? 'text-green-700' : 'text-red-700'}`}>
                Score: {results.score}% ({results.totalPoints}/{results.maxPoints} points)
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Time taken: {Math.floor(results.timeTakenSeconds / 60)}m {results.timeTakenSeconds % 60}s
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Answer Review</h3>
              {quiz.questions.map((question, idx) => {
                const userAnswer = results.gradedAnswers[idx]
                const isCorrect = userAnswer?.isCorrect

                return (
                  <div key={question.id} className={`p-4 rounded mb-3 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className="font-medium text-gray-800 mb-2">
                      {idx + 1}. {question.question_text}
                      <span className={`ml-2 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        ({userAnswer?.points || 0}/{question.points} points)
                      </span>
                    </p>
                    <div className="ml-4 space-y-1">
                      {question.options.map(opt => {
                        const isUserChoice = opt.id === userAnswer?.selectedOptionId
                        const isCorrectAnswer = opt.is_correct

                        return (
                          <p
                            key={opt.id}
                            className={`text-sm ${isCorrectAnswer ? 'text-green-700 font-medium' : isUserChoice ? 'text-red-600' : 'text-gray-600'}`}
                          >
                            {isCorrectAnswer && '✓ '}
                            {isUserChoice && !isCorrectAnswer && '✗ '}
                            {opt.option_text}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const answeredCount = answers.filter(a => a.selectedOptionId !== null).length

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 px-4 md:px-36">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.description}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </p>
                <p className="text-sm text-gray-500">Time remaining</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
              <p>
                Answered: {answeredCount}/{quiz.questions.length}
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestionIndex].selectedOptionId === option.id

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-600' : 'border-gray-400'
                      }`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                      </div>
                      <p className="text-gray-800">{option.option_text}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {previousAttempts.length > 0 && (
            <div className="bg-white border rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Attempts</h3>
              <div className="space-y-2">
                {previousAttempts.slice(0, 3).map((attempt) => (
                  <div key={attempt.id} className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">
                      {new Date(attempt.completed_at).toLocaleDateString()} at{' '}
                      {new Date(attempt.completed_at).toLocaleTimeString()}
                    </p>
                    <p className={`font-medium ${attempt.score >= quiz.passing_score ? 'text-green-600' : 'text-red-600'}`}>
                      Score: {attempt.score}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function QuizPage() {
  return (
    <AppContextProvider>
      <QuizContent />
    </AppContextProvider>
  )
}
