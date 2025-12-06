import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { quizController } from '~/controllers/quizController'

const Router = express.Router()

// All dashboard routes require authentication
Router.use(authMiddleware.isAuthorized)

Router.get('/quizzes', quizController.getQuizzesByStudent)


export const studentRoute = Router
