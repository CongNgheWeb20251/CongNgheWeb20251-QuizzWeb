import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LinearProgress from '@mui/material/LinearProgress'
import Checkbox from '@mui/material/Checkbox'

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

import PreviewQuestionCard from './PreviewQuestionCard'


export default function PreviewQuiz() {
  const [viewMode, setViewMode] = useState('single')
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // Read previewQuiz from localStorage (kept original logic)
  const [quizData] = useState(() => {
    const raw = localStorage.getItem('previewQuiz')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse previewQuiz', e)
      return null
    }
  })

  // Initialize timeRemaining from quizData.timeLimit (minutes -> seconds). Fallback to 900s.
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const defaultSeconds = 900 // 15 minutes
    if (!quizData) return defaultSeconds
    const tl = quizData.timeLimit
    if (typeof tl === 'number' && Number.isFinite(tl)) {
      return Math.max(0, Math.floor(tl) * 60)
    }
    if (typeof tl === 'string' && tl.trim() !== '') {
      const num = Number(tl)
      if (!Number.isNaN(num) && Number.isFinite(num)) {
        return Math.max(0, Math.floor(num) * 60)
      }
    }
    return defaultSeconds
  })

  // console.log(quizData) // gồm cả quizData + questions

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


  const questions = quizData?.questions || [
  ]

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }


  const getQuestionStatus = (questionIndex) => {
    const questionId = questions[questionIndex].tempId
    if (answers[questionId]) return 'answered'
    return 'unanswered'
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100


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
                {quizData?.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {quizData?.description}
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
                  {answeredCount}/{questions.length}
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
              {questions.map((question, index) => {
                const status = getQuestionStatus(index)
                const isActive = currentQuestion === index

                return (
                  <Button
                    key={question.tempId}
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
                  Unanswered ({questions.length - answeredCount})
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
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {viewMode === 'single' ? `Question ${currentQuestion + 1}` : 'All Questions'}
              </Typography>
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
                <PreviewQuestionCard question={questions[currentQuestion]} index={currentQuestion} viewMode={viewMode} answers={answers} setAnswers={setAnswers}/>

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

                  {currentQuestion === questions.length - 1 ? (
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
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRight size={20} />}
                      onClick={() =>
                        setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
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
                {questions.map((question, index) => (
                  <Box key={question.tempId} id={`question-${index}`}>
                    <PreviewQuestionCard question={question} index={index} viewMode={viewMode} answers={answers} setAnswers={setAnswers}/>
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