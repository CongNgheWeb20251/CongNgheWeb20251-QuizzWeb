import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userRateLimit } from '~/middlewares/rateLimit'
import { dashboardController } from '~/controllers/dashboardController'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)
Router.use(userRateLimit)

Router.get('/stats', dashboardController.getStats)
Router.get('/top-students', dashboardController.getTopStudents)
Router.get('/top-quizzes', dashboardController.getTopQuizzes)
Router.get('/recent-quizzes', dashboardController.getRecentQuizzes)

export const dashboardRoute = Router
