import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  Target,
  FileText
} from 'lucide-react'

const getRecentQuizzes = () => {
  return [
    { _id: 'quiz1', title: 'Algebra Basics', completions: 80, status: 'doing', students: 120 },
    { _id: 'quiz2', title: 'World History', completions: 65, status: 'completed', students: 100 },
    { _id: 'quiz3', title: 'Biology 101', completions: 50, status: 'doing', students: 90 },
    { _id: 'quiz4', title: 'Chemistry Basics', completions: 70, status: 'doing', students: 110 },
    { _id: 'quiz5', title: 'English Literature', completions: 90, status: 'completed', students: 130 }
  ]
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
    alert('Navigate to quiz creation page')
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
          {quizzes.slice(0, 5).map((quiz) => (
            <QuizListItem
              key={quiz._id}
              quiz={quiz}
              onClick={() => handleViewQuiz(quiz._id)}
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

  const config = statusConfig[quiz.status]
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
        <h3 className="text-gray-100 mb-1 truncate">{quiz.title}</h3>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {quiz.students} students
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {quiz.completions}% completed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`px-3 py-1 rounded-lg text-sm border ${config.color}`}>
          {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
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