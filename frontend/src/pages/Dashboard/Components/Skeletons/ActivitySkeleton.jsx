import React from 'react'

function ActivitySkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl text-gray-100 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivitySkeleton