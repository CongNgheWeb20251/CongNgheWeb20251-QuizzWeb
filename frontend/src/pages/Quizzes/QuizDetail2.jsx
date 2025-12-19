import React from 'react'
import {
  ArrowLeft,
  Edit,
  Share2
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useQuery } from '@tanstack/react-query'
import ErrorBoundary from '~/components/Error/ErrorBoundary'
import TableSkeleton from './QuizDashboardPage/skeletons/TableSkeleton'
import MetricsSkeleton from './QuizDashboardPage/skeletons/MetricsSkeleton'
import { getQuizInfo } from '~/apis'

const ScoreDistributionCard = lazy(() => import('./QuizDashboardPage/ScoreDistributionCard'))
const StudentsTable = lazy(() => import('./QuizDashboardPage/StudentsTable'))
const KeyMetrics = lazy(() => import('./QuizDashboardPage/KeyMetrics'))


// fetch quiz info
function useQuizInfo(quizId) {
  return useQuery({
    queryKey: ['quizInfo', quizId],
    queryFn: () => getQuizInfo(quizId),
    enabled: Boolean(quizId), // chỉ chạy khi có quizId từ params
    suspense: false // header cần hiển thị ngay nên không dùng suspense
  })
}

export default function QuizDashboard() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: quizInfo } = useQuizInfo(id)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {navigate('/teacher/quizzes')}}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl text-gray-100">{quizInfo?.title || '...'}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {(quizInfo?.category || '-')}
                {' '}•{' '}
                {(quizInfo?.questionOrderIds.length ?? '-')}{' '}questions
                {' '}•{' '}
                {(quizInfo?.timeLimit ?? '-')}{' '}minutes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <ErrorBoundary>
          <Suspense fallback={<MetricsSkeleton />}>
            <KeyMetrics quizId={id} />
          </Suspense>
        </ErrorBoundary>

        {/* Charts Section */}
        <div className="gap-6 mb-8">
          {/* Score Distribution */}
          <ErrorBoundary>
            <Suspense fallback={<>Loading...</>}>
              <ScoreDistributionCard quizId={id} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Students List */}
        <ErrorBoundary>
          <Suspense fallback={<TableSkeleton />}>
            <StudentsTable quizId={id} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
