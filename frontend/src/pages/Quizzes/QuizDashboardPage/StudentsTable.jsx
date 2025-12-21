import { useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import {
  Users,
  Target,
  Filter,
  Search,
  Trash,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { getStudentsQuizAttemptsAPI } from '~/apis'


// fetch student theo quizId với các tham số page, statusFilter, search, limit
const fetchStudentsTable = async (quizId, { page, statusFilter, search, limit }) => {
  const normalizedStatus =
    statusFilter === 'in-progress' ? 'doing' : statusFilter
  // xây dựng URL với các tham số
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (normalizedStatus && normalizedStatus !== 'all') params.set('statusFilter', normalizedStatus)
  if (search && search.trim() !== '') params.set('search', search.trim())
  const data = await getStudentsQuizAttemptsAPI({ quizId, searchPath: `?${params.toString()}` })
  return data
}

function StudentsTable({ quizId }) {
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  const page = parseInt(query.get('page') || DEFAULT_PAGE, 10)
  const locationSearch = query.get('search') || ''
  const initialFilter = query.get('filter') || 'all'

  const [searchQuery, setSearchQuery] = useState(locationSearch)
  const [filterStatus, setFilterStatus] = useState(initialFilter)
  // dùng để build URL với các tham số page, filter, search, useCallback để tránh việc hàm bị tạo lại không cần thiết
  const buildUrl = useCallback((pageParam, filterParam, searchParam) => {
    const params = new URLSearchParams()
    if (pageParam && Number(pageParam) !== DEFAULT_PAGE) params.set('page', String(pageParam))
    if (filterParam && filterParam !== 'all') params.set('filter', filterParam)
    if (searchParam && searchParam.trim() !== '') params.set('search', searchParam.trim())
    const qs = params.toString()
    return `${location.pathname}${qs ? `?${qs}` : ''}`
  }, [location.pathname])

  // đồng bộ hóa trạng thái search và filter với URL khi URL thay đổi
  useEffect(() => {
    setSearchQuery(locationSearch)
    setFilterStatus(initialFilter)
  }, [locationSearch, initialFilter])

  // khi searchQuery thay đổi, đợi 1000ms sau mới cập nhật URL để tránh gọi API quá nhiều lần khi người dùng gõ
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== locationSearch) {
        navigate(buildUrl(1, filterStatus, searchQuery), { replace: true })
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, filterStatus, locationSearch, navigate, buildUrl])


  const { data } = useQuery({
    queryKey: ['quiz', quizId, 'students', { page, limit: DEFAULT_ITEMS_PER_PAGE, statusFilter: filterStatus, search: locationSearch }],
    queryFn: () => fetchStudentsTable(quizId, { page, limit: DEFAULT_ITEMS_PER_PAGE, statusFilter: filterStatus, search: locationSearch })
  })

  const studentsPage = data?.students || []
  const totalStudents = data?.totalStudents || 0

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-gray-100">Students</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-xl">
          <button
            onClick={() => {
              setFilterStatus('all')
              navigate(buildUrl(1, 'all', searchQuery))
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilterStatus('completed')
              navigate(buildUrl(1, 'completed', searchQuery))
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'completed'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => {
              setFilterStatus('in-progress')
              navigate(buildUrl(1, 'in-progress', searchQuery))
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'in-progress'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => {
              setFilterStatus('not-started')
              navigate(buildUrl(1, 'not-started', searchQuery))
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'not-started'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            Not Started
          </button>
        </div>
      </div>

      {/* Students Table */}
      {studentsPage.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">No students found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-400">Student</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400">Score</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400">Attempts</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400">Last Attempt</th>
                <th className="px-6 py-4 text-right text-sm text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {studentsPage.map((student) => (
                <StudentRow key={student._id} student={student} />
              ))}
            </tbody>
          </table>
          {totalStudents > 0 && (
            <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Pagination
                size="large"
                showFirstButton
                showLastButton
                count={Math.ceil(totalStudents / DEFAULT_ITEMS_PER_PAGE)}
                page={page}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'rgba(255,255,255,0.9)',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    width: 44,
                    height: 44,
                    minWidth: 'auto',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 150ms, box-shadow 150ms, transform 120ms',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      transform: 'translateY(-2px)'
                    }
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: 'rgba(25,118,210,0.95) !important',
                    color: '#fff !important',
                    boxShadow: '0 8px 24px rgba(2,6,23,0.65)',
                    transform: 'scale(1.05)'
                  },
                  '& .MuiPaginationItem-ellipsis': {
                    color: 'rgba(255,255,255,0.6)',
                    border: 'none',
                    backgroundColor: 'transparent'
                  },
                  '& .MuiPaginationItem-text': {
                    color: 'rgba(255,255,255,0.9)'
                  }
                }}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={buildUrl(item.page, filterStatus, searchQuery)}
                    {...item}
                    sx={{ width: 44, height: 44, minWidth: 'auto' }}
                  />
                )}
              />
            </Box>
          )}
        </div>
      )}
    </div>
  )
}

function StudentRow({ student }) {
  const statusConfig = {
    completed: {
      color: 'bg-emerald-500/10 text-emerald-400',
      icon: CheckCircle2,
      label: 'Completed'
    },
    doing: {
      color: 'bg-blue-500/10 text-blue-400',
      icon: AlertCircle,
      label: 'In Progress'
    },
    'not-started': {
      color: 'bg-gray-600 text-gray-300',
      icon: XCircle,
      label: 'Not Started'
    }
  }

  const config = statusConfig[student.status]
  const StatusIcon = config.icon

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <tr className="hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-lg font-semibold">
                {student.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-gray-100">{student.fullName}</p>
            <p className="text-sm text-gray-400">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm ${config.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {student.score != undefined ? (
          <span className={`${
            student.score >= 90 ? 'text-emerald-400' :
              student.score >= 70 ? 'text-blue-400' :
                'text-amber-400'
          }`}>
            {student.score}%
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-100">{student.attempts}</span>
      </td>
      <td className="px-6 py-4">
        {student.lastAttempt || student.lastAttempt === 0 ? (
          <span className="text-gray-400 text-sm">{formatDate(student.lastAttempt)}</span>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="View details"
          >
            <Trash className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </td>
    </tr>
  )
}


export default StudentsTable