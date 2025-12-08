import { sessionQuizService } from '~/services/sessionQuizService'
import { StatusCodes } from 'http-status-codes'

const getQuizSessionDetails = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const sessionDetails = await sessionQuizService.getQuizSessionDetails(sessionId)
    res.status(StatusCodes.OK).json(sessionDetails)
  } catch (error) {
    next(error)
  }
}

const submitAnswers = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const answersData = req.body
    await sessionQuizService.submitAnswers(sessionId, answersData)
    res.status(StatusCodes.OK).json({ message: 'Answers submitted successfully' })
  } catch (error) {
    next(error)
  }
}

const submitQuizSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const result = await sessionQuizService.calculateQuizScore(sessionId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
const getQuizSessionResult = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const result = await sessionQuizService.getQuizSessionResult(sessionId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const sessionQuizController = {
  getQuizSessionDetails,
  submitAnswers,
  submitQuizSession,
  getQuizSessionResult
}
