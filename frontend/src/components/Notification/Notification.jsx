import { useState, useEffect } from 'react'
import { Bell, Activity } from 'lucide-react'
import { getNotificationsByTeacherAPI } from '~/apis'
import { ActivityItem } from '~/pages/Dashboard/Components/RecentActivity'
import { socketIoInstance } from '~/socketClient'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useQuery } from '@tanstack/react-query'
import { queryClient } from '~/customLib/queryClient'

const getRecentActivities = async () => {
  return await getNotificationsByTeacherAPI()
}

function Notification() {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const currentUser = useSelector(selectCurrentUser)

  const { data: activities, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getRecentActivities()
  })

  useEffect(() => {
    if (!currentUser?._id) return
    // emit để join room riêng cho teacher
    socketIoInstance.emit('join-teacher', currentUser._id)

    const handler = (activity) => {
      // Cập nhật cache của react-query để thêm notification mới vào danh sách
      queryClient.setQueryData(['notifications'], (old) => {
        const prev = Array.isArray(old) ? old : []
        const next = [activity, ...prev]
        return next.slice(0, 5)
      })
    }
    // Lắng nghe sự kiện notification mới từ server
    socketIoInstance.on('notification:new', handler)
    return () => {
      // Hủy lắng nghe sự kiện khi component unmount
      socketIoInstance.off('notification:new', handler)
    }
  }, [currentUser?._id])


  return (
    <>
      <div className="relative">
        <button
          onClick={() => setNotificationOpen(!notificationOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Notification Dropdown Panel */}
        {notificationOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setNotificationOpen(false)}
            />
            {/* Dropdown Content */}
            <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-100">Notifications</h3>
                  <span className="text-xs text-gray-400">{activities.length} new</span>
                </div>
              </div>
              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {activities.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="p-3 border-t border-gray-700">
                <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Notification