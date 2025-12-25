import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { userRoute } from './userRoute.js'
import { quizRoute } from './quizRoute.js'
import { studentRoute } from './studentRoute.js'
import { dashboardRoute } from './dashboardRoute.js'
import { notificationRoute } from './notificationRoute.js'
import { questionRoute } from './questionRoute.js'
import { chatbotRoute } from './chatbotRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: `${StatusCodes.OK}`,
    message: 'Server is running'
  })
})

Router.use('/users', userRoute)
Router.use('/quizzes', quizRoute)
Router.use('/student', studentRoute)
Router.use('/dashboard', dashboardRoute)
Router.use('/notifications', notificationRoute)
Router.use('/questions', questionRoute)
Router.use('/ai', chatbotRoute)

export const Router_V1 = Router
