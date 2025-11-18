import { StatusCodes } from 'http-status-codes'
import { dashboardService } from '~/services/dashboardService'

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const stats = await dashboardService.getDashboardStats(userId)
    res.status(StatusCodes.OK).json(stats)
  } catch (error) {
    next(error)
  }
}

const getTopStudents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const topStudents = await dashboardService.getTopStudents(limit)
    res.status(StatusCodes.OK).json(topStudents)
  } catch (error) {
    next(error)
  }
}

const getRecentQuizzes = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const limit = parseInt(req.query.limit) || 3
    const recentQuizzes = await dashboardService.getRecentQuizzes(userId, limit)
    res.status(StatusCodes.OK).json(recentQuizzes)
  } catch (error) {
    next(error)
  }
}

export const dashboardController = {
  getDashboardStats,
  getTopStudents,
  getRecentQuizzes
}
