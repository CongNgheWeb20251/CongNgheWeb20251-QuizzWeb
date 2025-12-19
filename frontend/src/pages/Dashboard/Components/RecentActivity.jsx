import React from 'react'
import { differenceInHours, format, formatDistanceToNowStrict } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react'

const getRecentActivities = () => {
  return [
    {
      _id: 'a1',
      type: 'completed',
      quizTitle: 'JavaScript Fundamentals',
      studentName: 'Sarah Johnson',
      timestamp: '2025-12-17T14:30:00',
      score: 92
    },
    {
      _id: 'a2',
      type: 'started',
      quizTitle: 'React Hooks Deep Dive',
      studentName: 'Michael Chen',
      timestamp: '2025-12-17T13:15:00'
    },
    {
      _id: 'a3',
      type: 'completed',
      quizTitle: 'Database Design Principles',
      studentName: 'Emily Rodriguez',
      timestamp: '2025-12-17T11:45:00',
      score: 88
    },
    {
      _id: 'a4',
      type: 'completed',
      quizTitle: 'JavaScript Fundamentals',
      studentName: 'David Park',
      timestamp: '2025-12-17T10:20:00',
      score: 78
    },
    {
      _id: 'a5',
      type: 'created',
      quizTitle: 'TypeScript Essentials',
      timestamp: '2025-12-16T16:00:00'
    }
  ]
}

function RecentActivity() {
  const { data: activities } = useQuery({
    queryKey: ['teacher', 'dashboard', 'recentActivities'],
    queryFn: () => getRecentActivities()
  })

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl text-gray-100 mb-6">Recent Activity</h2>

      {activities.length === 0 ? (
        <EmptyActivityState />
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}


function ActivityItem({ activity }) {
  const getActivityIcon = () => {
    switch (activity.type) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    case 'started':
      return <Clock className="w-5 h-5 text-blue-400" />
    case 'created':
      return <Plus className="w-5 h-5 text-purple-400" />
    default:
      return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityText = () => {
    switch (activity.type) {
    case 'completed':
      return (
        <>
          <span className="text-gray-100">{activity.studentName}</span> completed{' '}
          <span className="text-gray-100">{activity.quizTitle}</span>
          {activity.score && (
            <span className="text-emerald-400"> • {activity.score}%</span>
          )}
        </>
      )
    case 'started':
      return (
        <>
          <span className="text-gray-100">{activity.studentName}</span> started{' '}
          <span className="text-gray-100">{activity.quizTitle}</span>
        </>
      )
    case 'created':
      return (
        <>
          Created <span className="text-gray-100">{activity.quizTitle}</span>
        </>
      )
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const hours = differenceInHours(new Date(), date)
    if (hours < 24) return formatDistanceToNowStrict(date, { addSuffix: true })
    return format(date, 'MMM d')
  }

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-700 last:border-0 last:pb-0">
      <div className="mt-0.5">{getActivityIcon()}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-300 leading-relaxed">
          {getActivityText()}
        </p>
        <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
      </div>
    </div>
  )
}

function EmptyActivityState() {
  return (
    <div className="text-center py-8">
      <div className="bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
        <Activity className="w-6 h-6 text-gray-500" />
      </div>
      <p className="text-gray-400 text-sm">No recent activity</p>
    </div>
  )
}

export default RecentActivity