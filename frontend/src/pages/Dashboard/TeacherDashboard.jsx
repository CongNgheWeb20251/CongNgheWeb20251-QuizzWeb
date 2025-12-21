import React from 'react'

import { Suspense, lazy } from 'react'
import ErrorBoundary from '~/components/Error/ErrorBoundary'
import RecentSkeleton from './Components/Skeletons/RecentSkeleton'
import ActivitySkeleton from './Components/Skeletons/ActivitySkeleton'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TopPerformingQuizzes = lazy(() => import('./Components/TopPerformingQuizzes'))
const RecentQuizzes = lazy(() => import('./Components/RecentQuizzes'))
const RecentActivity = lazy(() => import('./Components/RecentActivity'))

export default function TeacherDashboard() {
  const navigate = useNavigate()

  const handleCreateQuiz = () => {
    // Navigate to quiz creation
    navigate('/teacher/create-quiz')
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl text-gray-100 mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your quizzes</p>
          </div>
          <button
            onClick={handleCreateQuiz}
            className="px-6 py-3 bg-[#9333ea] text-white rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Quiz</span>
          </button>
        </div>

        {/* Top Performing Quizzes */}
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <TopPerformingQuizzes />
          </Suspense>
        </ErrorBoundary>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Quizzes */}
          <ErrorBoundary>
            <Suspense fallback={<RecentSkeleton />}>
              <RecentQuizzes />
            </Suspense>
          </ErrorBoundary>

          {/* Recent Activity */}
          <ErrorBoundary>
            <Suspense fallback={<ActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
          </ErrorBoundary>

        </div>
      </main>
    </div>
  )
}
