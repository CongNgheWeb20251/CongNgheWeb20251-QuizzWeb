import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { userRoute } from './userRoute.js'
import { quizRoute } from './quizRoute.js'
import { studentRoute } from './studentRoute.js'
import { dashboardRoute } from './dashboardRoute.js'

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

export const Router_V1 = Router
