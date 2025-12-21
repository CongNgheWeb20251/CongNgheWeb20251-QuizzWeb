import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userRateLimit } from '~/middlewares/rateLimit'
import { notificationController } from '~/controllers/notificationController'

const Router = express.Router()

// All dashboard routes require authentication
Router.use(authMiddleware.isAuthorized)
Router.use(userRateLimit)

Router.get('', notificationController.getNotificationByTeacher)


export const notificationRoute = Router
