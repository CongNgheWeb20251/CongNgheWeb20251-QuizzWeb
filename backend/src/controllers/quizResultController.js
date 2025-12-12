import { StatusCodes } from 'http-status-codes'
import { quizResultService } from '~/services/quizResultService'
import ApiError from '~/utils/ApiError'

const getQuizResults = async (req, res, next) => {
  try {
    const { quizId } = req.params
    const { page = 1, itemsPerPage = 10, sortBy = 'score', order = -1 } = req.query

    if (!quizId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'quizId is required')
    }

    const results = await quizResultService.getQuizResults(
      quizId,
      parseInt(page),
      parseInt(itemsPerPage),
      sortBy,
      parseInt(order)
    )
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const getUserQuizHistory = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page = 1, itemsPerPage = 10 } = req.query

    const history = await quizResultService.getUserQuizHistory(
      userId,
      parseInt(page),
      parseInt(itemsPerPage)
    )
    res.status(StatusCodes.OK).json(history)
  } catch (error) {
    next(error)
  }
}

const getResultDetail = async (req, res, next) => {
  try {
    const { resultId } = req.params
    const result = await quizResultService.getResultDetail(resultId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const quizResultController = {
  getQuizResults,
  getUserQuizHistory,
  getResultDetail
}
