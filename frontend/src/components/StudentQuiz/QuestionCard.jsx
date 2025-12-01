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

const QuestionCard = ({ question, index, viewMode, answers, setAnswers }) => {

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  const handleMultipleAnswerChange = (questionId, optionId) => {
    const currentAnswer = answers[questionId]
    if (currentAnswer) {
      if (currentAnswer.includes(optionId)) {
        setAnswers({ ...answers, [questionId]: currentAnswer.filter((id) => id !== optionId) })
      } else {
        setAnswers({ ...answers, [questionId]: [...currentAnswer, optionId] })
      }
    } else {
      setAnswers({ ...answers, [questionId]: [optionId] })
    }
  }

  return (
    <Paper
      elevation={2}
      sx={{
        padding: { xs: '1.25rem', sm: '2rem' },
        borderRadius: '12px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        marginBottom: viewMode === 'all' ? '1.5rem' : 0
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Question {index + 1}
        </Typography>
        <Chip
          label={`${question?.points} pts`}
          sx={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            fontWeight: 500
          }}
        />
      </Box>

      <Typography variant="body1" sx={{ marginBottom: '1.5rem', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
        {question?.content}
      </Typography>

      {['single-choice', 'true-false'].includes(question?.type) ? (
        <RadioGroup
          value={answers[question.tempId]?.toString() || ''}
          onChange={(e) => handleAnswerChange(question.tempId, parseInt(e.target.value))}
        >
          {question?.options.map((option) => {
            const isSelected = answers[question.tempId] === option.tempId
            return (
              <Box
                key={option.tempId}
                sx={{
                  marginBottom: '0.75rem',
                  padding: { xs: '0.75rem', sm: '1rem' },
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: isSelected ? '#8b5cf6' : '#e2e8f0',
                  backgroundColor: isSelected ? '#f5f3ff' : 'white',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    backgroundColor: '#faf5ff'
                  }
                }}
                onClick={() => handleAnswerChange(question.tempId, option.tempId)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    value={option?.tempId.toString()}
                    control={
                      <Radio
                        checked={isSelected}
                        sx={{
                          color: '#cbd5e1',
                          '&.Mui-checked': {
                            color: '#8b5cf6'
                          }
                        }}
                      />
                    }
                    label={option.content}
                    sx={{ width: '100%', margin: 0, cursor: 'pointer' }}
                  />
                  {isSelected && (
                    <CheckCircle2
                      size={20}
                      color="#8b5cf6"
                      style={{ marginLeft: '0.5rem', flexShrink: 0 }}
                    />
                  )}
                </Box>
              </Box>
            )
          })}
        </RadioGroup>
      ) : (
        <Box>
          {question?.options.map((option) => {
            const isSelected = Boolean((answers[question.tempId])?.includes(option.tempId))
            return (
              <Box
                key={option.tempId}
                sx={{
                  marginBottom: '0.75rem',
                  padding: { xs: '0.75rem', sm: '1rem' },
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: isSelected ? '#8b5cf6' : '#e2e8f0',
                  backgroundColor: isSelected ? '#f5f3ff' : 'white',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    backgroundColor: '#faf5ff'
                  }
                }}
                onClick={() => handleMultipleAnswerChange(question.tempId, option.tempId)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    value={option.tempId.toString()}
                    control={
                      <Checkbox
                        checked={isSelected}
                        sx={{
                          color: '#cbd5e1',
                          '&.Mui-checked': {
                            color: '#8b5cf6'
                          }
                        }}
                      />
                    }
                    label={option.content}
                    sx={{ width: '100%', margin: 0, cursor: 'pointer', pointerEvents: 'none' }}
                  />
                  {isSelected && (
                    <CheckCircle2
                      size={20}
                      color="#8b5cf6"
                      style={{ marginLeft: '0.5rem', flexShrink: 0 }}
                    />
                  )}
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Paper>
  )
}

export default QuestionCard