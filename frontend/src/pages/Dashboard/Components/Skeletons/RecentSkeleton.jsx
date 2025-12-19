import React from 'react'
import { ChevronRight } from 'lucide-react'

function RecentSkeleton() {
  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-100">Recent Quizzes</h2>
        <button
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
            <div className="w-12 h-12 bg-gray-600 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentSkeleton