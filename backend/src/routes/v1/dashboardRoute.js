import express from 'express'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// All dashboard routes require authentication
Router.use(authMiddleware.isAuthorized)

// Get dashboard statistics (total quizzes, students, avg completion)
Router.get('/stats', dashboardController.getDashboardStats)

// Get top students
Router.get('/top-students', dashboardController.getTopStudents)

// Get recent quizzes
Router.get('/recent-quizzes', dashboardController.getRecentQuizzes)

export const dashboardRoute = Router
