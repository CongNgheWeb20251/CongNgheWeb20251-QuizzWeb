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

import QuizCard from '~/components/StudentQuiz/QuizCard'
import SkeletonCard from '~/components/Skeleton/QuizCardSkeleton'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import StartQuizModal from '~/components/StudentQuiz/StartQuizModal'

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [startQuizModal, setStartQuizModal] = useState({
    isOpen: false,
    quiz: null,
    isRetake: false
  })
  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setQuizzes([
        {
          _id: '1',
          title: 'JavaScript Fundamentals',
          subject: 'JavaScript',
          subjectIcon: 'JavaScript',
          dateTaken: '2025-12-01',
          status: 'completed',
          score: 85,
          maxScore: 100,
          timeSpent: 18,
          duration: 20,
          progress: 100,
          description: 'Test your understanding of core JavaScript concepts including variables, functions, and control flow.',
          questionCount: 15,
          difficulty: 'medium',
          attemptNumber: 1,
          allowRetake: true
        },
        {
          _id: '2',
          title: 'React Hooks Deep Dive',
          subject: 'React',
          subjectIcon: 'React',
          dateTaken: '2025-11-28',
          status: 'in-progress',
          score: 45,
          maxScore: 100,
          timeSpent: 12,
          duration: 30,
          progress: 60,
          description: 'Master React Hooks including useState, useEffect, useContext, and custom hooks.',
          questionCount: 20,
          difficulty: 'hard'
        },
        {
          _id: '3',
          title: 'CSS Grid & Flexbox',
          subject: 'CSS',
          subjectIcon: 'CSS',
          dateTaken: '2025-11-25',
          status: 'completed',
          score: 92,
          maxScore: 100,
          timeSpent: 15,
          duration: 20,
          progress: 100,
          description: 'Learn modern CSS layout techniques with Grid and Flexbox for responsive designs.',
          questionCount: 12,
          difficulty: 'medium',
          attemptNumber: 1,
          allowRetake: true
        },
        {
          _id: '4',
          title: 'Database Design Principles',
          subject: 'Database',
          subjectIcon: 'Database',
          dateTaken: '2025-11-20',
          status: 'missed',
          duration: 25,
          description: 'Understand database normalization, relationships, and schema design best practices.',
          questionCount: 18,
          difficulty: 'hard'
        },
        {
          _id: '5',
          title: 'Modern Web Development',
          subject: 'Web Dev',
          subjectIcon: 'Web Dev',
          dateTaken: '2025-11-15',
          status: 'completed',
          score: 78,
          maxScore: 100,
          timeSpent: 25,
          duration: 30,
          progress: 100,
          description: 'Explore modern web development tools, frameworks, and best practices.',
          questionCount: 22,
          difficulty: 'medium',
          attemptNumber: 1,
          allowRetake: true
        },
        {
          _id: '6',
          title: 'TypeScript Essentials',
          subject: 'JavaScript',
          subjectIcon: 'JavaScript',
          dateTaken: '2025-11-10',
          status: 'completed',
          score: 88,
          maxScore: 100,
          timeSpent: 22,
          duration: 25,
          progress: 100,
          description: 'Learn TypeScript fundamentals including types, interfaces, and generics.',
          questionCount: 16,
          difficulty: 'medium',
          attemptNumber: 1,
          allowRetake: true
        },
        {
          _id: '7',
          title: 'Advanced React Patterns',
          subject: 'React',
          subjectIcon: 'React',
          dateTaken: '2025-11-05',
          status: 'completed',
          score: 95,
          maxScore: 100,
          timeSpent: 28,
          duration: 30,
          progress: 100,
          description: 'Master advanced React patterns like render props, HOCs, and compound components.',
          questionCount: 20,
          difficulty: 'hard',
          attemptNumber: 1,
          allowRetake: true
        },
        {
          _id: '8',
          title: 'Responsive Design',
          subject: 'CSS',
          subjectIcon: 'CSS',
          dateTaken: '2025-11-01',
          status: 'available',
          duration: 20,
          description: 'Create responsive web layouts that work seamlessly across all devices and screen sizes.',
          questionCount: 14,
          difficulty: 'easy'
        }
      ])
      setIsLoading(false)
    }, 1500)
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
    console.log('Starting quiz:', startQuizModal.quiz?._id)
    handleCloseModal()
    // Navigate to quiz taking page or start quiz logic
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
          quizTitle={startQuizModal.quiz.title}
          description={startQuizModal.quiz.description || 'Test your knowledge with this quiz.'}
          metadata={{
            duration: startQuizModal.quiz.duration || 20,
            questionCount: startQuizModal.quiz.questionCount || 10,
            difficulty: startQuizModal.quiz.difficulty,
            attemptNumber: startQuizModal.isRetake ? (startQuizModal.quiz.attemptNumber || 1) + 1 : undefined,
          }}
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
      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:shadow inline-flex items-center gap-2">
        <Play className="w-5 h-5" />
        Browse Available Quizzes
      </button>
    </div>
  )
}
