import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { quizOwnerMiddleware } from '~/middlewares/quizOwnerMiddleware'
import { canAttemptQuizMiddleware } from '~/middlewares/canAttemptQuizMiddleware'
import { quizValidation } from '~/validations/quizValidation'
import { quizController } from '~/controllers/quizController'
import { questionController } from '~/controllers/questionController'
import { quizResultController } from '~/controllers/quizResultController'

const Router = express.Router()

// All quiz routes require authentication
Router.use(authMiddleware.isAuthorized)

Router.route('')
  .get(quizController.getQuizzes)
  .post(quizValidation.createNew, quizController.createNew)

Router.route('/stats')
  .get(quizController.getQuizzesStats)

// Quiz Results - Student view their history
Router.route('/history')
  .get(quizResultController.getUserQuizHistory)

// Quiz Results - View detail
Router.route('/results/:resultId')
  .get(quizResultController.getResultDetail)

Router.route('/:id')
  .get(quizController.getDetails)
  .put(quizOwnerMiddleware.isQuizOwner, quizValidation.updateInfo, quizController.updateInfo)
  .delete(quizOwnerMiddleware.isQuizOwner, quizController.deleteQuiz)

Router.route('/:id/publish')
  .post(quizOwnerMiddleware.isQuizOwner, quizController.publishQuiz)

// Quiz Results - Teacher view all results
Router.route('/:quizId/results')
  .get(quizOwnerMiddleware.isQuizOwner, quizResultController.getQuizResults)

Router.route('/:quizId/questions/batch')
  .post(quizOwnerMiddleware.isQuizOwner, questionController.updateQuestionsInBatch)

Router.route('/:quizId/questions/:questionId')
  .put(quizOwnerMiddleware.isQuizOwner, questionController.updateQuestion)
  .delete(quizOwnerMiddleware.isQuizOwner, questionController.deleteQuestion)

// Start attempt quiz - need canAttemptQuiz middleware
Router.route('/:quizId/start')
  .post(canAttemptQuizMiddleware.canAttemptQuiz, quizController.startAttemptQuiz)

export const quizRoute = Router
