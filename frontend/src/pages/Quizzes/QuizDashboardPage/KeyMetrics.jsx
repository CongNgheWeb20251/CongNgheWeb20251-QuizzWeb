import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, Target, Award, Activity } from 'lucide-react'
import { getQuizMetricsAPI } from '~/apis'

export default function KeyMetrics({ quizId }) {
  const { data: metrics } = useQuery({
    queryKey: ['quizMetrics', quizId],
    queryFn: () => getQuizMetricsAPI(quizId),
    enabled: !!quizId
  })

  const {
    totalStudents = 0,
    completedStudents = 0,
    totalAttempts = 0,
    avgScore = 0,
    highestScore = 0,
    passRate = 0,
    passedStudents = 0,
    passingScore = 0
  } = metrics || {}

  const avgAttemptsPerStudent = totalStudents > 0 ? (totalAttempts / totalStudents).toFixed(1) : '0.0'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        icon={<Users className="w-6 h-6" />}
        label="Total Students"
        value={totalStudents.toString()}
        subValue={`${completedStudents} completed`}
        color="bg-blue-500/10 text-blue-400"
      />
      <MetricCard
        icon={<Activity className="w-6 h-6" />}
        label="Total Attempts"
        value={totalAttempts.toString()}
        subValue={`${avgAttemptsPerStudent} avg per student`}
        color="bg-purple-500/10 text-purple-400"
      />
      <MetricCard
        icon={<Award className="w-6 h-6" />}
        label="Average Score"
        value={`${Math.round(avgScore)}%`}
        subValue={highestScore > 0 ? `Highest: ${highestScore}%` : 'No scores yet'}
        color="bg-emerald-500/10 text-emerald-400"
      />
      <MetricCard
        icon={<Target className="w-6 h-6" />}
        label="Pass Rate"
        value={`${Math.round(passRate)}%`}
        subValue={`${passedStudents} passed (≥${passingScore}%)`}
        color="bg-amber-500/10 text-amber-400"
      />
    </div>
  )
}

function MetricCard({ icon, label, value, subValue, color }) {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 hover:shadow-xl hover:border-gray-600 transition-all">
      <div className={`rounded-xl p-3 ${color} w-fit mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{label}</h3>
      <p className="text-3xl text-gray-100 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subValue}</p>
    </div>
  )
}
