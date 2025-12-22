/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentActiveQuizz, fetchQuizzDetailsAPI } from '~/redux/activeQuizz/activeQuizzSlice'
import { useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import { createQuestionsInBatchAPI } from '~/apis'
import { isEqual, cloneDeep } from 'lodash'
import { Save, CircleAlert } from 'lucide-react'
import PageLoader from '~/components/Loading/PageLoader'
import QuestionContentMdEditor from '~/components/Form/QuestionContentMdEditor'
import { useConfirm } from 'material-ui-confirm'

const addTempIds = (rawQuestions = []) => rawQuestions.map((question, index) => {
  const tempId = question.tempId ?? index + 1
  const options = (question.options || []).map((option, optIndex) => ({
    ...option,
    tempId: option.tempId ?? tempId * 10 + optIndex + 1
  }))
  return { ...question, tempId, options }
})

function CreateQuizStep2() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const quizData = useSelector(selectCurrentActiveQuizz)
  const [isLoading, setIsLoading] = useState(false)

  const [questions, setQuestions] = useState(() => addTempIds(quizData?.questions || []))
  const [originalQuestions, setOriginalQuestions] = useState(() => cloneDeep(addTempIds(quizData?.questions || [])))
  const { id } = useParams()
  const confirm = useConfirm()

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchQuizzDetailsAPI(id)).finally(() => setIsLoading(false))
  }, [id, dispatch])

  // hàm này để đồng bộ lại questions khi quizData thay đổi (lần đầu load hoặc sau khi save draft)
  useEffect(() => {
    if (quizData?.questions?.length) {
      const questionsData = addTempIds(quizData.questions)
      setQuestions(questionsData)
      setOriginalQuestions(cloneDeep(questionsData))
    } else {
      setQuestions([])
      setOriginalQuestions([])
    }
  }, [quizData?.questions])

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.tempId === questionId) {
        // When changing question type, update options accordingly
        if (field === 'type') {
          if (value === 'true-false') {
            return {
              ...q,
              type: value,
              options: [
                { tempId: q.tempId * 10 + 1, content: 'True', isCorrect: false },
                { tempId: q.tempId * 10 + 2, content: 'False', isCorrect: false }
              ]
            }
          } else if (value === 'single-choice' || value === 'multiple-choice') {
            return {
              ...q,
              type: value,
              options: [
                { tempId: q.tempId * 10 + 1, content: '', isCorrect: false },
                { tempId: q.tempId * 10 + 2, content: '', isCorrect: false }
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
      if (q.tempId === questionId) {
        return {
          ...q,
          options: q.options.map(opt =>
            opt.tempId === optionId ? { ...opt, [field]: value } : opt
          )
        }
      }
      return q
    }))
  }

  const handleCorrectAnswerChange = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.tempId === questionId) {
        // For multiple-choice, allow multiple correct answers (checkbox behavior)
        if (q.type === 'multiple-choice') {
          return {
            ...q,
            options: q.options.map(opt =>
              opt.tempId === optionId
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
              isCorrect: opt.tempId === optionId
            }))
          }
        }
      }
      return q
    }))
  }

  const handleAddOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.tempId === questionId) {
        const maxOptionIndex = q.options && q.options.length ? Math.max(...q.options.map(o => Number(o.tempId) % 10)) : 0
        const newOption = {
          tempId: q.tempId * 10 + maxOptionIndex + 1,
          content: '',
          isCorrect: false
        }
        return { ...q, options: [...q.options, newOption] }
      }
      return q
    }))
  }

  const handleRemoveOption = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.tempId === questionId && q.options.length > 2) {
        return {
          ...q,
          options: q.options.filter(opt => opt.tempId !== optionId)
        }
      }
      return q
    }))
  }

  const handleAddQuestion = () => {
    const maxId = questions && questions.length ? Math.max(...questions.map(q => Number(q.tempId))) : 0
    const newQuestionTempId = maxId + 1
    const newQuestion = {
      tempId: newQuestionTempId,
      content: '```cpp \n // Click edit to edit content \n```',
      points: 10,
      type: 'single-choice',
      options: [
        { tempId: newQuestionTempId * 10 + 1, content: '', isCorrect: false },
        { tempId: newQuestionTempId * 10 + 2, content: '', isCorrect: false }
      ]
    }
    setQuestions(prev => [...prev, newQuestion])
  }

  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.tempId !== questionId))
    }
  }

  const handleBack = () => {
    navigate(`/teacher/edit/${quizData._id}/step1`)
  }

  const validateQuestions = () => {
    if (questions.length === 0) {
      toast.error('Please add at least one question before proceeding.')
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]

      // Check if question content is empty
      if (!question.content || question.content.trim() === '') {
        toast.error(`Question ${i + 1}: Question content cannot be empty.`)
        return false
      }

      // Check if at least one correct answer is selected
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect)
      if (!hasCorrectAnswer) {
        toast.error(`Question ${i + 1}: Please select at least one correct answer.`)
        return false
      }

      // Check if all options have content (except for true-false which has fixed content)
      if (question.type !== 'true-false') {
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j]
          if (!option.content || option.content.trim() === '') {
            toast.error(`Question ${i + 1}, Option ${j + 1}: Option content cannot be empty.`)
            return false
          }
        }
      }
    }

    return true
  }

  // Kiểm tra xem có thay đổi so với dữ liệu gốc không
  const hasChanges = () => {
    return !isEqual(questions, originalQuestions)
  }

  const handleSave = async () => {
    if (!validateQuestions()) throw new Error('Validation failed')

    // Kiểm tra xem có thay đổi không
    if (!hasChanges()) {
      toast.info('No changes to save.')
      return
    }

    // console.log('Save draft - Step 2:', { questions })
    // 2. Trước khi gửi lên server, loại bỏ tempId khỏi questions và options
    const questionsToSave = questions.map(q => {
      const { tempId, ...questionData } = q
      questionData.options = questionData.options.map(opt => {
        const { tempId, ...optionData } = opt
        return optionData
      })
      return questionData
    })
    // console.log('Questions to save:', questionsToSave)
    try {
      const res = await toast.promise(
        createQuestionsInBatchAPI(quizData._id, questionsToSave),
        {
          pending: 'Updating...'
        }
      )
      if (!res.error) {
        toast.success('Draft saved successfully!')
        // dispatch lại dữ liệu quizDetails để cập nhật câu hỏi với _id từ server
        await dispatch(fetchQuizzDetailsAPI(id))
      } else {
        throw new Error(res.error)
      }
    } catch (error) {
      toast.error('Failed to save draft. Please try again.')
      // console.error('Save draft error:', error)
      throw error
    }
  }

  const handlePreview = () => {
    localStorage.setItem('previewQuiz', JSON.stringify({ ...quizData, questions }))
  }

  const handleFinish = async () => {
    if (!hasChanges()) {
      navigate(`/teacher/quizzes/${quizData._id}`)
      return
    }

    const { confirmed } = await confirm({
      title: (
        <div className="flex items-center gap-2">
          <CircleAlert color="orange" />
          <span>Unsaved changes</span>
        </div>
      ),
      description: (
        <div className="mt-4 space-y-2 mb-2">
          <p className="text-sm text-gray-600">
            You have unsaved changes in this question.
          </p>
          <p className="text-sm text-gray-600">
            Do you want to save your changes before finishing?
          </p>
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-600">
            ⚠ If you don’t save, your changes will be lost.
          </div>
        </div>
      ),
      confirmationText: 'Save & Finish',
      cancellationText: 'No, Finish Without Saving',
      confirmationButtonProps: {
        color: 'primary',
        variant: 'contained'
      }
    })
    if (confirmed) {
      try {
        await handleSave()
        navigate(`/teacher/quizzes/${quizData._id}`)
      } catch (error) {
        // console.error('Save failed:', error)
      }
      return
    }
    else {
      navigate(`/teacher/quizzes/${quizData._id}`)
      return
    }
  }

  if (isLoading || !quizData) {
    return (
      <PageLoader fullScreen />
    )
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
            onClick={handleSave}
          >
            <Save size={20} style={{ marginRight: '0.5rem' }} />
            Save
          </Button>
          <Link
            to={`/teacher/quizzes/${quizData._id}/preview`}
            // state={{ quizData: { ...quizData, questions } }}
            target="_blank"
            rel="noopener noreferrer"
            className="cq-btn-1 cq-btn-primary"
            onClick={handlePreview}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Preview
          </Link>
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
              {quizData?.title || 'Quiz Title'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {quizData?.description || 'Add a description for your quiz'}
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
                {questions?.map((question, qIndex) => (
                  <div key={question?.tempId} className="cq-question-card">
                    <div className="cq-question-header">
                      <h4 className="cq-question-number">Question {qIndex + 1}</h4>
                      <div className="cq-question-controls">
                        <div className="cq-question-meta">
                          <label className="cq-meta-label">Points:</label>
                          <input
                            type="number"
                            className="cq-meta-input"
                            value={question.points}
                            onChange={(e) => handleQuestionChange(question.tempId, 'points', parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                        <select
                          className="cq-question-type"
                          value={question.type}
                          onChange={(e) => handleQuestionChange(question.tempId, 'type', e.target.value)}
                          disabled={Boolean(question._id)}
                          title={question._id ? 'Cannot change type for existing questions' : 'Select question type'}
                        >
                          <option value="single-choice">Single Choice</option>
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                        </select>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            className="cq-btn-delete"
                            onClick={() => handleRemoveQuestion(question.tempId)}
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
                      <QuestionContentMdEditor
                        questionContentProp={question.content}
                        onUpdateQuestionContent={(newContent) => handleQuestionChange(question.tempId, 'content', newContent)}
                      />
                    </div>

                    {question.type === 'single-choice' && (
                      <div className="cq-form-group">
                        <label className="cq-label">Answer Options (Select one correct answer)</label>
                        <div className="cq-options-list">
                          {question?.options?.map((option, oIndex) => (
                            <div key={option.tempId} className="cq-option-row">
                              <div className="cq-option-radio">
                                <input
                                  type="radio"
                                  name={`correct-${question.tempId}`}
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(question.tempId, option.tempId)}
                                  title="Mark as correct answer"
                                />
                              </div>
                              <input
                                type="text"
                                className="cq-option-input"
                                value={option.content}
                                onChange={(e) => handleOptionChange(question.tempId, option.tempId, 'content', e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  className="cq-btn-remove-option"
                                  onClick={() => handleRemoveOption(question.tempId, option.tempId)}
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
                            onClick={() => handleAddOption(question.tempId)}
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
                            <div key={option.tempId} className="cq-option-row">
                              <div className="cq-option-checkbox">
                                <input
                                  type="checkbox"
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(question.tempId, option.tempId)}
                                  title="Mark as correct answer"
                                />
                              </div>
                              <input
                                type="text"
                                className="cq-option-input"
                                value={option.content}
                                onChange={(e) => handleOptionChange(question.tempId, option.tempId, 'content', e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  className="cq-btn-remove-option"
                                  onClick={() => handleRemoveOption(question.tempId, option.tempId)}
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
                            onClick={() => handleAddOption(question.tempId)}
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
                            <div key={option.tempId} className="cq-option-row cq-option-row-readonly">
                              <div className="cq-option-radio">
                                <input
                                  type="radio"
                                  name={`correct-${question.tempId}`}
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(question.tempId, option.tempId)}
                                  title="Mark as correct answer"
                                />
                              </div>
                              <input
                                type="text"
                                className="cq-option-input"
                                value={option.content}
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
              onClick={handleFinish}
            >
              Finish
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  )
}

export default CreateQuizStep2
