import React from 'react'

export default function MetricsSkeleton() {
  const Item = () => (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-700 mb-4" />
      <div className="h-3 w-24 bg-gray-700 rounded mb-2" />
      <div className="h-7 w-32 bg-gray-700 rounded mb-1" />
      <div className="h-3 w-28 bg-gray-700 rounded" />
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Item />
      <Item />
      <Item />
      <Item />
    </div>
  )
}
