import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { userRateLimit } from '~/middlewares/rateLimit'
import { questionValidation } from '~/validations/questionValidation'
import { questionController } from '~/controllers/questionController'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)
Router.use(userRateLimit)
Router.post('', questionValidation.createSingleQuestion, questionController.createNew)
Router.put('/:questionId', questionController.updateQuestion)
Router.delete('/:questionId', questionController.deleteQuestion)


export const questionRoute = Router
