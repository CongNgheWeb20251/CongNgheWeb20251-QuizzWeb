import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { quizValidation } from '~/validations/quizValidation'
import { quizController } from '~/controllers/quizController'
import { questionController } from '~/controllers/questionController'

const Router = express.Router()

// All dashboard routes require authentication
Router.use(authMiddleware.isAuthorized)

Router.route('')
  .get(quizController.getQuizzes)
  .post(quizValidation.createNew, quizController.createNew)

Router.route('/stats')
  .get(quizController.getQuizzesStats)

Router.route('/:id')
  .get(quizController.getDetails)
  .put(quizValidation.updateInfo, quizController.updateInfo)

// Router.route('/:id/publish')
//   .post(quizController.publishQuiz)

// Router.route('/:id/unpublish')
//   .post(quizController.unpublishQuiz)

Router.route('/:quizId/questions/batch')
  .post(questionController.updateQuestionsInBatch)

Router.route('/:quizId/questions/:questionId')
  .put(questionController.updateQuestion)
  .delete(questionController.deleteQuestion)

export const quizRoute = Router
