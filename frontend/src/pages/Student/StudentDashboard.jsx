import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Code,
  Palette,
  Database,
  Cpu,
  Globe,
  MoreVertical,
  Eye,
  RotateCcw,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Calendar,
  Timer,
  TrendingUp,
  Award
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import QuizCard from '~/components/StudentQuiz/QuizCard'
import SkeletonCard from '~/components/Skeleton/QuizCardSkeleton'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import StartQuizModal from '~/components/StudentQuiz/StartQuizModal'
import { startAttemptQuizAPI, fetchQuizzesByStudentAPI } from '~/apis/index'

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [startQuizModal, setStartQuizModal] = useState({
    isOpen: false,
    quiz: null,
    isRetake: false
  })
  const navigate = useNavigate()
  // Simulate data loading
  useEffect(() => {
    setIsLoading(true)
    fetchQuizzesByStudentAPI('?page=1').then((data) => {
      setQuizzes(data.quizzes || [])
      setIsLoading(false)
    // eslint-disable-next-line no-unused-vars
    }).catch((error) => {
      // console.error('Error fetching quizzes:', error)
      setIsLoading(false)
    })
  }, [])

  const toggleMenu = (quizId) => {
    setOpenMenuId(openMenuId === quizId ? null : quizId)
  }

  const handleStartQuiz = (quiz, isRetake) => {
    setStartQuizModal({
      isOpen: true,
      quiz,
      isRetake
    })
  }

  const handleCloseModal = () => {
    setStartQuizModal({
      isOpen: false,
      quiz: null,
      isRetake: false
    })
  }

  const handleConfirmStart = () => {
    // Handle quiz start logic here
    handleCloseModal()
    // startAttemptQuizAPI(startQuizModal.quiz?._id).then((res) => {
    //   const { _id: sessionId, quizId } = res
    //   navigate(`/quizzes/${quizId}/session/${sessionId}`)
    // })
    navigate(`/quizzes/${startQuizModal.quiz?._id}`)

  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900">My Quizzes</h1>
              <p className="mt-0.5 text-gray-600">Track your progress and continue learning</p>
            </div>
            <div className="flex items-center gap-4">
              { /* avatar */ }
              <UserAvatar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 rounded-lg p-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-sky-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl text-gray-900">87.6%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 rounded-lg p-3">
                <Timer className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl text-gray-900">2h 48m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} delay={i * 100} />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
            aria-label="Quiz cards"
          >
            {quizzes.map((quiz, index) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                index={index}
                openMenuId={openMenuId}
                toggleMenu={toggleMenu}
                onStartQuiz={handleStartQuiz}
              />
            ))}
          </div>
        )}
      </main>
      {startQuizModal.quiz && (
        <StartQuizModal
          isOpen={startQuizModal.isOpen}
          onClose={handleCloseModal}
          onStart={handleConfirmStart}
          quiz={startQuizModal.quiz}
          isRetake={startQuizModal.isRetake}
        />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-4" role="status" aria-live="polite">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
        <BookOpen className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-xl text-gray-900 mb-2">No Quizzes Yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        You haven't participated in any quizzes yet. Start your learning journey by taking your first quiz!
      </p>
      {/* <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow inline-flex items-center gap-2">
        <Play className="w-5 h-5" />
        Browse Available Quizzes
      </button> */}
    </div>
  )
}
