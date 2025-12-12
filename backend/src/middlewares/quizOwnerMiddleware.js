import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { quizModel } from '~/models/quizModel'

const isQuizOwner = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.id || req.params.quizId
    const userRole = req.jwtDecoded.role

    // Validate quizId
    if (!quizId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Quiz ID is required')
    }

    // Tìm quiz
    const quiz = await quizModel.findOneById(quizId)
    if (!quiz) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Quiz not found')
    }

    // ⭐ Check: là owner hoặc admin?
    if (quiz.createdBy.toString() !== userId && userRole !== 'admin') {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to perform this action')
    }

    // Lưu quiz vào req để dùng lại ở controller
    req.quiz = quiz
    next()
  } catch (error) {
    next(error)
  }
}

export const quizOwnerMiddleware = {
  isQuizOwner
}
