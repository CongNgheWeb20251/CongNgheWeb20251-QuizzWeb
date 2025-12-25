import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userRateLimit } from '~/middlewares/rateLimit'
import { geminiProvider } from '~/providers/geminiChatbot.js'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)
Router.use(userRateLimit)
Router.post('/ask', async (req, res) => {
  // console.log('Received AI request:', req.body)
  const { question } = req.body

  if (!question) {
    // console.error('No question provided in request')
    return res.status(400).json({ error: 'Question is required' })
  }

  try {
    // console.log('Processing question:', question)
    const answer = await geminiProvider.askQuestion(question)
    // console.log('Got answer from AI:', answer)
    res.json({ answer })
  } catch (error) {
    // console.error('Error in /api/ai/ask:', error)
    res.status(500).json({ error: 'Lỗi AI' })
  }
})

export const chatbotRoute = Router
