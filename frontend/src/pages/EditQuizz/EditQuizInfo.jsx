import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Container from '@mui/material/Container'
import SaveIcon from '@mui/icons-material/Save'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveQuizz, fetchQuizzDetailsAPI, updateCurrentActiveQuizz } from '~/redux/activeQuizz/activeQuizzSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { updateQuizInfo } from '~/apis'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'


export default function EditQuizInfo() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const quizData = useSelector(selectCurrentActiveQuizz)
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams()

  const formatDateTimeLocal = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const initialFormData = {
    title: quizData?.title,
    description: quizData?.description,
    category: quizData?.category,
    level: quizData?.level,
    timeLimit: quizData?.timeLimit,
    passingScore: quizData?.passingScore,
    startTime: formatDateTimeLocal(quizData?.startTime),
    endTime: formatDateTimeLocal(quizData?.endTime),
    showResults: quizData?.showResults,
    allowRetake: quizData?.allowRetake
  }

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialFormData
  })

  // const currentFormData = watch()

  // Check if form has changes
  // const hasChanges = () => {
  //   if (!quizData) return false
  //   return !isEqual(currentFormData, quizData)
  // }

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchQuizzDetailsAPI(id)).finally(() => setIsLoading(false))
  }, [dispatch, id])

  // Reset form when quizData changes
  useEffect(() => {
    if (quizData) {
      reset({
        title: quizData.title,
        description: quizData.description,
        category: quizData.category,
        level: quizData.level,
        timeLimit: quizData.timeLimit,
        passingScore: quizData.passingScore,
        startTime: formatDateTimeLocal(quizData.startTime),
        endTime: formatDateTimeLocal(quizData.endTime),
        showResults: quizData.showResults,
        allowRetake: quizData.allowRetake
      })
    }
  }, [quizData, reset])

  const handleNext = () => {
    navigate(`/teacher/edit/${quizData._id}/step2`)
  }

  const submitUpdateQuiz = async (data) => {
    const { title, description, category, level, timeLimit, passingScore, startTime, endTime, showResults, allowRetake } = data

    // Convert datetime-local to milliseconds
    const updateData = {
      title,
      description,
      category,
      level,
      timeLimit,
      passingScore,
      startTime: startTime ? new Date(startTime).getTime() : undefined,
      endTime: endTime ? new Date(endTime).getTime() : undefined,
      showResults,
      allowRetake
    }

    // Prepare update data
    if (title === quizData.title && description === quizData.description && category === quizData.category && level === quizData.level && timeLimit === quizData.timeLimit && passingScore === quizData.passingScore && updateData.startTime === quizData.startTime && updateData.endTime === quizData.endTime && showResults === quizData.showResults && allowRetake === quizData.allowRetake) {
      toast.info('No changes to save.')
      return
    }
    // console.log("data", data)

    try {
      const updatedQuiz = await updateQuizInfo(id, updateData)
      toast.success('Quiz information updated successfully!')
      // console.log("first", updatedQuiz)
      // Update redux store
      const quizClone = cloneDeep(quizData)
      const updatedQuizData = { ...quizClone, ...updatedQuiz }
      dispatch(updateCurrentActiveQuizz(updatedQuizData))
    } catch (error) {
      toast.error('Failed to update quiz information. Please try again.')
      // eslint-disable-next-line no-console
      console.error('Update quiz error:', error)
    }
  }

  const handleBack = () => {
    navigate('/teacher/quizzes')
  }

  if (isLoading || !quizData) {
    return (
      <Box>
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading quiz details...</p>
        </div>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f9ff',
        padding: '2rem'
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ marginBottom: '2rem' }}>
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{
              color: '#64748b',
              marginBottom: '1rem',
              '&:hover': {
                backgroundColor: '#e0f2fe'
              }
            }}
            onClick={handleBack}
          >
            Back to Quiz List
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#0f172a' }}>
            Edit Quiz Information
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', marginTop: '0.5rem' }}>
            Update your quiz details and settings
          </Typography>
        </Box>

        {/* Main Content - Two Column Layout */}
        <form onSubmit={handleSubmit(submitUpdateQuiz)}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: '2rem'
            }}
          >
            {/* Left Column - Quiz Details */}
            <Paper
              elevation={2}
              sx={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, marginBottom: '1.5rem', color: '#0f172a' }}
              >
              Quiz Details
              </Typography>

              {/* Title */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Quiz Title *
                </Typography>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 100, message: 'Max Length is 100 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Enter quiz title"
                      error={!!errors.title}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6'
                          }
                        }
                      }}
                    />
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="title" />
              </Box>

              {/* Description */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Description
                </Typography>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 500, message: 'Max Length is 500 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Enter quiz description"
                      error={!!errors.description}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6'
                          }
                        }
                      }}
                    />
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="description" />
              </Box>

              {/* Category */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Category *
                </Typography>
                <FormControl fullWidth>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        error={!!errors.category}
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8b5cf6'
                          }
                        }}
                      >
                        <MenuItem value="programming">Programming</MenuItem>
                        <MenuItem value="mathematics">Mathematics</MenuItem>
                        <MenuItem value="science">Science</MenuItem>
                        <MenuItem value="history">History</MenuItem>
                        <MenuItem value="technology">Technology</MenuItem>
                        <MenuItem value="geography">Geography</MenuItem>
                        <MenuItem value="literature">Literature</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <FieldErrorAlert errors={errors} fieldName="category" />
              </Box>

              {/* level */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Level *
                </Typography>
                <FormControl fullWidth>
                  <Controller
                    name="level"
                    control={control}
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        error={!!errors.level}
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8b5cf6'
                          }
                        }}
                      >
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                        <MenuItem value="expert">Expert</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <FieldErrorAlert errors={errors} fieldName="level" />
              </Box>
            </Paper>

            {/* Right Column - Quiz Settings */}
            <Paper
              elevation={2}
              sx={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, marginBottom: '1.5rem', color: '#0f172a' }}
              >
              Quiz Settings
              </Typography>

              {/* Time Limit */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Time Limit (minutes) *
                </Typography>
                <Controller
                  name="timeLimit"
                  control={control}
                  rules={{
                    required: FIELD_REQUIRED_MESSAGE,
                    min: { value: 1, message: 'Time limit must be at least 1 minute' },
                    max: { value: 300, message: 'Time limit cannot exceed 300 minutes' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      placeholder="Enter time limit"
                      error={!!errors.timeLimit}
                      InputProps={{
                        inputProps: { min: 1, max: 300 }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6'
                          }
                        }
                      }}
                    />
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="timeLimit" />
              </Box>

              {/* Passing Score */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Passing Score (%) *
                </Typography>
                <Controller
                  name="passingScore"
                  control={control}
                  rules={{
                    required: FIELD_REQUIRED_MESSAGE,
                    min: { value: 0, message: 'Passing score cannot be negative' },
                    max: { value: 100, message: 'Passing score cannot exceed 100%' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      placeholder="Enter passing score"
                      error={!!errors.passingScore}
                      InputProps={{
                        inputProps: { min: 0, max: 100 }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6'
                          }
                        }
                      }}
                    />
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="passingScore" />
              </Box>
              {/* Start Date */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                Start Date *
                </Typography>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: FIELD_REQUIRED_MESSAGE }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="datetime-local"
                      error={!!errors.startTime}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6'
                          }
                        }
                      }}
                    />
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="startTime" />
              </Box>

              {/* End Date */}
              <Box sx={{ marginBottom: '1.5rem' }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
                >
                End Date *
                </Typography>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: FIELD_REQUIRED_MESSAGE }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="datetime-local"
                      error={!!errors.endTime}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#fafbfc',
                          '&:hover fieldset': {
                            borderColor: '#8b5cf6'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6'
                          }
                        }
                      }}
                    />
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="endTime" />
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  borderTop: '1px solid #e2e8f0',
                  marginY: '1.5rem'
                }}
              />

              {/* Shuffle Questions */}
              {/* <Box sx={{ marginBottom: '1rem' }}>
                <Controller
                  name="shuffleQuestions"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#8b5cf6'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#8b5cf6'
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                          Shuffle Questions
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Randomize question order for each attempt
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Box> */}

              {/* Show Results */}
              <Box sx={{ marginBottom: '1rem' }}>
                <Controller
                  name="showResults"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#8b5cf6'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#8b5cf6'
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                          Show Results Immediately
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Display score and answers after submission
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Box>

              {/* Allow Retake */}
              <Box>
                <Controller
                  name="allowRetake"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#8b5cf6'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#8b5cf6'
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                          Allow Retake
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Students can retake the quiz multiple times
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Box>

              {/* Info Box */}
              {/* <Box
                sx={{
                  marginTop: '2rem',
                  padding: '1rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #fbbf24'
                }}
              >
                <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500 }}>
                Note
                </Typography>
                <Typography variant="caption" sx={{ color: '#92400e' }}>
                Changes to these settings will apply to all future quiz attempts. Existing attempts
                will not be affected.
                </Typography>
              </Box> */}
            </Paper>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              marginTop: '2rem'
            }}
          >
            <Button
              type="submit"
              variant="outlined"
              startIcon={<SaveIcon fontSize='small' />}
              sx={{
                borderColor: '#cbd5e1',
                color: '#64748b',
                padding: '0.75rem 1.5rem',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f8fafc'
                },
                '&.Mui-disabled': {
                  opacity: 0.5
                }
              }}
            >
            Save Changes
            </Button>

            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="contained"
                startIcon={<RemoveRedEyeIcon fontSize="small" />}
                sx={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  '&:hover': {
                    backgroundColor: '#7c3aed'
                  }
                }}
              >
              Preview
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  '&:hover': {
                    backgroundColor: '#059669'
                  }
                }}
                onClick={handleNext}
              >
              Edit Questions
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  )
}
