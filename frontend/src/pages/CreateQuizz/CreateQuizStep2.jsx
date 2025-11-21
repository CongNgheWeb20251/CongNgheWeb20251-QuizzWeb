/* eslint-disable no-console */
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './CreateQuizStep2.css'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'

import AddIcon from '@mui/icons-material/Add'

function CreateQuizStep2() {
  const navigate = useNavigate()
  const location = useLocation()
  const quizDataFromStep1 = location.state?.quizData || {}

  const [questions, setQuestions] = useState([
    // {
    //   id: 1,
    //   text: 'Which of the following is NOT a renewable energy source?',
    //   points: 10,
    //   type: 'single-choice',
    //   options: [
    //     { id: 1, text: 'Solar Power', isCorrect: false },
    //     { id: 2, text: 'Wind Power', isCorrect: false },
    //     { id: 3, text: 'Natural Gas', isCorrect: true },
    //     { id: 4, text: 'Hydroelectric Power', isCorrect: false }
    //   ]
    // }
  ])

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        // When changing question type, update options accordingly
        if (field === 'type') {
          if (value === 'true-false') {
            return {
              ...q,
              type: value,
              options: [
                { id: 1, text: 'True', isCorrect: false },
                { id: 2, text: 'False', isCorrect: false }
              ]
            }
          } else if (value === 'single-choice' || value === 'multiple-choice') {
            return {
              ...q,
              type: value,
              options: [
                { id: 1, text: '', isCorrect: false },
                { id: 2, text: '', isCorrect: false }
              ]
            }
          }
        }
        return { ...q, [field]: value }
      }
      return q
    }))
  }

  const handleOptionChange = (questionId, optionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId ? { ...opt, [field]: value } : opt
          )
        }
      }
      return q
    }))
  }

  const handleCorrectAnswerChange = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        // For multiple-choice, allow multiple correct answers (checkbox behavior)
        if (q.type === 'multiple-choice') {
          return {
            ...q,
            options: q.options.map(opt =>
              opt.id === optionId
                ? { ...opt, isCorrect: !opt.isCorrect }
                : opt
            )
          }
        } else {
          // For single-choice and true-false, only one correct answer (radio behavior)
          return {
            ...q,
            options: q.options.map(opt => ({
              ...opt,
              isCorrect: opt.id === optionId
            }))
          }
        }
      }
      return q
    }))
  }

  const handleAddOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const maxId = q.options && q.options.length ? Math.max(...q.options.map(o => Number(o.id))) : 0
        const newOption = {
          id: maxId + 1,
          text: '',
          isCorrect: false
        }
        return { ...q, options: [...q.options, newOption] }
      }
      return q
    }))
  }

  const handleRemoveOption = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId)
        }
      }
      return q
    }))
  }

  const handleAddQuestion = () => {
    const maxId = questions && questions.length ? Math.max(...questions.map(q => Number(q.id))) : 0
    const newQuestion = {
      id: maxId + 1,
      text: '',
      points: 10,
      type: 'single-choice',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    }
    setQuestions(prev => [...prev, newQuestion])
  }

  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId))
    }
  }

  const handleBack = () => {
    navigate('/dashboard', { state: { quizData: quizDataFromStep1 } })
  }

  const handleSaveDraft = () => {
    console.log('Save draft - Step 2:', { ...quizDataFromStep1, questions })
    // TODO: Call API
  }

  const handlePreview = () => {
    console.log('Preview quiz:', { ...quizDataFromStep1, questions })
    // TODO: Show preview modal
  }

  const handlePublish = () => {
    console.log('Publish quiz:', { ...quizDataFromStep1, questions })
    // TODO: Validate, call API, navigate to success page
    alert('Quiz published successfully! (TODO: implement API)')
    // navigate('/dashboard')
  }

  return (
    <div className="create-quiz-container">
      {/* Header */}
      <header className="cq-header">
        <div className="cq-header-left">
          <button type="button" className="cq-btn-back" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="cq-title">Edit Quiz - 2</h1>
            <p className="cq-subtitle">Add questions, set answers and configure quiz settings.</p>
          </div>
        </div>
        <div className="cq-header-right">
          <Button
            variant="outlined"
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc'
              }
            }}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <button type="button" className="cq-btn-1 cq-btn-primary" onClick={handlePreview}>
            Preview
          </button>
        </div>
      </header>

      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            padding: '2rem',
            borderRadius: '16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Quiz Header */}
          <Box
            sx={{
              padding: '1.5rem',
              backgroundColor: '#8b5cf6',
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, marginBottom: '0.5rem' }}>
              {'Create New Quiz'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {'Add a description for your quiz'}
            </Typography>
          </Box>

          {/* Quiz Questions Section */}
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              Quiz Questions
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: '1.5rem' }}>
              Create and add new questions.
            </Typography>

            {questions.length === 0 ? (
              /* Empty State */
              <Box
                sx={{
                  padding: '3rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '2px dashed #cbd5e1'
                }}
              >
                <Typography variant="h6" sx={{ color: '#64748b', marginBottom: '1rem' }}>
                  No Questions Yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Start by adding your first question to the quiz.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon size={20} />}
                  onClick={handleAddQuestion}
                  sx={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#7c3aed'
                    }
                  }}
                >
                  Add Question
                </Button>
              </Box>
            ) : (
              /* Questions List */
              <div className="cq-questions-list">
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="cq-question-card">
                    <div className="cq-question-header">
                      <h4 className="cq-question-number">Question {qIndex + 1}</h4>
                      <div className="cq-question-controls">
                        <div className="cq-question-meta">
                          <label className="cq-meta-label">Points:</label>
                          <input
                            type="number"
                            className="cq-meta-input"
                            value={question.points}
                            onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                        <select
                          className="cq-question-type"
                          value={question.type}
                          onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                        >
                          <option value="single-choice">Single Choice</option>
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                        </select>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            className="cq-btn-delete"
                            onClick={() => handleRemoveQuestion(question.id)}
                            title="Delete question"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="cq-form-group">
                      <label className="cq-label">Question Text</label>
                      <textarea
                        className="cq-textarea"
                        rows={2}
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                        placeholder="Enter your question here..."
                      />
                    </div>

                    {question.type === 'single-choice' && (
                      <div className="cq-form-group">
                        <label className="cq-label">Answer Options (Select one correct answer)</label>
                        <div className="cq-options-list">
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="cq-option-row">
                              <div className="cq-option-radio">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                                  title="Mark as correct answer"
                                />
                              </div>
                              <input
                                type="text"
                                className="cq-option-input"
                                value={option.text}
                                onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  className="cq-btn-remove-option"
                                  onClick={() => handleRemoveOption(question.id, option.id)}
                                  title="Remove option"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            className="cq-btn-add-option"
                            onClick={() => handleAddOption(question.id)}
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    {question.type === 'multiple-choice' && (
                      <div className="cq-form-group">
                        <label className="cq-label">Answer Options (Select all correct answers)</label>
                        <div className="cq-options-list">
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="cq-option-row">
                              <div className="cq-option-checkbox">
                                <input
                                  type="checkbox"
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                                  title="Mark as correct answer"
                                />
                              </div>
                              <input
                                type="text"
                                className="cq-option-input"
                                value={option.text}
                                onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  className="cq-btn-remove-option"
                                  onClick={() => handleRemoveOption(question.id, option.id)}
                                  title="Remove option"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            className="cq-btn-add-option"
                            onClick={() => handleAddOption(question.id)}
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    {question.type === 'true-false' && (
                      <div className="cq-form-group">
                        <label className="cq-label">Correct Answer</label>
                        <div className="cq-options-list">
                          {question.options.map((option) => (
                            <div key={option.id} className="cq-option-row cq-option-row-readonly">
                              <div className="cq-option-radio">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                                  title="Mark as correct answer"
                                />
                              </div>
                              <input
                                type="text"
                                className="cq-option-input"
                                value={option.text}
                                readOnly
                                disabled
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  variant="contained"
                  startIcon={<AddIcon size={20} />}
                  onClick={handleAddQuestion}
                  fullWidth
                  sx={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    padding: '0.75rem',
                    '&:hover': {
                      backgroundColor: '#7c3aed'
                    }
                  }}
                >
                  Add Question
                </Button>
              </div>
            )}
          </Box>

          {/* Footer Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '2rem'
            }}
          >
            <Button
              variant="contained"
              onClick={handleBack}
              sx={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '0.6rem 2rem',
                '&:hover': {
                  backgroundColor: '#7c3aed'
                }
              }}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.6rem 2rem',
                '&:hover': {
                  backgroundColor: '#059669'
                }
              }}
              onClick={handlePublish}
            >
              Publish & Finish
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  )
}

export default CreateQuizStep2
