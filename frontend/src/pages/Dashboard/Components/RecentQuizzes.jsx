import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  Target,
  FileText
} from 'lucide-react'

import { getRecentQuizzesAPI } from '~/apis'

const getRecentQuizzes = async() => {
  const data = await getRecentQuizzesAPI(5)
  return data
}

function RecentQuizzes() {
  const navigate = useNavigate()

  const handleViewQuiz = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}`)
  }

  const handleNavigateToQuizzes = () => {
    navigate('/teacher/quizzes')
  }

  const handleCreateQuiz = () => {
    // Navigate to quiz creation
    navigate('/teacher/create-quiz')
  }

  const { data: quizzes } = useQuery({
    queryKey: ['teacher', 'dashboard', 'recentQuizzes'],
    queryFn: () => getRecentQuizzes()
  })

  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-100">Recent Quizzes</h2>
        <button
          onClick={handleNavigateToQuizzes}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {quizzes.length === 0 ? (
        <EmptyQuizzesState onCreateQuiz={handleCreateQuiz} />
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <QuizListItem
              key={quiz.quizId}
              quiz={quiz}
              onClick={() => handleViewQuiz(quiz.quizId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function QuizListItem({ quiz, onClick }) {
  const statusConfig = {
    completed: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    doing: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock }
  }

  const config = statusConfig[quiz.latestSessionStatus]
  const StatusIcon = config.icon

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-700/50 rounded-xl transition-colors text-left group"
    >
      <div className={`rounded-xl p-3 ${config.color.split(' ')[0]} group-hover:scale-110 transition-transform`}>
        <StatusIcon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-gray-100 mb-1 truncate">{quiz.quizTitle}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {quiz.totalStudents} students
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {quiz.attempts} attempts
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {quiz.latestStartTime
              ? formatDistanceToNow(quiz.latestStartTime, { addSuffix: true })
              : 'No sessions yet'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`px-3 py-1 rounded-lg text-sm border ${config.color}`}>
          {quiz.latestSessionStatus.charAt(0).toUpperCase() + quiz.latestSessionStatus.slice(1)}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>
    </button>
  )
}

// Empty States
function EmptyQuizzesState({ onCreateQuiz }) {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-gray-100 mb-2">No quizzes yet</h3>
      <p className="text-gray-400 mb-4">Get started by creating your first quiz</p>
      <button
        onClick={onCreateQuiz}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create Quiz
      </button>
    </div>
  )
}

export default RecentQuizzes