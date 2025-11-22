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
import { selectCurrentActiveQuizz, fetchQuizzDetailsAPI } from '~/redux/activeQuizz/activeQuizzSlice'
import { useParams, useNavigate } from 'react-router-dom'


export default function EditQuizInfo() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const quizData = useSelector(selectCurrentActiveQuizz)
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams()

  const handleNext = () => {
    navigate(`/teacher/edit/${quizData._id}/step2`)
  }


  const handleSave = () => {
    // Dùng react hook form để xử lí sau .....
    // Handle save logic here
  }

  const handleBack = () => {
    navigate('/teacher/quizzes')
  }


  useEffect(() => {
    // Chỉ fetch nếu quizData chưa có hoặc _id không khớp với id từ URL
    if (!quizData || quizData._id !== id) {
      setIsLoading(true)
      dispatch(fetchQuizzDetailsAPI(id)).finally(() => setIsLoading(false))
    }
  }, [dispatch, id, quizData])

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
              <TextField
                fullWidth
                defaultValue={quizData.title}
                // onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter quiz title"
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
            </Box>

            {/* Description */}
            <Box sx={{ marginBottom: '1.5rem' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
              >
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                defaultValue={quizData.description}
                placeholder="Enter quiz description"
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
                <Select
                  defaultValue={quizData.category}
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
              </FormControl>
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
                <Select
                  defaultValue={quizData.level}
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
              </FormControl>
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
              <TextField
                fullWidth
                type="number"
                defaultValue={quizData.timeLimit}
                placeholder="Enter time limit"
                InputProps={{
                  inputProps: { min: 1 }
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
            </Box>

            {/* Passing Score */}
            <Box sx={{ marginBottom: '1.5rem' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}
              >
                Passing Score (%) *
              </Typography>
              <TextField
                fullWidth
                type="number"
                defaultValue={quizData.passingScore}
                placeholder="Enter passing score"
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
            </Box>

            {/* Divider */}
            <Box
              sx={{
                borderTop: '1px solid #e2e8f0',
                marginY: '1.5rem'
              }}
            />

            {/* Shuffle Questions */}
            <Box sx={{ marginBottom: '1rem' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.shuffleQuestions}
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
            </Box>

            {/* Show Results */}
            <Box sx={{ marginBottom: '1rem' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.showResults}
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
            </Box>

            {/* Allow Retake */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={quizData.allowRetake}
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
            </Box>

            {/* Info Box */}
            <Box
              sx={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fbbf24'
              }}
            >
              <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500 }}>
                💡 Note
              </Typography>
              <Typography variant="caption" sx={{ color: '#92400e' }}>
                Changes to these settings will apply to all future quiz attempts. Existing attempts
                will not be affected.
              </Typography>
            </Box>
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
            variant="outlined"
            startIcon={<SaveIcon fontSize='small' />}
            onClick={handleSave}
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              padding: '0.75rem 1.5rem',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc'
              }
            }}
          >
            Save
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
      </Container>
    </Box>
  )
}
