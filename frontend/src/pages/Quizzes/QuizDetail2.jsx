/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Edit,
  Share2,
  CircleAlert, X, Trash
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorBoundary from '~/components/Error/ErrorBoundary'
import TableSkeleton from './QuizDashboardPage/skeletons/TableSkeleton'
import MetricsSkeleton from './QuizDashboardPage/skeletons/MetricsSkeleton'
import { getQuizInfo, deleteQuizAPI, publishQuizAPI } from '~/apis'
import ShareQuizModal from '~/components/Modal/ShareQuizModal'
import { useConfirm } from 'material-ui-confirm'
import { FRONTEND_URL } from '~/utils/constants'
import { set } from 'lodash'

const ScoreDistributionCard = lazy(() => import('./QuizDashboardPage/ScoreDistributionCard'))
const StudentsTable = lazy(() => import('./QuizDashboardPage/StudentsTable'))
const KeyMetrics = lazy(() => import('./QuizDashboardPage/KeyMetrics'))


// fetch quiz info directly to always get fresh data on each visit

export default function QuizDashboard() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [quizInfo, setQuizInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    if (!id) return
    setLoading(true)
    setError(null)
    const fetchData = async () => {
      try {
        const data = await getQuizInfo(id)
        if (mounted) setQuizInfo(data)
      } catch (err) {
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [id])

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const confirm = useConfirm()

  const handleEdit = () => {
    navigate(`/teacher/edit/${id}/step1`)
  }

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: (
        <div className='flex  flex-row items-center gap-2 justify-between'>
          <div className='flex gap-2 items-center'>
            <CircleAlert color="red" />
            <span>Are you sure you want to delete this quiz?</span>
          </div>
          {/* <X color="red" /> */}
        </div>
      ),
      description: (
        <div className="mt-4 space-y-2 mb-2">
          <p className="text-sm text-gray-600">
            This action will permanently delete
            <span className="mx-1 font-semibold text-gray-900">
              {quizInfo?.title}
            </span>
            and all related data.
          </p>
          <div className="pt-1 text-sm text-gray-600">
            Type
            <span className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-900">
              {quizInfo?.title}
            </span>
            to confirm.
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          ⚠ This action cannot be undone.
          </div>
        </div>
      ),
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
      confirmationKeyword: `${quizInfo?.title}`,
      allowClose: true

    })
    if (confirmed) {
      // Call the API to delete the quiz
      await deleteQuizAPI(id)
      navigate('/teacher/quizzes')
      return
    }
    else {
      () => {}
    }
  }

  const handleShare = async () => {
    if (quizInfo?.status === 'published') {
      setShareModalOpen(true)
      return
    }

    // Quiz đang draft > hiện confirm
    const { confirmed } = await confirm({
      title: (
        <div className="flex items-center gap-2">
          <CircleAlert color="orange" />
          <span>Quiz is not published yet</span>
        </div>
      ),
      description: (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">
            The quiz
            <span className="mx-1 font-semibold text-gray-900">
              {quizInfo?.title}
            </span>
            is currently in
            <span className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-900">
              Draft
            </span>
            status.
          </p>

          <p className="text-sm text-gray-600">
            You need to publish this quiz before sharing it with students.
          </p>

          <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
            Students cannot access draft quizzes.
          </div>
        </div>
      ),
      confirmationText: 'Publish now',
      cancellationText: 'Cancel',
      allowClose: true
    })

    if (confirmed) {
      await publishQuizAPI(quizInfo._id)
      // cần cập nhật lại quizInfo sau khi publish
      const updatedQuizInfo = { ...quizInfo, status: 'published' }
      setQuizInfo(updatedQuizInfo)
      // Sau khi publish xong thì mở share
      setShareModalOpen(true)
      return
    }
    else {
      () => {}
    }
  }

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
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 border border-red-500 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                <Trash className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Delete</span>
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
      <ShareQuizModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        quizTitle={quizInfo?.title}
        joinUrl={quizInfo?.inviteToken ? `${FRONTEND_URL}/join/${quizInfo?.inviteToken}` : ''}
      />
    </div>
  )
}
