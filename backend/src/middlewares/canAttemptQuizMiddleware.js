import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { quizModel } from '~/models/quizModel'
import { quizResultModel } from '~/models/quizResultModel'

const canAttemptQuiz = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.quizId || req.params.id

    if (!quizId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Quiz ID is required')
    }

    const quiz = await quizModel.findOneById(quizId)
    if (!quiz) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Quiz not found')
    }

    // ✅ Check 1: Quiz published?
    if (quiz.status !== 'published') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'This quiz is not available yet'
      )
    }

    // ✅ Check 2: Hiện tại có nằm trong thời gian quiz không?
    const now = Date.now()

    if (now < quiz.startTime) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        `Quiz has not started yet. Starts at ${new Date(quiz.startTime).toLocaleString()}`
      )
    }

    if (now > quiz.endTime) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Quiz has ended. No longer accepting submissions'
      )
    }

    // ✅ Check 3: Nếu không cho phép làm lại, đã làm rồi chưa?
    if (!quiz.allowRetake) {
      const existingResults = await quizResultModel.findByUserAndQuiz(userId, quizId)
      if (existingResults && existingResults.length > 0) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'You have already completed this quiz and retakes are not allowed'
        )
      }
    }

    // Lưu quiz vào req
    req.quiz = quiz
    next()
  } catch (error) {
    next(error)
  }
}

export const canAttemptQuizMiddleware = {
  canAttemptQuiz
}
