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

import QuestionCard from '~/components/StudentQuiz/QuestionCard'


export default function StudentQuizPage() {
  const [viewMode, setViewMode] = useState('single')
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(900) // 15 minutes

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

  // Sample quiz data
  const quizData = {
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics',
    totalQuestions: 10,
    timeLimit: 15,
    passingScore: 70
  }

  const rawQuestions = [
    {
      id: 1,
      text: 'What is the output of: typeof null?',
      type: 'single',
      options: [
        { id: 1, text: '"null"' },
        { id: 2, text: '"object"' },
        { id: 3, text: '"undefined"' },
        { id: 4, text: '"number"' }
      ],
      points: 10
    },
    {
      id: 2,
      text: 'Which methods can be used to manipulate arrays? (Select all that apply)',
      type: 'multiple',
      options: [
        { id: 1, text: 'push()' },
        { id: 2, text: 'pop()' },
        { id: 3, text: 'shift()' },
        { id: 4, text: 'unshift()' }
      ],
      points: 15
    },
    {
      id: 3,
      text: 'What does "DOM" stand for?',
      type: 'single',
      options: [
        { id: 1, text: 'Document Object Model' },
        { id: 2, text: 'Data Object Model' },
        { id: 3, text: 'Document Oriented Model' },
        { id: 4, text: 'Digital Object Management' }
      ],
      points: 10
    },
    {
      id: 4,
      text: 'Which are valid ways to declare variables in JavaScript? (Select all that apply)',
      type: 'multiple',
      options: [
        { id: 1, text: 'var' },
        { id: 2, text: 'let' },
        { id: 3, text: 'const' },
        { id: 4, text: 'variable' }
      ],
      points: 15
    },
    {
      id: 5,
      text: 'What is the correct syntax for a for loop?',
      type: 'single',
      options: [
        { id: 1, text: 'for (i = 0; i < 5)' },
        { id: 2, text: 'for (i = 0; i < 5; i++)' },
        { id: 3, text: 'for i = 0 to 5' },
        { id: 4, text: 'for (i <= 5; i++)' }
      ],
      points: 10
    },
    {
      id: 6,
      text: 'Which company developed JavaScript?',
      type: 'single',
      options: [
        { id: 1, text: 'Microsoft' },
        { id: 2, text: 'Netscape' },
        { id: 3, text: 'Oracle' },
        { id: 4, text: 'Google' }
      ],
      points: 10
    },
    {
      id: 7,
      text: 'What is the result of: 2 + "2"?',
      type: 'single',
      options: [
        { id: 1, text: '4' },
        { id: 2, text: '"22"' },
        { id: 3, text: 'NaN' },
        { id: 4, text: 'undefined' }
      ],
      points: 10
    },
    {
      id: 8,
      text: 'Which methods work with JSON? (Select all that apply)',
      type: 'multiple',
      options: [
        { id: 1, text: 'JSON.parse()' },
        { id: 2, text: 'JSON.stringify()' },
        { id: 3, text: 'JSON.convert()' },
        { id: 4, text: 'JSON.toObject()' }
      ],
      points: 15
    },
    {
      id: 9,
      text: 'What is a closure in JavaScript?',
      type: 'single',
      options: [
        { id: 1, text: 'A function with access to its outer scope' },
        { id: 2, text: 'A way to close the browser' },
        { id: 3, text: 'A method to end a loop' },
        { id: 4, text: 'A type of variable' }
      ],
      points: 10
    },
    {
      id: 10,
      text: 'Which operator is used for strict equality?',
      type: 'single',
      options: [
        { id: 1, text: '==' },
        { id: 2, text: '===' },
        { id: 3, text: '=' },
        { id: 4, text: '!=' }
      ],
      points: 10
    }
  ]

  const questions = rawQuestions.map((question, questionIndex) => {
    const tempId = question.tempId ?? question.id ?? questionIndex + 1
    const normalizedType = question.type === 'single'
      ? 'single-choice'
      : question.type === 'multiple'
        ? 'multiple-choice'
        : question.type

    return {
      ...question,
      tempId,
      content: question.content ?? question.text,
      type: normalizedType,
      options: (question.options || []).map((option, optionIndex) => {
        const optionTempId = option.tempId ?? (tempId * 10 + optionIndex + 1)
        return {
          ...option,
          tempId: optionTempId,
          content: option.content ?? option.text
        }
      })
    }
  })

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
    const questionId = questions[questionIndex].id
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
                {quizData.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {quizData.description}
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
                    key={question.id}
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
                <QuestionCard question={questions[currentQuestion]} index={currentQuestion} viewMode={viewMode} answers={answers} setAnswers={setAnswers}/>

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
                  <Box key={question.id} id={`question-${index}`}>
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