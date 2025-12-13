import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import PageLoader from '~/components/Loading/PageLoader'
import { getQuizResultsAPI } from '~/apis'
import { useParams, useNavigate } from 'react-router-dom'

import {
  CheckCircle2,
  XCircle,
  Circle,
  CheckSquare2,
  XSquare,
  Square,
  RotateCcw,
  Home,
  Award
} from 'lucide-react'


export default function QuizResult() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  // Get sessionId from URL params
  const { sessionId } = useParams()

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getQuizResultsAPI(sessionId)
        setSession(data)
      } catch {
        // Handle error silently or show toast notification
      } finally {
        setLoading(false)
      }
    }

    fetchQuizResults()
  }, [sessionId])

  if (loading) {
    return <PageLoader fullScreen />
  }

  if (!session) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f9ff'
        }}
      >
        <Typography variant="h5" color="error">
          Failed to load quiz results
        </Typography>
      </Box>
    )
  }

  // Calculate results based on session data
  const checkAnswer = (question) => {
    const userAnswer = question.userSelectedAnswerIds || []
    const correctAnswer = question.correctAnswerIds || []

    if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false

    return (
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((ans) => correctAnswer.includes(ans)) &&
      correctAnswer.every((ans) => userAnswer.includes(ans))
    )
  }

  // Calculate statistics from session data
  const questions = session.questions || []
  const correctCount = questions.filter(checkAnswer).length
  const totalPoints = session.score || 0
  const maxPoints = session.totalPoints || 0
  const percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0
  const passed = percentage >= (session.quizInfo?.passingScore || 0)

  const isOptionCorrect = (question, optionId) => {
    return question.correctAnswerIds?.includes(optionId) || false
  }

  const isOptionUserSelected = (question, optionId) => {
    return question.userSelectedAnswerIds?.includes(optionId) || false
  }

  const getOptionStatus = (question, optionId) => {
    const isCorrect = isOptionCorrect(question, optionId)
    const isSelected = isOptionUserSelected(question, optionId)

    if (isCorrect && isSelected) return 'correct-selected'
    if (isCorrect && !isSelected) return 'correct-not-selected'
    if (!isCorrect && isSelected) return 'wrong-selected'
    return 'neutral'
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f9ff',
        padding: { xs: '1rem', sm: '2rem' }
      }}
    >
      <Container maxWidth="lg">
        {/* Result Header */}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: '2rem 1.5rem', sm: '3rem' },
            borderRadius: '16px',
            backgroundColor: 'white',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}
        >
          <Box sx={{ marginBottom: '1.5rem' }}>
            <Award
              size={64}
              color={passed ? '#10b981' : '#ef4444'}
              style={{ marginBottom: '1rem' }}
            />
            <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              {passed ? 'Congratulations! 🎉' : 'Quiz Completed'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {session.quizInfo?.title || 'Quiz'}
            </Typography>
          </Box>

          {/* Score Display */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: '1rem', sm: '3rem' },
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: passed ? '#10b981' : '#ef4444',
                  fontSize: { xs: '2.5rem', sm: '3.5rem' }
                }}
              >
                {percentage}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Your Score
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
                {correctCount}/{questions.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Correct Answers
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
                {totalPoints}/{maxPoints}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Total Points
              </Typography>
            </Box>
          </Box>

          {/* Status Badge */}
          <Chip
            label={passed ? 'PASSED' : 'NOT PASSED'}
            sx={{
              backgroundColor: passed ? '#dcfce7' : '#fee2e2',
              color: passed ? '#166534' : '#991b1b',
              fontWeight: 600,
              padding: '1.5rem 1rem',
              fontSize: '1rem'
            }}
          />
        </Paper>
        {1===1 && (
          <>
            {/* Question Review */}
            <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '1.5rem', color: '#374151' }}>
              Review Your Answers
            </Typography>

            { questions.map((question, index) => {
              const isCorrect = checkAnswer(question)

              return (
                <Paper
                  key={question._id}
                  elevation={2}
                  sx={{
                    padding: { xs: '1.25rem', sm: '2rem' },
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    border: '2px solid',
                    borderColor: isCorrect ? '#10b981' : '#ef4444',
                    marginBottom: '1.5rem'
                  }}
                >
                  {/* Question Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isCorrect ? (
                        <CheckCircle2 size={24} color="#10b981" />
                      ) : (
                        <XCircle size={24} color="#ef4444" />
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Question {index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Chip
                        label={isCorrect ? 'Correct' : 'Incorrect'}
                        size="small"
                        sx={{
                          backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                          color: isCorrect ? '#166534' : '#991b1b',
                          fontWeight: 600
                        }}
                      />
                      <Chip
                        label={`${question.points} pts`}
                        size="small"
                        sx={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: '1.5rem',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 500
                    }}
                  >
                    {question.content}
                  </Typography>

                  {/* Options */}
                  <Box>
                    {question.options.map((option) => {
                      const status = getOptionStatus(question, option._id)

                      return (
                        <Box
                          key={option._id}
                          sx={{
                            marginBottom: '0.75rem',
                            padding: { xs: '0.75rem', sm: '1rem' },
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor:
                              status === 'correct-selected' || status === 'correct-not-selected'
                                ? '#10b981'
                                : status === 'wrong-selected'
                                  ? '#ef4444'
                                  : '#e2e8f0',
                            backgroundColor:
                              status === 'correct-selected'
                                ? '#dcfce7'
                                : status === 'correct-not-selected'
                                  ? '#f0fdf4'
                                  : status === 'wrong-selected'
                                    ? '#fee2e2'
                                    : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                              {question.type === 'multiple-choice' ? (
                                status === 'correct-selected' || status === 'correct-not-selected' ? (
                                  <CheckSquare2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
                                ) : status === 'wrong-selected' ? (
                                  <XSquare size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                                ) : (
                                  <Square size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
                                )
                              ) : (
                                status === 'correct-selected' || status === 'correct-not-selected' ? (
                                  <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
                                ) : status === 'wrong-selected' ? (
                                  <XCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                                ) : (
                                  <Circle size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
                                )
                              )}
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight:
                                    status === 'correct-selected' ||
                                    status === 'correct-not-selected' ||
                                    status === 'wrong-selected'
                                      ? 600
                                      : 400
                                }}
                              >
                                {option.content}
                              </Typography>
                            </Box>
                            {status === 'correct-not-selected' && (
                              <Chip
                                label="Correct Answer"
                                size="small"
                                sx={{
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                }}
                              />
                            )}
                            {status === 'wrong-selected' && (
                              <Chip
                                label="Your Answer"
                                size="small"
                                sx={{
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                }}
                              />
                            )}
                            {status === 'correct-selected' && (
                              <Chip
                                label="Your Answer ✓"
                                size="small"
                                sx={{
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </Paper>
              )
            })}
          </>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Home size={20} />}
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                borderColor: '#8b5cf6',
                backgroundColor: '#faf5ff'
              }
            }}
            onClick={() => navigate('/dashboard')}

          >
            Back to Home
          </Button>
          {session.quizInfo?.allowRetake &&
            <Button
              variant="contained"
              startIcon={<RotateCcw size={20} />}
              sx={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: { xs: '0.5rem 1rem', sm: '0.75rem 1.5rem' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  backgroundColor: '#7c3aed'
                }
              }}
            >
              Retake Quiz
            </Button>
          }
        </Box>
      </Container>
    </Box>
  )
}
