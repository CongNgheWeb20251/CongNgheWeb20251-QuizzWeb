import { useState } from 'react'
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

function Dashboard() {
  const navigate = useNavigate()
  const handleCreateQuiz = () => {
    navigate('/create-quiz/step1')
  }
  const [selectedMenu, setSelectedMenu] = useState('dashboard')

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId)
    if (menuId === 'quizzes') {
      navigate('/quizzes')
    } else if (menuId === 'dashboard') {
      navigate('/dashboard')
    }
  }

  const [selectedManage, setSelectedManage] = useState('dashboard')

  const handleManageClick = (manageId) => {
    setSelectedMenu(manageId)
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

  const stats = [
    {
      title: 'Total Quizzes',
      value: '2,543',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Students',
      value: '2,543',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Avg. Completion',
      value: '2,543',
      change: '-12.5%',
      isPositive: false
    }
  ]

  const topStudents = [
    { name: 'Alex John', subject: 'Science', score: 950 },
    { name: 'Emma Watson', subject: 'Mathematics', score: 920 },
    { name: 'Michael Clark', subject: 'Physics', score: 980 },
    { name: 'Sophia Green', subject: 'English', score: 890 },
    { name: 'Lucia Wilde', subject: 'Science', score: 870 }
  ]

  const recentQuizzes = [
    { title: 'Introduction to Biology', questions: 15, completions: 28, rate: 75 },
    { title: 'Introduction to Biology', questions: 15, completions: 28, rate: 40 },
    { title: 'Introduction to Biology', questions: 15, completions: 28, rate: 90 }
  ]

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
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              className="create-btn"
            >
              Create Quiz
            </Button>
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
              {topStudents.map((student, index) => (
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
              ))}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="widget recent-quizzes">
            <Typography variant="h6" className="widget-title">
              Recent Quizzes
            </Typography>
            <div className="quizzes-grid">
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
                <Typography variant="h6">Create New Quiz</Typography>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard