import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Award
} from 'lucide-react'

import { getTopQuizzesAPI } from '~/apis'

const getTopQuizzes = async () => {
  const data = await getTopQuizzesAPI(3)
  return data
}

function TopPerformingQuizzes() {
  const navigate = useNavigate()

  const handleViewQuiz = (quizId) => {
    navigate(`/teacher/quizzes/${quizId}`)
  }

  const { data } = useQuery({
    queryKey: ['teacher', 'dashboard', 'top'],
    queryFn: () => getTopQuizzes()
  })

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 mb-6">
      <h2 className="text-xl text-gray-100 mb-6">Top Performing Quizzes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data
          .sort((a, b) => b.completions - a.completions)
          .map((quiz, index) => (
            <TopQuizCard key={quiz._id} quiz={quiz} rank={index + 1} onClick={() => handleViewQuiz(quiz._id)} />
          ))}
      </div>
    </div>
  )
}

function TopQuizCard({ quiz, rank, onClick }) {
  const medalColors = [
    'from-amber-400 to-yellow-500',
    'from-gray-400 to-gray-500',
    'from-orange-400 to-amber-500'
  ]

  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-5 border border-gray-600 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-br ${medalColors[rank - 1]} text-white w-8 h-8 rounded-lg flex items-center justify-center`}>
          {rank}
        </div>
        <Award className="w-6 h-6 text-gray-500 group-hover:text-amber-400 transition-colors" />
      </div>

      <h3 className="text-gray-100 mb-2 line-clamp-2 min-h-[3rem]">{quiz.title}</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Completion</span>
          <span className="text-blue-400">{quiz.completions}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Students</span>
          <span className="text-gray-100">{quiz.students}</span>
        </div>
      </div>
    </button>
  )
}

export default TopPerformingQuizzes