import React, { useState } from 'react'
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


const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const getScoreColor = (accuracy) => {
  if (accuracy >= 90) return 'text-emerald-600'
  if (accuracy >= 70) return 'text-sky-600'
  if (accuracy >= 50) return 'text-amber-600'
  return 'text-rose-600'
}

const getScoreBgColor = (accuracy) => {
  if (accuracy >= 90) return 'bg-emerald-50 border-emerald-200'
  if (accuracy >= 70) return 'bg-sky-50 border-sky-200'
  if (accuracy >= 50) return 'bg-amber-50 border-amber-200'
  return 'bg-rose-50 border-rose-200'
}

export default function QuizAttemptsList({
  quizTitle,
  quizSubject,
  attempts = [{
    _id: 'att-1',
    attemptNumber: 3,
    dateTaken: '2025-12-08T14:30:00',
    score: 85,
    maxScore: 100,
    correctAnswers: 17,
    totalQuestions: 20,
    timeSpent: 25,
    accuracy: 85
  },
  {
    _id: 'att-2',
    attemptNumber: 2,
    dateTaken: '2025-12-05T10:15:00',
    score: 75,
    maxScore: 100,
    correctAnswers: 15,
    totalQuestions: 20,
    timeSpent: 28,
    accuracy: 75
  },
  {
    _id: 'att-3',
    attemptNumber: 1,
    dateTaken: '2025-12-01T16:45:00',
    score: 70,
    maxScore: 100,
    correctAnswers: 14,
    totalQuestions: 20,
    timeSpent: 30,
    accuracy: 70
  }
  ],
  onBack,
  onViewAttempt
}) {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl text-gray-900">{quizTitle}</h1>
              <p className="mt-1 text-gray-600">{quizSubject} • All Attempts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Attempts List */}
        {attempts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No Attempts Yet</h3>
            <p className="text-gray-600">
              You haven{'\''}t taken this quiz yet. Start your first attempt to see your results here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900 mb-6">
              Attempt History ({attempts.length})
            </h2>

            {/* Desktop: Cards Grid, Mobile: Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {attempts.map((attempt, index) => (
                <div
                  key={attempt._id}
                  className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                  onMouseEnter={() => setHoveredId(attempt._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onViewAttempt(attempt._id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for attempt ${attempt.attemptNumber}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onViewAttempt(attempt._id)
                    }
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg px-3 py-1">
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
                    <div className={`rounded-xl border-2 p-5 mb-5 shadow-sm ${getScoreBgColor(attempt.accuracy)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-700">Score</span>
                        <span className={`text-3xl ${getScoreColor(attempt.accuracy)}`}>
                          {attempt.score}/{attempt.maxScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Accuracy</span>
                        <span className={`text-xl ${getScoreColor(attempt.accuracy)}`}>
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
    </div>
  )
}