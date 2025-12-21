import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Clock,
  Calendar,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Award,
  Timer,
  BarChart3
} from 'lucide-react'

import { getQuizAttemptsAPI } from '~/apis'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import PageLoader from '~/components/Loading/PageLoader'
import StartQuizModal from '~/components/StudentQuiz/StartQuizModal'
import { startAttemptQuizAPI } from '~/apis/index'


const formatDate = (timestamp) => {
  return format(new Date(timestamp), 'MMM d, yyyy')
}

const formatTime = (timestamp) => {
  return format(new Date(timestamp), 'h:mm a')
}

const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const getScoreColor = (accuracy, passingScore) => {
  return accuracy >= passingScore ? 'text-emerald-600' : 'text-rose-600'
}

const getScoreBgColor = (accuracy, passingScore) => {
  return accuracy >= passingScore ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
}

export default function QuizAttemptsList() {

  const [quizAttempts, setQuizAttempts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startQuizModal, setStartQuizModal] = useState(false)
  const navigate = useNavigate()
  const { quizId } = useParams()

  const handleStartQuiz = () => {
    setStartQuizModal(true)
  }

  const handleCloseModal = () => {
    setStartQuizModal(false)
  }

  const handleConfirmStart = () => {
    // Handle quiz start logic here
    handleCloseModal()
    startAttemptQuizAPI(quizId).then((res) => {
      const { sessionId: newSessionId, quizId: newQuizId } = res
      navigate(`/quizzes/${newQuizId}/session/${newSessionId}`)
    })
  }

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        setLoading(true)
        const response = await getQuizAttemptsAPI(quizId)
        setQuizAttempts(response)
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
      //
      } finally {
        setLoading(false)
      }
    }

    fetchQuizAttempts()
  }, [quizId])

  const onViewAttempt = (sessionId) => {
    navigate(`/quizzes/${quizId}/session/${sessionId}/result`)
  }
  const onBack = () => {
    navigate('/dashboard')
  }

  const startDate = quizAttempts?.startTime

  // Process sessions to add calculated fields
  const processedSessions = quizAttempts?.sessions.map((session, index) => ({
    ...session,
    attemptNumber: index + 1,
    accuracy: (session.score / session.totalPoints) * 100,
    maxScore: session.totalPoints,
    dateTaken: session.submitTime
  })) || []

  if (loading || quizAttempts === null) {
    return <PageLoader fullScreen />
  }
  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl text-gray-900">{quizAttempts?.title}</h1>
              <p className="mt-1 text-gray-600">{quizAttempts?.description} • All Attempts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Attempts List */}
        {processedSessions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            {(() => {
              const now = new Date()
              const start = startDate ? new Date(startDate) : null
              const hasStarted = start ? now >= start : true

              if (!hasStarted) {
                return (
                  <>
                    <h3 className="text-xl text-gray-900 mb-2">Quiz Not Yet Available</h3>
                    <p className="text-gray-600 mb-6">
                      The quiz will be available on {formatDate(startDate)} at {formatTime(startDate)}.
                    </p>
                    <button
                      onClick={onBack}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                      aria-label="Go Home"
                    >
                      Go Home
                    </button>
                  </>
                )
              }

              return (
                <>
                  <h3 className="text-xl text-gray-900 mb-2">No Attempts Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't started this quiz yet. Click the button below to begin your first attempt!
                  </p>
                  <button
                    onClick={handleStartQuiz}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    aria-label="Start Quiz"
                  >
                    Start Quiz
                  </button>
                </>
              )
            })()}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900 mb-6">
              Attempt History ({processedSessions.length})
            </h2>

            {/* Desktop: Cards Grid, Mobile: Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {processedSessions.map((attempt, index) => (
                <div
                  key={attempt._id}
                  className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                  onClick={() => onViewAttempt(attempt._id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for attempt ${attempt.attemptNumber}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-500 text-white rounded-lg px-3 py-1">
                            <span className="text-sm">#{attempt.attemptNumber}</span>
                          </div>
                          <h3 className="text-lg text-gray-900">
                            Attempt {attempt.attemptNumber}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(attempt.dateTaken)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(attempt.dateTaken)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewAttempt(attempt._id)
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm hover:shadow group-hover:scale-105"
                        aria-label={`View details for attempt ${attempt.attemptNumber}`}
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>
                    </div>

                    {/* Score Display */}
                    <div className={`rounded-xl border-2 p-5 mb-5 shadow-sm ${getScoreBgColor(attempt.accuracy, quizAttempts.passingScore)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-700">Score</span>
                        <span className={`text-3xl ${getScoreColor(attempt.accuracy, quizAttempts.passingScore)}`}>
                          {attempt.score}/{attempt.maxScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Accuracy</span>
                        <span className={`text-xl ${getScoreColor(attempt.accuracy, quizAttempts.passingScore)}`}>
                          {attempt.accuracy.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-emerald-100 rounded-lg p-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Correct</p>
                            <p className="text-sm text-gray-900">
                              {attempt.correctAnswers}/{attempt.totalQuestions}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-rose-100 rounded-lg p-2">
                            <XCircle className="w-4 h-4 text-rose-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Wrong</p>
                            <p className="text-sm text-gray-900">
                              {attempt.totalQuestions - attempt.correctAnswers}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-violet-100 rounded-lg p-2">
                            <Timer className="w-4 h-4 text-violet-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Time Spent</p>
                            <p className="text-sm text-gray-900">
                              {formatDuration(attempt.timeSpent)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Questions</p>
                            <p className="text-sm text-gray-900">
                              {attempt.totalQuestions}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {startQuizModal && (
        <StartQuizModal
          isOpen={startQuizModal}
          onClose={handleCloseModal}
          onStart={handleConfirmStart}
          quiz= {quizAttempts}
          isRetake={true}
        />
      )}
    </div>
  )
}