import { StatusCodes } from 'http-status-codes'
import { quizService } from '../services/quizService.js'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const data = req.body
    // console.log('quizController.createNew:', { userId, data })
    const result = await quizService.createNew({ userId, data })
    res.status(StatusCodes.CREATED).json({ message: 'Quiz created successfully', data: result })

  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.id
    const quiz = await quizService.getDetails(userId, quizId)
    res.status(StatusCodes.OK).json(quiz)
  } catch (error) {
    next(error)
  }
}

const getQuizzes = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage, filter } = req.query
    // console.log({ ...req.query })
    const quizzes = await quizService.getQuizzes(userId, page, itemsPerPage, filter)
    res.status(StatusCodes.OK).json(quizzes)
  } catch (error) {
    next(error)
  }
}

export const quizController = {
  createNew,
  getDetails,
  getQuizzes
}
