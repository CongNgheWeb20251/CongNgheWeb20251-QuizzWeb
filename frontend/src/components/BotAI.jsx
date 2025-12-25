import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import { X, Sparkles } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import { askAIQuestionAPI } from '~/apis'


export default function AIChatbot({
  open,
  onClose,
  question,
  isCorrect
}) {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    async function fetchAIExplanation() {
      if (open && question) {
        setMessages([])
        setIsTyping(true)
        const aiMessages = [
          {
            type: 'ai',
            content: isCorrect
              ? 'Great job! Let me explain why your answer is correct.'
              : 'Let me help you understand this question better!'
          }
        ]
        //Gọi API AI để lấy lời giải thích
        const { answer } = await askAIQuestionAPI(question)
        aiMessages.push({
          type: 'ai',
          content: answer
        })
        // tips học tập
        aiMessages.push({
          type: 'ai',
          content: `**Key Concepts to Remember:**\n• Understanding the fundamentals is crucial for this type of question\n• Pay attention to specific details and keywords\n• Consider all aspects before making your selection\n${question.type === 'multiple' ? '• In multiple-choice questions, there may be more than one correct answer\n' : ''}• Practice similar questions to reinforce your understanding\nFeel free to review this explanation as many times as you need!`
        })

        setMessages(aiMessages)
        setIsTyping(false)
      }
    }
    fetchAIExplanation()
  }, [open, question, isCorrect])

  if (!open || !question) return null

  return (
    <>
      {/* Backdrop */}
      <Fade in={open}>
        <Box
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1300
          }}
        />
      </Fade>

      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            right: { xs: '1rem', md: '2rem' },
            bottom: { xs: '1rem', md: '2rem' },
            width: { xs: 'calc(100% - 2rem)', sm: '400px', md: '480px' },
            maxHeight: { xs: 'calc(100vh - 2rem)', md: '650px' },
            borderRadius: '20px',
            overflow: 'hidden',
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              from: {
                transform: 'translateY(100%)',
                opacity: 0
              },
              to: {
                transform: 'translateY(0)',
                opacity: 1
              }
            }
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: '#2b7fff',
              padding: '0.5rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                  boxShadow: '0 4px 12px rgba(167, 139, 250, 0.4)'
                }}
              >
                <Sparkles size={20} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  AI Explanation
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <X size={20} />
            </IconButton>
          </Box>

          {/* Question */}
          <Box
            sx={{
              backgroundColor: '#f8fafc',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600
              }}
            >
              Question
            </Typography>
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

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {isTyping ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)'
                  }}
                >
                  <Sparkles size={16} />
                </Avatar>
                <Box
                  sx={{
                    backgroundColor: '#f1f5f9',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                          animation: 'bounce 1.4s infinite',
                          animationDelay: `${i * 0.2}s`,
                          '@keyframes bounce': {
                            '0%, 80%, 100%': {
                              transform: 'scale(0)'
                            },
                            '40%': {
                              transform: 'scale(1)'
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              messages.map((message, index) => (
                <Fade in={true} timeout={300} key={index} style={{ transitionDelay: `${index * 150}ms` }}>
                  <Box sx={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    {/* Thay thế bằng markdown cho an toàn */}
                    <MDEditor.Markdown
                      source={message?.content}
                      style={{
                        whiteSpace: 'pre-wrap',
                        padding: question?.content ? '10px' : '0px',
                        border: question?.content ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                        borderRadius: '8px'
                      }}
                      className='bg-[#f8fafc] p-4 rounded-2xl shadow-sm flex-1'
                    />
                  </Box>
                </Fade>
              ))
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={16} style={{ color: '#8b5cf6' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontStyle: 'italic'
              }}
            >
              AI-powered explanations to enhance your learning
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </>
  )
}
