import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const QUIZ_RESULT_COLLECTION_NAME = 'quizResults'
const QUIZ_RESULT_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  quizId: Joi.string().required(),

  // Điểm số và kết quả
  totalQuestions: Joi.number().required(),
  correctAnswers: Joi.number().required(),
  incorrectAnswers: Joi.number().required(),
  score: Joi.number().required(), // điểm số tính theo %
  totalPoints: Joi.number().optional(), // tổng điểm số

  // Thời gian
  timeSpent: Joi.number().required(), // tổng thời gian làm bài (giây)
  // startTime: Joi.date().timestamp('javascript').required(),
  // endTime: Joi.date().timestamp('javascript').required(),

  // Trạng thái
  // status: Joi.string().valid('completed', 'in-progress', 'abandoned').default('completed'),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const UNCHANGE_FIELDS = ['_id', 'createdAt', 'userId', 'quizId']

const validBeforeCreate = async (data) => {
  return await QUIZ_RESULT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdResult = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME).insertOne(validData)
    return createdResult
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findByUserId = async (userId) => {
  try {
    const results = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME)
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const findByQuizId = async (quizId) => {
  try {
    const results = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME)
      .find({ quizId: quizId })
      .sort({ createdAt: -1 })
      .toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const findByUserAndQuiz = async (userId, quizId) => {
  try {
    const results = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME)
      .find({ userId: userId, quizId: quizId })
      .sort({ createdAt: -1 })
      .toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const getTopScores = async (quizId, limit = 10) => {
  try {
    const topScores = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME)
      .find({ quizId: quizId, status: 'completed' })
      .sort({ score: -1, timeSpent: 1 })
      .limit(limit)
      .toArray()
    return topScores
  } catch (error) {
    throw new Error(error)
  }
}

const getUserStats = async (userId) => {
  try {
    const stats = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME)
      .aggregate([
        { $match: { userId: userId, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalQuizzes: { $sum: 1 },
            averageScore: { $avg: '$score' },
            totalTimeSpent: { $sum: '$timeSpent' },
            totalCorrectAnswers: { $sum: '$correctAnswers' },
            totalQuestions: { $sum: '$totalQuestions' }
          }
        }
      ])
      .toArray()
    return stats[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (resultId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    updateData.updatedAt = Date.now()

    const updateResult = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(resultId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (resultId) => {
  try {
    const deleteResult = await DB_GET().collection(QUIZ_RESULT_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(resultId)
    })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

export const quizResultModel = {
  QUIZ_RESULT_COLLECTION_NAME,
  QUIZ_RESULT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByUserId,
  findByQuizId,
  findByUserAndQuiz,
  getTopScores,
  getUserStats,
  update,
  deleteOne
}

/*
Schema:

userId, quizId
totalQuestions, correctAnswers, incorrectAnswers
score - Điểm %
totalPoints - Tổng điểm
timeSpent, startTime, endTime
status - completed/in-progress/abandoned

Functions:
findByUserId() - Lịch sử làm bài của user
findByQuizId() - Tất cả kết quả của 1 quiz
findByUserAndQuiz() - Lịch sử user làm 1 quiz
getTopScores() - Bảng xếp hạng (top điểm cao nhất)
getUserStats() - Thống kê tổng hợp của user (avg score, total time)

*/