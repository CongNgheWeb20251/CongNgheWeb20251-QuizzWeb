import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { quizController } from '~/controllers/quizController'
import { sessionQuizController } from '~/controllers/sessionQuizController'

const Router = express.Router()

Router.get('/sessions/:sessionId/result', sessionQuizController.getQuizSessionResult)
// All dashboard routes require authentication
Router.use(authMiddleware.isAuthorized)

Router.get('/quizzes', quizController.getQuizzesByStudent)

Router.get('/sessions/:sessionId', sessionQuizController.getQuizSessionDetails)
Router.put('/sessions/:sessionId/answers', sessionQuizController.submitAnswers)
Router.post('/sessions/:sessionId/submit', sessionQuizController.submitQuizSession)

Router.post('/quizzes/:quizId/sessions', quizController.startAttemptQuiz)
Router.get('/quizzes/:quizId/attempts', quizController.getQuizAttempts)

export const studentRoute = Router
