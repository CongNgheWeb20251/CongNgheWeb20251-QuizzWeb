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
  Award,
  Sparkles,
  Search,
  Filter
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
  const [searchQuery, setSearchQuery] = useState('')
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
    // 1. Nếu đang làm dở thì tiếp tục session đó
    if (startQuizModal?.quiz?.sessions[0]?.status === 'doing') {
      const sessionId = startQuizModal.quiz.sessions[0]._id
      const quizId = startQuizModal.quiz._id
      navigate(`/quizzes/${quizId}/session/${sessionId}`)
      return
    }
    // 2. Nếu chưa làm thì tạo mới
    startAttemptQuizAPI(startQuizModal.quiz?._id).then((res) => {
      const { sessionId, quizId } = res
      navigate(`/quizzes/${quizId}/session/${sessionId}`)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="logo">
              <span className="logo-qui">Qui</span>
              <span className="logo-zzy">zzy</span>
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
        {/* Hero Section with Search - Solid Color */}
        <div className="relative overflow-hidden bg-sky-500 rounded-3xl shadow-xl mb-8 mt-4">
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

          <div className="relative px-8 sm:px-12 lg:px-16 py-12 sm:py-16">
            {/* Greeting and Title */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <p className="text-sky-100 text-sm sm:text-base">Welcome back!</p>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-3">
                Continue Your
                <br />
                Learning Journey
              </h1>
              <p className="text-sky-100 text-lg sm:text-xl max-w-2xl">
                Track your progress, explore new quizzes, and achieve your goals
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search quizzes by title, subject, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-white rounded-2xl shadow-lg focus:shadow-xl focus:ring-4 focus:ring-blue-300/50 transition-all outline-none text-gray-900 placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Filter className="w-5 h-5 text-gray-500" />
                </button>
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
