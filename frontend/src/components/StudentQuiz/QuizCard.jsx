import { useState } from 'react'
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

const subjectIcons = {
  'programming': <Code className="w-6 h-6" />,
  'React': <Cpu className="w-6 h-6" />,
  'CSS': <Palette className="w-6 h-6" />,
  'Database': <Database className="w-6 h-6" />,
  'Web Dev': <Globe className="w-6 h-6" />,
  'General': <BookOpen className="w-6 h-6" />
}

const subjectColors= {
  'programming': 'bg-amber-100 text-amber-700',
  'React': 'bg-sky-100 text-sky-700',
  'CSS': 'bg-pink-100 text-pink-700',
  'Database': 'bg-emerald-100 text-emerald-700',
  'Web Dev': 'bg-purple-100 text-purple-700',
  'General': 'bg-blue-100 text-blue-700'
}

const QuizCard = ({ quiz, index, openMenuId, toggleMenu, onStartQuiz }) => {
  const [isHovered, setIsHovered] = useState(false)
  const isExpired = quiz.endTime && new Date(quiz.endTime) < new Date()
  const firstSession = quiz.sessions?.[0]
  const badge = getStatusBadge()

  function getStatusBadge() {
    const badges = {
      completed: {
        label: 'Completed',
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: <CheckCircle2 className="w-3 h-3" />
      },
      'doing': {
        label: 'In Progress',
        className: 'bg-sky-100 text-sky-700 border-sky-200',
        icon: <Clock className="w-3 h-3" />
      },
      missed: {
        label: 'Missed',
        className: 'bg-rose-100 text-rose-700 border-rose-200',
        icon: <XCircle className="w-3 h-3" />
      },
      available: {
        label: 'Available',
        className: 'bg-violet-100 text-violet-700 border-violet-200',
        icon: <AlertCircle className="w-3 h-3" />
      }
    }
    // 1) Đã có session → completed hoặc in-progress
    if (firstSession?.status === 'completed') return badges.completed
    if (firstSession?.status === 'doing') return badges['doing']

    // 2) Chưa có session nào → missed hoặc available
    if (quiz.sessionsCount === 0) {
      if (isExpired) return badges.missed
      return badges.available
    }

    return null
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  function formatTime(minutes) {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all timeLimit-300 flex flex-col h-full animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="listitem"
      aria-label={`${quiz.title} quiz card`}
    >
      {/* Card Header */}
      <div className="p-6 pb-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`rounded-xl p-3 ${subjectColors[quiz.category] || 'bg-blue-100 text-blue-700'} transition-transform ${isHovered ? 'scale-110' : 'scale-100'}`}>
            {subjectIcons[quiz.category] || <BookOpen className="w-6 h-6" />}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleMenu(quiz._id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="More options"
              aria-expanded={openMenuId === quiz._id}
              aria-haspopup="true"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {openMenuId === quiz._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-scale-in">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Retake
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-500">{quiz.description}</p>
          {/* <p className="text-sm text-gray-500">{quiz.category}</p> */}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(quiz.endTime)}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm mb-4 self-start ${badge?.className}`}>
          {badge?.icon}
          <span>{badge?.label}</span>
        </div>

        {/* Score Section */}
        {/* {quiz.status !== 'available' && quiz.status !== 'missed' && (
          <div className="mb-4 flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Score</span>
              <span className="text-lg text-gray-900">
                {quiz.score}/{quiz.maxScore}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all timeLimit-500 ${
                  (quiz.score || 0) >= 90
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : (quiz.score || 0) >= 70
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600'
                }`}
                style={{ width: `${((quiz.score || 0) / (quiz.maxScore || 100)) * 100}%` }}
                role="progressbar"
                aria-valuenow={quiz.score}
                aria-valuemin={0}
                aria-valuemax={quiz.maxScore}
                aria-label={`Score: ${quiz.score} out of ${quiz.maxScore}`}
              />
            </div>
          </div>
        )} */}

        {quiz.endTime && new Date(quiz.endTime) < new Date() && (
          <div className="mb-4 flex-grow">
            <div className="flex items-center gap-2 text-rose-600">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">Deadline passed</span>
            </div>
          </div>
        )}

        {/* Time Section */}
        {quiz.sessionsCount > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4" />
              <span>{formatTime(quiz.timeSpent)}</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTime(quiz.timeLimit)} limit</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer - Actions */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-100 mt-auto">
        <div className="flex gap-2">
          {
            // 1) Có session và session đã done → Results + Retake
            quiz.sessionsCount > 0 && firstSession?.status === 'done' ? (
              <>
                <button
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                  aria-label={`View results for ${quiz.title}`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Results</span>
                </button>

                <button
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                  aria-label={`Retake ${quiz.title}`}
                  onClick={() => onStartQuiz(quiz, true)}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Retake</span>
                </button>
              </>
            ) :
            // 2) Có session in-progress → Continue
              firstSession?.status === 'in-progress' ? (
                <button
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                  aria-label={`Continue ${quiz.title}`}
                  onClick={() => onStartQuiz(quiz, false)}
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Continue</span>
                </button>
              ) :

                // 3) Không có session nào
                quiz.sessionsCount === 0 && !isExpired ? (
                  <button
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                    aria-label={`Start ${quiz.title}`}
                    onClick={() => onStartQuiz(quiz, false)}
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Start Quiz</span>
                  </button>
                ) :

                // 4) Missed → hết hạn và chưa làm
                  quiz.sessionsCount === 0 && isExpired ? (
                    <button
                      className="w-full px-4 py-2.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                      disabled
                      aria-label="Quiz missed"
                    >
                      <span className="text-sm">Missed</span>
                    </button>
                  ) : null}
        </div>
      </div>
    </article>
  )
}

export default QuizCard