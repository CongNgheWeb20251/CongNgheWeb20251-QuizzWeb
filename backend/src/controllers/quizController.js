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

const deleteQuiz = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.id
    const result = await quizService.deleteQuiz(userId, quizId)
    res.status(StatusCodes.OK).json(result)
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
    const { page, itemsPerPage, filter, search } = req.query
    // console.log({ ...req.query })
    const quizzes = await quizService.getQuizzes(userId, page, itemsPerPage, filter, search)
    res.status(StatusCodes.OK).json(quizzes)
  } catch (error) {
    next(error)
  }
}

const getQuizzesByStudent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { page, itemsPerPage, search } = req.query
    // console.log({ ...req.query })
    const quizzes = await quizService.getQuizzesByStudent(userId, page, itemsPerPage, search)
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

const publishQuiz = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.id
    const updatedQuiz = await quizService.publishQuiz(userId, quizId)
    res.status(StatusCodes.OK).json(updatedQuiz)
  } catch (error) {
    next(error)
  }
}

const draftQuiz = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.id
    const updatedQuiz = await quizService.draftQuiz(userId, quizId)
    res.status(StatusCodes.OK).json(updatedQuiz)
  } catch (error) {
    next(error)
  }
}

const joinQuizByInvite = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { inviteToken } = req.params
    const result = await quizService.joinQuizByInvite(userId, inviteToken)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const getQuizInfo = async (req, res, next) => {
  try {
    const quizId = req.params.id
    const quizInfo = await quizService.getQuizInfo(quizId)
    res.status(StatusCodes.OK).json(quizInfo)
  } catch (error) {
    next(error)
  }
}
const getQuizAttempts = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const quizId = req.params.quizId
    const attempts = await quizService.getQuizAttempts(userId, quizId)
    res.status(StatusCodes.OK).json(attempts)
  } catch (error) {
    next(error)
  }
}

const getScoreDistribution = async (req, res, next) => {
  try {
    const { quizId } = req.params
    const distribution = await quizService.getScoreDistribution(quizId)
    res.status(StatusCodes.OK).json(distribution)
  } catch (error) {
    next(error)
  }
}

const getQuizMetrics = async (req, res, next) => {
  try {
    const { quizId } = req.params
    const metrics = await quizService.getQuizMetrics(quizId)
    res.status(StatusCodes.OK).json(metrics)
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
  joinQuizByInvite,
  getQuizInfo,
  getQuizAttempts,
  publishQuiz,
  draftQuiz,
  deleteQuiz,
  getScoreDistribution,
  getQuizMetrics
}
