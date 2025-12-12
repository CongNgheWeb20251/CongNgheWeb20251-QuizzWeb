/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { quizResultModel } from '~/models/quizResultModel'
import { userModel } from '~/models/userModel'

const getQuizResults = async (quizId, page, itemsPerPage, sortBy = 'score', order = -1) => {
  try {
    const skip = (page - 1) * itemsPerPage

    // Lấy results của quiz
    const results = await quizResultModel.findByQuizId(quizId)
    
    // Sort
    const sortKey = { [sortBy]: order }
    const sortedResults = results.sort((a, b) => {
      if (order === -1) {
        return b[sortBy] - a[sortBy]
      } else {
        return a[sortBy] - b[sortBy]
      }
    })

    // Pagination
    const paginatedResults = sortedResults.slice(skip, skip + itemsPerPage)

    return {
      data: paginatedResults,
      pagination: {
        page,
        itemsPerPage,
        total: results.length,
        totalPages: Math.ceil(results.length / itemsPerPage)
      }
    }
  } catch (error) {
    throw error
  }
}

const getUserQuizHistory = async (userId, page, itemsPerPage) => {
  try {
    const skip = (page - 1) * itemsPerPage

    // Lấy history của user
    const history = await quizResultModel.findByUserId(userId)
    
    // Pagination
    const paginatedHistory = history.slice(skip, skip + itemsPerPage)

    return {
      data: paginatedHistory,
      pagination: {
        page,
        itemsPerPage,
        total: history.length,
        totalPages: Math.ceil(history.length / itemsPerPage)
      }
    }
  } catch (error) {
    throw error
  }
}

const getResultDetail = async (resultId) => {
  try {
    const result = await quizResultModel.findOneById(resultId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Result not found')
    }

    // Populate user info
    const user = await userModel.findOneById(result.userId)

    return {
      ...result,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    }
  } catch (error) {
    throw error
  }
}

export const quizResultService = {
  getQuizResults,
  getUserQuizHistory,
  getResultDetail
}
