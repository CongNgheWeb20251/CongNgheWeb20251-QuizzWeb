import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { userRoute } from './userRoute.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: `${StatusCodes.OK}`,
    message: 'Server is running'
  })
})

Router.use('/users', userRoute)

export const Router_V1 = Router
