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
    const userRole = req.jwtDecoded.role
    const quizId = req.params.id
    const quiz = await quizService.getDetails(userId, quizId, userRole)
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

const getQuizzesByStudent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage } = req.query
    // console.log({ ...req.query })
    const quizzes = await quizService.getQuizzesByStudent(userId, page, itemsPerPage)
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

const getQuizzesStats = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const stats = await quizService.getQuizzesStats(userId)
    res.status(StatusCodes.OK).json(stats)
  } catch (error) {
    next(error)
  }
}

// student làm quiz - tạo mới session
const startAttemptQuiz = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.quizId
    const result = await quizService.startAttemptQuiz(userId, quizId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id
    const result = await quizService.deleteQuiz(quizId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const publishQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id
    const publishedQuiz = await quizService.publishQuiz(quizId)
    res.status(StatusCodes.OK).json(publishedQuiz)
  } catch (error) {
    next(error)
  }
}

export const quizController = {
  createNew,
  getDetails,
  getQuizzes,
  updateInfo,
  getQuizzesStats,
  getQuizzesByStudent,
  startAttemptQuiz,
  deleteQuiz,
  publishQuiz
}
