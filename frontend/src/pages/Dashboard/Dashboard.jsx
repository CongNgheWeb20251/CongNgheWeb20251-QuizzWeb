import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Search from '@mui/icons-material/Search'
import Add from '@mui/icons-material/Add'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Quiz from '@mui/icons-material/Quiz'
import People from '@mui/icons-material/People'
import Settings from '@mui/icons-material/Settings'

import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'

import './Dashboard.css'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { getDashboardStatsAPI, getTopStudentsAPI, getRecentQuizzesAPI } from '~/apis'

function Dashboard() {
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [selectedManage, setSelectedManage] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [recentQuizzes, setRecentQuizzes] = useState([])

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Fetch all data in parallel
        const [statsData, studentsData, quizzesData] = await Promise.all([
          getDashboardStatsAPI(),
          getTopStudentsAPI(5),
          getRecentQuizzesAPI(3)
        ])

        // Transform stats data for display
        const transformedStats = [
          {
            title: 'Total Quizzes',
            value: statsData.totalQuizzes.value,
            change: statsData.totalQuizzes.change,
            isPositive: statsData.totalQuizzes.isPositive
          },
          {
            title: 'Students',
            value: statsData.totalStudents.value,
            change: statsData.totalStudents.change,
            isPositive: statsData.totalStudents.isPositive
          },
          {
            title: 'Avg. Completion',
            value: `${statsData.avgCompletion.value}%`,
            change: statsData.avgCompletion.change,
            isPositive: statsData.avgCompletion.isPositive
          }
        ]

        setStats(transformedStats)
        setTopStudents(studentsData)
        setRecentQuizzes(quizzesData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set empty data on error
        setStats([
          { title: 'Total Quizzes', value: 0, change: '+0%', isPositive: true },
          { title: 'Students', value: 0, change: '+0%', isPositive: true },
          { title: 'Avg. Completion', value: '0%', change: '+0%', isPositive: true }
        ])
        setTopStudents([])
        setRecentQuizzes([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleCreateQuiz = () => {
    navigate('/teacher/create-quiz')
  }

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId)
    if (menuId === 'quizzes') {
      navigate('/teacher/quizzes')
    } else if (menuId === 'dashboard') {
      navigate('/teacher/dashboard')
    }
  }

  const handleManageClick = (manageId) => {
    setSelectedManage(manageId)
    if (manageId === 'settings') {
      navigate('/settings')
    }
  }

  const menuItems = [
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'quizzes', icon: <Quiz />, label: 'Quizzes' },
    { id: 'students', icon: <People />, label: 'Students' }
  ]

  const manageItems = [
    { id: 'settings', icon: <Settings />, label: 'Settings' }
  ]

  // Show loading spinner while fetching data
  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-qui">Qui</span>
            <span className="logo-zzy">zzy</span>
          </div>
          <div className="search-box">
            <TextField
              fullWidth
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${selectedMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Manage</div>
            {manageItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${selectedManage === item.id ? 'active' : ''}`}
                onClick={() => handleManageClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserAvatar />
          </div>
        </div>

        {/* Header */}
        <div className="content-header">
          <div>
            <Typography variant="h4" className="page-title">
              Dashboard
            </Typography>
            <Typography variant="subtitle1" className="welcome-text">
              Welcome back, Sarah! Here's what's happening with your quizzes
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            className="create-btn primary"
            onClick={handleCreateQuiz}
          >
            Create New Quiz
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <Typography variant="subtitle2" className="stat-title">
                {stat.title}
              </Typography>
              <Typography variant="h4" className="stat-value">
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}
              >
                {stat.change}
              </Typography>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Top Students */}
          <div className="widget top-students">
            <Typography variant="h6" className="widget-title">
              Top Students
            </Typography>
            <div className="students-list">
              {topStudents.length > 0 ? (
                topStudents.map((student, index) => (
                  <div key={index} className="student-item">
                    <div className="student-info">
                      <Typography variant="subtitle1">{student.name}</Typography>
                      <Typography variant="body2" className="subject">
                        {student.subject}
                      </Typography>
                    </div>
                    <Typography variant="h6" className="score">
                      {student.score}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No student data available yet
                </Typography>
              )}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="widget recent-quizzes">
            <Typography variant="h6" className="widget-title">
              Recent Quizzes
            </Typography>
            <div className="quizzes-grid">
              {recentQuizzes.length > 0 ? (
                <>
                  {recentQuizzes.map((quiz, index) => (
                    <div key={index} className="quiz-card">
                      <Typography variant="h6" className="quiz-title">
                        {quiz.title}
                      </Typography>
                      <div className="quiz-stats">
                        <Typography variant="body2">
                          {quiz.questions} questions
                        </Typography>
                        <Typography variant="body2">
                          {quiz.completions} completions
                        </Typography>
                      </div>
                      <div className="completion-rate">
                        <div className="rate-header">
                          <Typography variant="body2">Completion Rate</Typography>
                          <Typography variant="body2">{quiz.rate}%</Typography>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={quiz.rate}
                          className="progress-bar"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="quiz-card new-quiz">
                    <IconButton className="add-icon">
                      <Add />
                    </IconButton>
                    <Typography variant="h6" onClick={handleCreateQuiz}>Create New Quiz</Typography>
                  </div>
                </>
              ) : (
                <div className="quiz-card new-quiz">
                  <IconButton className="add-icon">
                    <Add />
                  </IconButton>
                  <Typography variant="h6" onClick={handleCreateQuiz}>Create Your First Quiz</Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard