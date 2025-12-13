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

Router.route('/join/:inviteToken')
  .post(quizController.joinQuizByInvite)

Router.route('/:id/info')
  .get(quizController.getQuizInfo)
  .put(quizValidation.updateInfo, quizController.updateInfo)

Router.route('/:id')
  .get(quizController.getDetails)


// Router.route('/:id/publish')
//   .post(quizController.publishQuiz)
Router.route('/:id/publish')
  .post(quizController.publishQuiz)

// Router.route('/:id/unpublish')
//   .post(quizController.unpublishQuiz)
Router.route('/:id/draft')
  .post(quizController.draftQuiz)

Router.route('/:quizId/questions/batch')
  .post(questionController.updateQuestionsInBatch)

export const quizRoute = Router