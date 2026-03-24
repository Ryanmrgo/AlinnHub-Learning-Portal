'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { AppContext } from '@/app/context/AppContext'
import { toast } from 'react-toastify'

const QuizList = ({ courseId }) => {
  const router = useRouter()
  const { getToken } = useContext(AppContext)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchQuizzes = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/quiz/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setQuizzes(data.quizzes.filter(q => q.is_published))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchQuizzes()
    }
  }, [courseId])

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading quizzes...</div>
  }

  if (quizzes.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push(`/quiz/${quiz.id}`)}
          >
            <h3 className="font-semibold text-gray-800 mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{quiz.duration_minutes} minutes</span>
              <span>Passing: {quiz.passing_score}%</span>
            </div>
            <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              Take Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizList
