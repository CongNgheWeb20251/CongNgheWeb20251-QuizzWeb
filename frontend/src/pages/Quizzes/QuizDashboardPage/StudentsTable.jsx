import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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

const students =[
  {
    id: 's2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    status: 'completed',
    score: 88,
    attempts: 1,
    lastAttempt: '2025-12-14T10:20:00',
    timeSpent: 25
  },
  {
    id: 's3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    status: 'in-progress',
    attempts: 1,
    lastAttempt: '2025-12-16T16:45:00',
    timeSpent: 15
  },
  {
    id: 's4',
    name: 'David Park',
    email: 'david.p@example.com',
    status: 'completed',
    score: 78,
    attempts: 2,
    lastAttempt: '2025-12-13T11:15:00',
    timeSpent: 30
  },
  {
    id: 's5',
    name: 'Jessica Williams',
    email: 'jessica.w@example.com',
    status: 'not-started',
    attempts: 0
  },
  {
    id: 's6',
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    status: 'completed',
    score: 95,
    attempts: 1,
    lastAttempt: '2025-12-15T09:30:00',
    timeSpent: 22
  },
  {
    id: 's7',
    name: 'Amanda Garcia',
    email: 'amanda.g@example.com',
    status: 'completed',
    score: 82,
    attempts: 3,
    lastAttempt: '2025-12-16T13:20:00',
    timeSpent: 27
  }
]


// eslint-disable-next-line no-unused-vars
const fetchStudentsTable = async (quizId) => {
  return students
}

function StudentsTable({ quizId }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const { data } = useQuery({
    queryKey: ['studentsTable', quizId],
    queryFn: () => fetchStudentsTable(quizId)
  })

  const filteredStudents = data.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'completed'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterStatus === 'in-progress'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus('not-started')}
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
      {filteredStudents.length === 0 ? (
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
              {filteredStudents.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


// Student Row Component
// interface StudentRowProps {
//   student: Student;
// }

function StudentRow({ student }) {
  const statusConfig = {
    completed: {
      color: 'bg-emerald-500/10 text-emerald-400',
      icon: CheckCircle2,
      label: 'Completed'
    },
    'in-progress': {
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-gray-100">{student.name}</p>
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
        {student.score !== undefined ? (
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
        {student.lastAttempt ? (
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