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
import { useDispatch, useSelector } from 'react-redux'
import { fetchQuizzDetailsAPI, selectCurrentActiveQuizz } from '~/redux/activeQuizz/activeQuizzSlice'
import { useParams } from 'react-router-dom'


export default function StudentQuizPage() {
  const [viewMode, setViewMode] = useState('single')
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(900) // 15 minutes
  const quiz = useSelector(selectCurrentActiveQuizz)
  const dispatch = useDispatch()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)

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
    dispatch(fetchQuizzDetailsAPI(id)).finally(() => setIsLoading(false))

  }, [dispatch, id])

  // Sample quiz data
  // const quizData = {
  //   title: 'JavaScript Fundamentals Quiz',
  //   description: 'Test your knowledge of JavaScript basics',
  //   totalQuestions: 10,
  //   timeLimit: 15,
  //   passingScore: 70
  // }

  // const questions = [
  //   {
  //     _id: 'q_8f21a9b2',
  //     content: 'What is the output of: typeof null?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_c1a91f11', content: '"null"' },
  //       { _id: 'o_94bc2a3f', content: '"object"' },
  //       { _id: 'o_233fbb62', content: '"undefined"' },
  //       { _id: 'o_d120ef7a', content: '"number"' }
  //     ],
  //     points: 10
  //   },
  //   {
  //     _id: 'q_a92b1e73',
  //     content: 'Which methods can be used to manipulate arrays? (Select all that apply)',
  //     type: 'multiple',
  //     options: [
  //       { _id: 'o_51ab9e62', content: 'push()' },
  //       { _id: 'o_b83cd271', content: 'pop()' },
  //       { _id: 'o_149dbfee', content: 'shift()' },
  //       { _id: 'o_92cc741a', content: 'unshift()' }
  //     ],
  //     points: 15
  //   },
  //   {
  //     _id: 'q_5b21e9c0',
  //     content: 'What does "DOM" stand for?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_34fda892', content: 'Document Object Model' },
  //       { _id: 'o_56cb917c', content: 'Data Object Model' },
  //       { _id: 'o_70bcf51a', content: 'Document Oriented Model' },
  //       { _id: 'o_e1cf28b4', content: 'Digital Object Management' }
  //     ],
  //     points: 10
  //   },
  //   {
  //     _id: 'q_7e3d0c15',
  //     content: 'Which are valid ways to declare variables in JavaScript? (Select all that apply)',
  //     type: 'multiple',
  //     options: [
  //       { _id: 'o_8ff1a634', content: 'var' },
  //       { _id: 'o_41ab55e7', content: 'let' },
  //       { _id: 'o_d0e3a17c', content: 'const' },
  //       { _id: 'o_1cf97d20', content: 'variable' }
  //     ],
  //     points: 15
  //   },
  //   {
  //     _id: 'q_8a4d991f',
  //     content: 'What is the correct syntax for a for loop?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_72fe1d34', content: 'for (i = 0; i < 5)' },
  //       { _id: 'o_5acb23d1', content: 'for (i = 0; i < 5; i++)' },
  //       { _id: 'o_bcd8f612', content: 'for i = 0 to 5' },
  //       { _id: 'o_4d2739aa', content: 'for (i <= 5; i++)' }
  //     ],
  //     points: 10
  //   },
  //   {
  //     _id: 'q_f51a72bb',
  //     content: 'Which company developed JavaScript?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_3fbac711', content: 'Microsoft' },
  //       { _id: 'o_b238dd89', content: 'Netscape' },
  //       { _id: 'o_914c2fa1', content: 'Oracle' },
  //       { _id: 'o_c92bd7aa', content: 'Google' }
  //     ],
  //     points: 10
  //   },
  //   {
  //     _id: 'q_9de21b56',
  //     content: 'What is the result of: 2 + "2"?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_80ff1ab2', content: '4' },
  //       { _id: 'o_14bd9c71', content: '"22"' },
  //       { _id: 'o_6adf0e13', content: 'NaN' },
  //       { _id: 'o_2dcb71af', content: 'undefined' }
  //     ],
  //     points: 10
  //   },
  //   {
  //     _id: 'q_c0e781d2',
  //     content: 'Which methods work with JSON? (Select all that apply)',
  //     type: 'multiple',
  //     options: [
  //       { _id: 'o_1a2bfa01', content: 'JSON.parse()' },
  //       { _id: 'o_b39ced1e', content: 'JSON.stringify()' },
  //       { _id: 'o_e24afc81', content: 'JSON.convert()' },
  //       { _id: 'o_77bc2a9f', content: 'JSON.toObject()' }
  //     ],
  //     points: 15
  //   },
  //   {
  //     _id: 'q_4ce1bd88',
  //     content: 'What is a closure in JavaScript?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_1aef92d7', content: 'A function with access to its outer scope' },
  //       { _id: 'o_39fbab22', content: 'A way to close the browser' },
  //       { _id: 'o_77da4cd1', content: 'A method to end a loop' },
  //       { _id: 'o_0df12be4', content: 'A type of variable' }
  //     ],
  //     points: 10
  //   },
  //   {
  //     _id: 'q_b812d4e1',
  //     content: 'Which operator is used for strict equality?',
  //     type: 'single-choice',
  //     options: [
  //       { _id: 'o_2af0bc52', content: '==' },
  //       { _id: 'o_b11cf371', content: '===' },
  //       { _id: 'o_51cb7aea', content: '=' },
  //       { _id: 'o_93dd2472', content: '!=' }
  //     ],
  //     points: 10
  //   }
  // ]


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
    const questionId = quiz.questions[questionIndex]._id
    if (answers[questionId]) return 'answered'
    return 'unanswered'
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / quiz?.questions.length) * 100

  if (isLoading) return <div>Loading...</div>

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
                gap: '1rem'
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