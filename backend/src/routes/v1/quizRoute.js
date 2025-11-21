import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { quizValidation } from '~/validations/quizValidation'
import { quizController } from '~/controllers/quizController'

const Router = express.Router()

// All dashboard routes require authentication
Router.use(authMiddleware.isAuthorized)

Router.route('')
  .get(quizController.getQuizzes)
  .post(quizValidation.createNew, quizController.createNew)

Router.route('/:id')
  .get(quizController.getDetails)


export const quizRoute = Router
