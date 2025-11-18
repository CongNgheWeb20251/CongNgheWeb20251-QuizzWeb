/* eslint-disable no-useless-catch */
import { quizModel } from '~/models/quizModel'
import { quizResultModel } from '~/models/quizResultModel'
import { userModel } from '~/models/userModel'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const getDashboardStats = async (userId) => {
  try {
    // Get total quizzes created by the user (teacher)
    const totalQuizzes = await DB_GET()
      .collection(quizModel.QUIZ_COLLECTION_NAME)
      .countDocuments({ createdBy: userId })

    // Get total students (users with role 'student')
    const totalStudents = await DB_GET()
      .collection(userModel.USER_COLLECTION_NAME)
      .countDocuments({ role: 'student' })

    // Get all quiz results for quizzes created by this user
    const userQuizzes = await DB_GET()
      .collection(quizModel.QUIZ_COLLECTION_NAME)
      .find({ createdBy: userId })
      .toArray()

    const quizIds = userQuizzes.map(q => q._id.toString())

    // Calculate average completion rate
    let avgCompletion = 0
    if (quizIds.length > 0) {
      const results = await DB_GET()
        .collection(quizResultModel.QUIZ_RESULT_COLLECTION_NAME)
        .find({ quizId: { $in: quizIds } })
        .toArray()

      if (results.length > 0) {
        const totalScore = results.reduce((sum, result) => sum + result.score, 0)
        avgCompletion = Math.round(totalScore / results.length)
      }
    }

    // Calculate changes (mock for now - you can implement historical comparison later)
    const totalQuizzesChange = '+12.5%'
    const totalStudentsChange = '+8.3%'
    const avgCompletionChange = avgCompletion >= 75 ? '+5.2%' : '-3.1%'

    return {
      totalQuizzes: {
        value: totalQuizzes,
        change: totalQuizzesChange,
        isPositive: true
      },
      totalStudents: {
        value: totalStudents,
        change: totalStudentsChange,
        isPositive: true
      },
      avgCompletion: {
        value: avgCompletion,
        change: avgCompletionChange,
        isPositive: avgCompletion >= 75
      }
    }
  } catch (error) {
    throw error
  }
}

const getTopStudents = async (limit = 5) => {
  try {
    // Get top students by average score across all quizzes
    const topStudents = await DB_GET()
      .collection(quizResultModel.QUIZ_RESULT_COLLECTION_NAME)
      .aggregate([
        {
          $group: {
            _id: '$userId',
            avgScore: { $avg: '$score' },
            totalQuizzes: { $sum: 1 }
          }
        },
        {
          $sort: { avgScore: -1 }
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    // Get user details for each top student
    const studentsWithDetails = await Promise.all(
      topStudents.map(async (student) => {
        const user = await DB_GET()
          .collection(userModel.USER_COLLECTION_NAME)
          .findOne({ _id: new ObjectId(student._id) })
        
        // Get the most recent quiz result to determine subject
        const recentResult = await DB_GET()
          .collection(quizResultModel.QUIZ_RESULT_COLLECTION_NAME)
          .findOne(
            { userId: student._id },
            { sort: { createdAt: -1 } }
          )
        
        let subject = 'General'
        if (recentResult) {
          const quiz = await DB_GET()
            .collection(quizModel.QUIZ_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(recentResult.quizId) })
          
          if (quiz) {
            subject = quiz.category || 'General'
          }
        }

        return {
          name: user?.fullName || user?.username || 'Unknown',
          subject: subject,
          score: Math.round(student.avgScore)
        }
      })
    )

    return studentsWithDetails
  } catch (error) {
    throw error
  }
}

const getRecentQuizzes = async (userId, limit = 3) => {
  try {
    // Get recent quizzes created by the user
    const recentQuizzes = await DB_GET()
      .collection(quizModel.QUIZ_COLLECTION_NAME)
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // Get completion stats for each quiz
    const quizzesWithStats = await Promise.all(
      recentQuizzes.map(async (quiz) => {
        const results = await DB_GET()
          .collection(quizResultModel.QUIZ_RESULT_COLLECTION_NAME)
          .find({ quizId: quiz._id.toString() })
          .toArray()

        const completions = results.length
        const rate = results.length > 0
          ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
          : 0

        return {
          id: quiz._id.toString(),
          title: quiz.title,
          questions: quiz.totalQuestions || 0,
          completions: completions,
          rate: rate
        }
      })
    )

    return quizzesWithStats
  } catch (error) {
    throw error
  }
}

export const dashboardService = {
  getDashboardStats,
  getTopStudents,
  getRecentQuizzes
}
