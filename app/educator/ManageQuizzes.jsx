'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '@/app/context/AppContext'
import { toast } from 'react-toastify'
import { assets } from '@/lib/assets'
import Loading from '@/components/student/Loading'

const ManageQuizzes = () => {
  const { getToken, isEducator } = useContext(AppContext)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    passingScore: 70,
    questions: []
  })

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple_choice',
    points: 1,
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  })

  const fetchCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/educator/courses', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setCourses(data.courses)
        if (data.courses.length > 0) {
          setSelectedCourse(data.courses[0])
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizzes = async (courseId) => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/quiz/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setQuizzes(data.quizzes)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddQuestion = () => {
    const hasCorrectAnswer = currentQuestion.options.some(opt => opt.isCorrect && opt.text.trim())
    if (!currentQuestion.text.trim()) {
      toast.error('Question text is required')
      return
    }
    if (!hasCorrectAnswer) {
      toast.error('Mark at least one correct answer')
      return
    }

    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { ...currentQuestion }]
    })

    setCurrentQuestion({
      text: '',
      type: 'multiple_choice',
      points: 1,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    })

    toast.success('Question added')
  }

  const handleRemoveQuestion = (index) => {
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.filter((_, i) => i !== index)
    })
  }

  const handleCreateQuiz = async () => {
    try {
      if (!quizForm.title.trim()) {
        toast.error('Quiz title is required')
        return
      }

      if (quizForm.questions.length === 0) {
        toast.error('Add at least one question')
        return
      }

      const token = await getToken()
      const { data } = await axios.post('/api/quiz/create', {
        courseId: selectedCourse._id,
        title: quizForm.title,
        description: quizForm.description,
        durationMinutes: quizForm.durationMinutes,
        passingScore: quizForm.passingScore,
        questions: quizForm.questions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success('Quiz created successfully')
        setShowCreateModal(false)
        setQuizForm({
          title: '',
          description: '',
          durationMinutes: 30,
          passingScore: 70,
          questions: []
        })
        fetchQuizzes(selectedCourse._id)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      const token = await getToken()
      const { data } = await axios.put(`/api/quiz/${quizId}`, {
        isPublished: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success(currentStatus ? 'Quiz unpublished' : 'Quiz published')
        fetchQuizzes(selectedCourse._id)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      const token = await getToken()
      const { data } = await axios.delete(`/api/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success('Quiz deleted')
        fetchQuizzes(selectedCourse._id)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchCourses()
    }
  }, [isEducator])

  useEffect(() => {
    if (selectedCourse) {
      fetchQuizzes(selectedCourse._id)
    }
  }, [selectedCourse])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Quizzes</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
          <select
            value={selectedCourse?._id || ''}
            onChange={(e) => {
              const course = courses.find(c => c._id === e.target.value)
              setSelectedCourse(course)
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
          >
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseTitle}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Quiz
        </button>

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quiz Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Passing Score</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-800">{quiz.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quiz.duration_minutes} min</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quiz.passing_score}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${quiz.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {quiz.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePublish(quiz.id, quiz.is_published)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {quiz.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No quizzes created yet. Click "Create New Quiz" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Create New Quiz</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <img src={assets.cross_icon} alt="Close" className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                  rows={3}
                  placeholder="Enter quiz description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={quizForm.durationMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, durationMinutes: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    value={quizForm.passingScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Question</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <input
                      type="text"
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                      <input
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                        min={1}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options (check correct answer)</label>
                    {currentQuestion.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options]
                            newOptions[idx].isCorrect = e.target.checked
                            setCurrentQuestion({ ...currentQuestion, options: newOptions })
                          }}
                          className="w-5 h-5"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options]
                            newOptions[idx].text = e.target.value
                            setCurrentQuestion({ ...currentQuestion, options: newOptions })
                          }}
                          className="border border-gray-300 rounded px-4 py-2 flex-1"
                          placeholder={`Option ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Question to Quiz
                  </button>
                </div>
              </div>

              {quizForm.questions.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions Added ({quizForm.questions.length})</h3>
                  {quizForm.questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-gray-800">{idx + 1}. {q.text}</p>
                        <button
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="ml-4 space-y-1">
                        {q.options.map((opt, optIdx) => (
                          <p key={optIdx} className={`text-sm ${opt.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                            {opt.isCorrect && '✓ '}{opt.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuiz}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageQuizzes
