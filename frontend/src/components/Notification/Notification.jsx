import React from 'react'
import { Bell } from 'lucide-react'

function Notification() {
  return (
    <>
      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
        <Bell className="w-5 h-5 text-gray-400" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </>
  )
}

export default Notification