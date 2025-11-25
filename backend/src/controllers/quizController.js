import { StatusCodes } from 'http-status-codes'
import { quizService } from '../services/quizService.js'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const data = req.body
    // console.log('quizController.createNew:', { userId, data })
    const createdQuiz = await quizService.createNew({ userId, data })
    // Trả về quiz object đầy đủ (có _id) thay vì insertResult
    res.status(StatusCodes.CREATED).json(createdQuiz)

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

const updateInfo = async (req, res, next) => {
  try {
    const quizId = req.params.id
    const updateData = req.body
    const updatedQuiz = await quizService.updateInfo(quizId, updateData)
    res.status(StatusCodes.OK).json(updatedQuiz)
  } catch (error) {
    next(error)
  }
}


export const quizController = {
  createNew,
  getDetails,
  getQuizzes,
  updateInfo
}
