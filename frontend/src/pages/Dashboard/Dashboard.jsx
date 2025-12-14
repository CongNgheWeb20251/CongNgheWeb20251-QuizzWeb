import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Add from '@mui/icons-material/Add'

import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'

import './Dashboard.css'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { getDashboardStatsAPI, getTopStudentsAPI, getRecentQuizzesAPI } from '~/apis'

function Dashboard() {
  const navigate = useNavigate()
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

  // Show loading spinner while fetching data
  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <>
      {/* Header */}
      <div className="content-header">
        <div>
          <Typography variant="h4" className="page-title">
            Dashboard
          </Typography>
          <Typography variant="subtitle1" className="welcome-text">
            Welcome back! Here's what's happening with your quizzes
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
    </>
  )
}

export default Dashboard