import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { userRoute } from './userRoute.js'
import { dashboardRoute } from './dashboardRoute.js'
import { quizRoute } from './quizRoute.js'
import { studentRoute } from './studentRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: `${StatusCodes.OK}`,
    message: 'Server is running'
  })
})

Router.use('/users', userRoute)
Router.use('/dashboard', dashboardRoute)
Router.use('/quizzes', quizRoute)
Router.use('/student', studentRoute)

export const Router_V1 = Router
