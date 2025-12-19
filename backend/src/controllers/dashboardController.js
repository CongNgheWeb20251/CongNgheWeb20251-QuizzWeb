import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { dashboardService } from '~/services/dashboardService'

const ensureTeacherScope = (role) => {
  if (role !== 'teacher' && role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only teachers can access dashboard data')
  }
}

const getStats = async (req, res, next) => {
  try {
    ensureTeacherScope(req.jwtDecoded.role)
    const teacherId = req.jwtDecoded._id
    const stats = await dashboardService.getDashboardStats(teacherId)
    res.status(StatusCodes.OK).json(stats)
  } catch (error) {
    next(error)
  }
}

const getTopStudents = async (req, res, next) => {
  try {
    ensureTeacherScope(req.jwtDecoded.role)
    const teacherId = req.jwtDecoded._id
    const { limit } = req.query
    const students = await dashboardService.getTopStudents(teacherId, limit)
    res.status(StatusCodes.OK).json(students)
  } catch (error) {
    next(error)
  }
}

const getTopQuizzes = async (req, res, next) => {
  try {
    ensureTeacherScope(req.jwtDecoded.role)
    const teacherId = req.jwtDecoded._id
    const { limit } = req.query
    const quizzes = await dashboardService.getTopPerformingQuizzes(teacherId, limit)
    res.status(StatusCodes.OK).json(quizzes)
  } catch (error) {
    next(error)
  }
}

const getRecentQuizzes = async (req, res, next) => {
  try {
    ensureTeacherScope(req.jwtDecoded.role)
    const teacherId = req.jwtDecoded._id
    const { limit } = req.query
    const quizzes = await dashboardService.getRecentQuizzesByTeacher(teacherId, limit)
    res.status(StatusCodes.OK).json(quizzes)
  } catch (error) {
    next(error)
  }
}

export const dashboardController = {
  getStats,
  getTopStudents,
  getTopQuizzes,
  getRecentQuizzes
}
