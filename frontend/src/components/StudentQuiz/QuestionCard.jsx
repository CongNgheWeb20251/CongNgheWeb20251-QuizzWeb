import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

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
import { toast } from 'react-toastify'

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
import { useParams } from 'react-router-dom'
import { saveQuestionAnswerAPI } from '~/apis'

const QuestionCard = ({ question, index, viewMode, answers, setAnswers }) => {
  const [isSaving, setIsSaving] = useState(false)
  const { sessionId } = useParams()


  const handleAnswerChange = (questionId, optionId) => {
    // Normalize to string to align with RadioGroup value handling
    const normalized = optionId != null ? optionId.toString() : ''
    setAnswers({ ...answers, [questionId]: [normalized] })
  }

  const handleMultipleAnswerChange = (questionId, optionId) => {
    const currentAnswer = answers[questionId] || []
    if (currentAnswer.includes(optionId)) {
      setAnswers({ ...answers, [questionId]: currentAnswer.filter((id) => id !== optionId) })
    } else {
      setAnswers({ ...answers, [questionId]: [...currentAnswer, optionId] })
    }
  }

  const selectedAnswer = answers[question?._id] || []
  const hasAnswer = selectedAnswer.length > 0

  const handleSave = async () => {
    if (isSaving || !hasAnswer) return

    setIsSaving(true)
    try {
      await saveQuestionAnswerAPI(sessionId, {
        questionId: question._id,
        answerIds: selectedAnswer
      }).then(() => {
        toast.success('Answer saved successfully!', { autoClose: 1000 })
      })
      // console.log("selectedAnswer", {
      //   sessionId,
      //   questionId: question._id,
      //   answerIds: selectedAnswer
      // })
    } catch (error) {
      if (error) {
        toast.error('Failed to save answer. Please try again.', { autoClose: 2000 })
      }
    } finally {
      setIsSaving(false)
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

      <Box sx={{ marginBottom: '1.5rem' }}>
        <MDEditor.Markdown
          source={question?.content}
          style={{
            whiteSpace: 'pre-wrap',
            padding: question?.content ? '10px' : '0px',
            border: question?.content ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
            borderRadius: '8px'
          }}
        />
      </Box>

      {['single-choice', 'true-false'].includes(question?.type) ? (
        <RadioGroup
          value={answers[question._id]?.[0]?.toString() || ''}
          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
        >
          {question?.options.map((option) => {
            const isSelected = answers[question._id]?.includes(option._id)
            return (
              <Box
                key={option._id}
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
                onClick={() => handleAnswerChange(question._id, option._id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    value={option?._id.toString()}
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
            const isSelected = Boolean((answers[question._id])?.includes(option._id))
            return (
              <Box
                key={option._id}
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
                onClick={() => handleMultipleAnswerChange(question._id, option._id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    value={option._id.toString()}
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || !hasAnswer}
          sx={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '0.5rem 1.25rem', sm: '0.65rem 1.75rem' },
            '&:hover': {
              backgroundColor: '#7c3aed'
            },
            '&.Mui-disabled': {
              backgroundColor: '#cbd5e1',
              color: '#e2e8f0'
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Paper>
  )
}

export default QuestionCard