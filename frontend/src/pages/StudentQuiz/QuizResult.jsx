import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'

import {
  CheckCircle2,
  XCircle,
  Circle,
  RotateCcw,
  Home,
  Award
} from 'lucide-react'


export default function QuizResult() {
  // Sample quiz data
  const quizData = {
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics',
    totalQuestions: 10,
    timeLimit: 15,
    passingScore: 70
  }

  // User's answers
  const userAnswers = {
    1: 2, // Correct
    2: [1, 2, 3, 4], // Correct (all)
    3: 1, // Correct
    4: [1, 2, 3], // Correct
    5: 1, // Wrong (correct is 2)
    6: 2, // Correct
    7: 2, // Correct
    8: [1, 2], // Correct
    9: 1, // Correct
    10: 2 // Correct
  }

  const questions = [
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
      correctAnswer: 2,
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
      correctAnswer: [1, 2, 3, 4],
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
      correctAnswer: 1,
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
      correctAnswer: [1, 2, 3],
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
      correctAnswer: 2,
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
      correctAnswer: 2,
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
      correctAnswer: 2,
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
      correctAnswer: [1, 2],
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
      correctAnswer: 1,
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
      correctAnswer: 2,
      points: 10
    }
  ]

  // Calculate results
  const checkAnswer = (question) => {
    const userAnswer = userAnswers[question.id]
    const correctAnswer = question.correctAnswer

    if (question.type === 'single') {
      return userAnswer === correctAnswer
    } else {
      // Multiple choice
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false
      return (
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((ans) => correctAnswer.includes(ans))
      )
    }
  }

  const results = questions.map((question) => ({
    question,
    isCorrect: checkAnswer(question),
    userAnswer: userAnswers[question.id]
  }))

  const correctCount = results.filter((r) => r.isCorrect).length
  const totalPoints = results.reduce((sum, r) => sum + (r.isCorrect ? r.question.points : 0), 0)
  const maxPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const percentage = Math.round((totalPoints / maxPoints) * 100)
  const passed = percentage >= quizData.passingScore

  const isOptionCorrect = (question, optionId) => {
    if (question.type === 'single') {
      return question.correctAnswer === optionId
    } else {
      return question.correctAnswer.includes(optionId)
    }
  }

  const isOptionUserSelected = (questionId, optionId) => {
    const userAnswer = userAnswers[questionId]
    if (Array.isArray(userAnswer)) {
      return userAnswer.includes(optionId)
    }
    return userAnswer === optionId
  }

  const getOptionStatus = (question, optionId) => {
    const isCorrect = isOptionCorrect(question, optionId)
    const isSelected = isOptionUserSelected(question.id, optionId)

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
              {quizData.title}
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

        {/* Question Review */}
        <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '1.5rem' }}>
          Review Your Answers
        </Typography>

        {results.map((result, index) => (
          <Paper
            key={result.question.id}
            elevation={2}
            sx={{
              padding: { xs: '1.25rem', sm: '2rem' },
              borderRadius: '12px',
              backgroundColor: 'white',
              border: '2px solid',
              borderColor: result.isCorrect ? '#10b981' : '#ef4444',
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
                {result.isCorrect ? (
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
                  label={result.isCorrect ? 'Correct' : 'Incorrect'}
                  size="small"
                  sx={{
                    backgroundColor: result.isCorrect ? '#dcfce7' : '#fee2e2',
                    color: result.isCorrect ? '#166534' : '#991b1b',
                    fontWeight: 600
                  }}
                />
                <Chip
                  label={`${result.question.points} pts`}
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
              {result.question.text}
            </Typography>

            {/* Options */}
            <Box>
              {result.question.options.map((option) => {
                const status = getOptionStatus(result.question, option.id)

                return (
                  <Box
                    key={option.id}
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
                        {status === 'correct-selected' || status === 'correct-not-selected' ? (
                          <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
                        ) : status === 'wrong-selected' ? (
                          <XCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                        ) : (
                          <Circle size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
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
                          {option.text}
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
        ))}

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
          >
            Back to Home
          </Button>
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
        </Box>
      </Container>
    </Box>
  )
}
