import React from 'react'

function TableSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-gray-100">Students</h2>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableSkeleton