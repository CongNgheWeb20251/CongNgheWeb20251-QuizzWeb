/* eslint-disable no-useless-catch */
import { quizModel } from '~/models/quizModel'
import { cloneDeep } from 'lodash'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE, DEFAULT_FILTER } from '~/utils/constants'

const createNew = async ({ userId, data }) => {
  try {
    //
    const newQuiz = {
      title: data.title,
      description: data.description || '',
      category: data.category,
      level: data.difficulty,
      status: data.status || 'draft',
      timeLimit: data.timeLimit,
      createdBy: userId,
      passingScore: data.passingScore
    }
    const createdQuiz = await quizModel.createNew(newQuiz)
    return createdQuiz

  } catch (error) {
    throw error
  }
}
const getDetails = async (userId, quizzId, userRole) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const quiz = await quizModel.getDetails(userId, quizzId)
    if (!quiz) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Quiz with id ${quizzId} not found`)
    }
    const quizClone = cloneDeep(quiz)
    quizClone.questions.forEach(question => {
      question.options = quizClone.options.filter(option => option.questionId.toString() === question._id.toString())

      // Nếu user là student, xóa trường isCorrect khỏi các options
      if (userRole === 'student') {
        question.options.forEach(option => {
          delete option.isCorrect
        })
      }
    })
    delete quizClone.options

    // Nếu user là student, xóa các trường nhạy cảm khỏi quiz
    if (userRole === 'student') {
      delete quizClone.level
      delete quizClone.status
      delete quizClone.category
      delete quizClone.createdBy
      delete quizClone.passingScore
      delete quizClone.updatedAt
      delete quizClone.createdAt
      delete quizClone.allowRetake
    }

    return quizClone
  } catch (error) {
    throw error
  }
}

const getQuizzes = async (userId, page, itemsPerPage, filter) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE
    if (!filter) filter = DEFAULT_FILTER
    else if (filter === 'drafts') filter = 'draft'
    // console.log({page, itemsPerPage, filter})

    const result = await quizModel.getQuizzes(userId, parseInt(page, 10), parseInt(itemsPerPage, 10), filter)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateInfo = async (quizId, updateData) => {
  try {
    const updatedQuiz = await quizModel.update(quizId, updateData)
    return updatedQuiz
  } catch (error) {
    throw new Error(error)
  }
}

const getQuizzesStats = async (userId) => {
  try {
    const stats = await quizModel.getQuizzesStats(userId)
    return stats
  } catch (error) {
    throw new Error(error)
  }
}

const getQuizzesByStudent = async (userId, page, itemsPerPage) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const result = await quizModel.getQuizzesByStudent(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const quizService = {
  createNew,
  getDetails,
  getQuizzes,
  updateInfo,
  getQuizzesStats,
  getQuizzesByStudent
}
