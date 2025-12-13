import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HomeIcon from '@mui/icons-material/Home'
import QuizIcon from '@mui/icons-material/Quiz'
import { API_ROOT } from '~/utils/constants'
import PageLoader from '~/components/Loading/PageLoader'
import { joinQuizByInviteAPI } from '~/apis'

function JoinQuiz() {
  const { inviteToken } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)

  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Nếu chưa login, redirect về login và lưu current path để quay lại sau
    if (!currentUser) {
      navigate('/signin', { state: { from: location.pathname } })
      return
    }

    // Nếu đã login, gọi API để join quiz
    const joinQuiz = async () => {
      try {
        setStatus('loading')
        const response = await joinQuizByInviteAPI(inviteToken)

        setStatus('success')
        setMessage(response.message)
        navigate(`/quizzes/${response.quizId}/attempts`)
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Failed to join quiz. Please try again.')
      }
    }

    joinQuiz()
  }, [inviteToken, currentUser, navigate, location])

  const handleGoHome = () => {
    navigate('/')
  }

  if (status === 'loading') return <PageLoader message='Joining quiz...' fullScreen />


  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {status === 'error' && (
          <Box>
            <ErrorOutlineIcon
              sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom color="error.main">
              Oops!
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Unable to Join Quiz
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {message}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                size="large"
              >
                Go Home
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default JoinQuiz
