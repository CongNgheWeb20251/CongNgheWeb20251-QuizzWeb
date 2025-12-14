import React, { useState, useEffect, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Container from '@mui/material/Container'
import { socketIoInstance } from '~/socketClient'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LinearProgress from '@mui/material/LinearProgress'
import Checkbox from '@mui/material/Checkbox'
import PageLoader from '~/components/Loading/PageLoader'

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  List,
  Grid3x3
} from 'lucide-react'

import QuestionCard from '~/components/StudentQuiz/QuestionCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuizzDetailsAPI, selectCurrentActiveQuizz } from '~/redux/activeQuizz/activeQuizzSlice'
import { useParams } from 'react-router-dom'
import { fetchSessionQuizAPI, submitQuizSessionAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function StudentQuizPage() {
  const [viewMode, setViewMode] = useState('single')
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const quiz = useSelector(selectCurrentActiveQuizz)
  const dispatch = useDispatch()
  const { quizId, sessionId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const timerIntervalRef = useRef(null)


  const handleNavigateToQuestion = (index) => {
    setCurrentQuestion(index)
    if (viewMode === 'all') {
      // Scroll to the question in all questions view
      const questionElement = document.getElementById(`question-${index}`)
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
  useEffect(() => {
    setIsLoading(true)
    const socket = socketIoInstance

    // Chỉ fetch quiz nếu chưa có trong Redux store hoặc khác quizId
    const quizPromise = quiz && quiz._id === quizId
      ? Promise.resolve()
      : dispatch(fetchQuizzDetailsAPI(quizId))

    // Session luôn phải fetch lại
    const sessionPromise = fetchSessionQuizAPI(sessionId)

    Promise.all([quizPromise, sessionPromise]).then(([, sessionRes]) => {
      const initialAnswers = {}
      sessionRes.answers.forEach(answer => {
        initialAnswers[answer.questionId] = answer.selectedAnswerIds
      })
      setAnswers(initialAnswers)
      setIsLoading(false)

      // Sau khi có session làm bài thì broadcast lên server để tham gia phiên làm bài
      socket.emit('join-session', sessionId)
    }).catch(() => setIsLoading(false))

    // Server gửi thời gian ban đầu khi join session (event: 'timeLeft')
    socket.on('timeLeft', ({ timeLeft }) => {
      // Set thời gian ban đầu từ server
      setTimeRemaining(Math.max(0, Math.floor(timeLeft / 1000)))

      // Tạo timer client tự giảm dần mỗi giây
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timerIntervalRef.current)
            timerIntervalRef.current = null

            // Submit quiz trước khi navigate
            socket.emit('leave-session', sessionId)
            socket.off('timeLeft')
            socket.off('timeout')
            socket.off('session-error')
            socket.off('session-ended')

            submitQuizSessionAPI(sessionId)
              .then(() => {
                toast.info('Time is up! Your quiz has been submitted.')
                navigate('/dashboard')
              })
              .catch(() => {
                toast.error('Failed to submit quiz.')
                navigate('/dashboard')
              })

            return 0
          }
          return prev - 1
        })
      }, 1000)
    })

    // Lắng nghe sự kiện server báo timeout (backup nếu client không kịp submit)
    socket.on('timeout', () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      toast.info('Time is up! The quiz will be submitted automatically.')
      navigate('/dashboard')
    })

    // Lắng nghe sự kiện lỗi phiên làm bài từ server
    socket.on('session-error', ({ message }) => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      toast.error(message || 'An error occurred with the quiz session.')
      navigate('/dashboard')
    })

    // Lắng nghe sự kiện kết thúc phiên làm bài từ server
    socket.on('session-ended', ({ message }) => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      toast.info(message || 'The quiz session has ended.')
      navigate('/dashboard')
    })

    // Cleanup on unmount
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      socket.off('timeLeft')
      socket.off('timeout')
      socket.off('session-error')
      socket.off('session-ended')
      socket.emit('leave-session', sessionId)
    }
  }, [dispatch, quizId, sessionId, navigate, quiz])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }


  const getQuestionStatus = (questionIndex) => {
    const questionId = quiz.questions[questionIndex]._id
    if (answers[questionId]) return 'answered'
    return 'unanswered'
  }

  const submitQuiz = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    // Ngừng socket session
    socketIoInstance.emit('leave-session', sessionId)
    socketIoInstance.off('timeLeft')
    socketIoInstance.off('timeout')
    socketIoInstance.off('session-error')
    socketIoInstance.off('session-ended')

    submitQuizSessionAPI(sessionId).then(() => {
      toast.success('Quiz submitted successfully!')
      navigate('/dashboard')
    }).catch(() => {
      toast.error('Failed to submit quiz. Please try again.')
    })
  }, [sessionId, navigate])

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / quiz?.questions.length) * 100

  if (isLoading || !quiz) return <PageLoader fullScreen={true} />

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fafbfc',
        padding: { xs: '1rem', sm: '2rem' }
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            padding: { xs: '1rem', sm: '1.5rem' },
            borderRadius: '12px',
            backgroundColor: 'white',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                {quiz.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {quiz.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: '1rem', sm: '2rem' }, alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} color="#ef4444" />
                  <Typography
                    variant="h6"
                    sx={{
                      color: timeRemaining < 300 ? '#ef4444' : '#0f172a',
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    {formatTime(timeRemaining)}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: { xs: 'none', sm: 'block' } }}>
                  Time Remaining
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {answeredCount}/{quiz.questions.length}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: { xs: 'none', sm: 'block' } }}>
                  Answered
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ marginTop: '1rem' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: '8px',
                borderRadius: '4px',
                backgroundColor: '#e2e8f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#10b981',
                  borderRadius: '4px'
                }
              }}
            />
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: '2rem', flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Question Navigator Sidebar */}
          <Paper
            elevation={2}
            sx={{
              width: '280px',
              padding: '1.5rem',
              borderRadius: '12px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              height: 'fit-content',
              position: { xs: 'relative', lg: 'sticky' },
              top: '2rem'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
              Questions
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem'
              }}
            >
              {quiz.questions.map((question, index) => {
                const status = getQuestionStatus(index)
                const isActive = currentQuestion === index

                return (
                  <Button
                    key={question._id}
                    onClick={() => handleNavigateToQuestion(index)}
                    sx={{
                      minWidth: 'auto',
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: isActive
                        ? '#8b5cf6'
                        : status === 'answered'
                          ? '#10b981'
                          : '#e2e8f0',
                      backgroundColor: isActive
                        ? '#8b5cf6'
                        : status === 'answered'
                          ? '#10b981'
                          : 'white',
                      color: isActive || status === 'answered' ? 'white' : '#64748b',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: isActive
                          ? '#7c3aed'
                          : status === 'answered'
                            ? '#059669'
                            : '#f8fafc',
                        borderColor: isActive
                          ? '#7c3aed'
                          : status === 'answered'
                            ? '#059669'
                            : '#8b5cf6'
                      }
                    }}
                  >
                    {index + 1}
                  </Button>
                )
              })}
            </Box>

            <Box sx={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Box
                  sx={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    backgroundColor: '#10b981'
                  }}
                />
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Answered ({answeredCount})
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box
                  sx={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid #e2e8f0',
                    backgroundColor: 'white'
                  }}
                />
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Unanswered ({quiz.questions.length - answeredCount})
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Questions Area */}
          <Box sx={{ flex: 1 }}>
            {/* View Mode Toggle */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: { xs: '1rem', lg: 0 }
              }}
            >
              {/* <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {viewMode === 'single' ? `Question ${currentQuestion + 1}` : 'All Questions'}
              </Typography> */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => {
                  if (newMode !== null) {
                    setViewMode(newMode)
                    setCurrentQuestion(0)
                  }
                }}
                size="small"
                sx={{
                  backgroundColor: 'white',
                  '& .MuiToggleButton-root': {
                    border: '1px solid #e2e8f0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '0.25rem 0.5rem', sm: '0.5rem 1rem' },
                    '&.Mui-selected': {
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#7c3aed'
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="single">
                  <Circle size={16} style={{ marginRight: '0.5rem' }} />
                  <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>One at a time</span>
                  <span style={{ display: window.innerWidth >= 640 ? 'none' : 'inline' }}>Single</span>
                </ToggleButton>
                <ToggleButton value="all">
                  <List size={16} style={{ marginRight: '0.5rem' }} />
                  <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>All questions</span>
                  <span style={{ display: window.innerWidth >= 640 ? 'none' : 'inline' }}>All</span>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Questions Display */}
            {viewMode === 'single' ? (
              <>
                <QuestionCard question={quiz.questions[currentQuestion]} index={currentQuestion} viewMode={viewMode} answers={answers} setAnswers={setAnswers}/>

                {/* Navigation Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    gap: '1rem'
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ChevronLeft size={20} />}
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    sx={{
                      borderColor: '#cbd5e1',
                      color: '#64748b',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' },
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        backgroundColor: '#faf5ff'
                      },
                      '&.Mui-disabled': {
                        borderColor: '#e2e8f0',
                        color: '#cbd5e1'
                      }
                    }}
                  >
                    <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Previous</span>
                    <span style={{ display: window.innerWidth >= 640 ? 'none' : 'inline' }}>Prev</span>
                  </Button>

                  {currentQuestion === quiz.questions.length - 1 ? (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' },
                        '&:hover': {
                          backgroundColor: '#059669'
                        }
                      }}
                      onClick={submitQuiz}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRight size={20} />}
                      onClick={() =>
                        setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))
                      }
                      sx={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' },
                        '&:hover': {
                          backgroundColor: '#7c3aed'
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </>
            ) : (
              <>
                {quiz.questions.map((question, index) => (
                  <Box key={question._id} _id={`question-${index}`}>
                    <QuestionCard question={question} index={index} viewMode={viewMode} answers={answers} setAnswers={setAnswers}/>
                  </Box>
                ))}

                {/* Submit Button */}
                <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: { xs: '0.75rem 2rem', sm: '1rem 3rem' },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      '&:hover': {
                        backgroundColor: '#059669'
                      }
                    }}
                    onClick={submitQuiz}
                  >
                    Submit Quiz
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}