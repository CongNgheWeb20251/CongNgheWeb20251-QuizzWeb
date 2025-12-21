import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'
import { quizModel } from './quizModel'
import { sessionQuizModel } from './sessionQuizModel'

const NOTIFICATION_COLLECTION_NAME = 'notifications'
const NOTIFICATION_COLLECTION_SCHEMA = Joi.object({
  studentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  sessionId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quizId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  teacherId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  type: Joi.string().valid('start', 'submit').required(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

// const UNCHANGE_FIELDS = ['_id', 'createdAt', 'studentId', 'sessionId', 'type']

const validBeforeCreate = async (data) => {
  return await NOTIFICATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNewNotification = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    // Sau khi validate xong thì chuyển các id sang ObjectId
    let newNotificationData = {
      ...validData,
      studentId: new ObjectId(validData.studentId),
      quizId: new ObjectId(validData.quizId),
      sessionId: new ObjectId(validData.sessionId),
      teacherId: new ObjectId(validData.teacherId)
    }

    const createdNotification = await DB_GET().collection(NOTIFICATION_COLLECTION_NAME).insertOne(newNotificationData)
    return createdNotification
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

const getNotificationById = async (id) => {
  try {
    const results = await DB_GET().collection(notificationModel.NOTIFICATION_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(id) } },
      // Join with student
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'studentId',
        foreignField: '_id',
        as: 'student',
        pipeline:[{ $project: { fullName: 1 } }]
      } },
      { $unwind: '$student' },
      // Join with quiz
      { $lookup: {
        from: quizModel.QUIZ_COLLECTION_NAME,
        localField: 'quizId',
        foreignField: '_id',
        as: 'quiz',
        pipeline:[{ $project: { title: 1 } }]
      } },
      { $unwind: '$quiz' },
      // Join with session
      { $lookup: {
        from: sessionQuizModel.SESSION_QUIZ_COLLECTION_NAME,
        localField: 'sessionId',
        foreignField: '_id',
        as: 'session',
        pipeline:[{ $project: { score: 1, totalPoints: 1 } }]
      } },
      { $unwind: '$session' },
      { $project: {
        _id: 1,
        type: 1,
        createdAt: 1,
        studentName: '$student.fullName',
        quizTitle: '$quiz.title',
        scorePercents: { $multiply: [{ $divide: ['$session.score', '$session.totalPoints'] }, 100] }
      } }
    ]).toArray()
    return results[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const getNotificationByTeacherId = async (teacherId, top = 5) => {
  try {
    // Lấy ra top 5 notification mới nhất thuộc về teacherId
    const results = await DB_GET().collection(NOTIFICATION_COLLECTION_NAME).aggregate([
      // Join với bảng users để lấy những quiz thuộc về teacherId
      { $match: {
        teacherId: new ObjectId(teacherId)
      } },
      { $sort: { createdAt: -1 } },
      { $limit: top },
      // Join với bảng users để lấy thông tin học sinh
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'studentId',
        foreignField: '_id',
        as: 'student',
        pipeline: [
          { $project: {
            fullName: 1
          } }
        ]
      } },
      { $unwind: '$student' },
      // join với bảng quizzes để lấy thông tin quiz
      { $lookup: {
        from: quizModel.QUIZ_COLLECTION_NAME,
        localField: 'quizId',
        foreignField: '_id',
        as: 'quiz',
        pipeline: [
          { $project: {
            title: 1
          } }
        ]
      } },
      { $unwind: '$quiz' },
      // join với bảng sessions để lấy thông tin session
      { $lookup: {
        from: sessionQuizModel.SESSION_QUIZ_COLLECTION_NAME,
        localField: 'sessionId',
        foreignField: '_id',
        as: 'session',
        pipeline: [
          { $project: {
            score: 1,
            totalPoints: 1
          } }
        ]
      } },
      { $unwind: '$session' },
      { $project: {
        _id: 1,
        type: 1,
        createdAt: 1,
        student: {
          fullName: 1
        },
        quiz: {
          title: 1
        },
        session: {
          score: 1,
          totalPoints: 1
        }
      } }
    ]).toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

export const notificationModel = {
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_COLLECTION_SCHEMA,
  createNewNotification,
  getNotificationById,
  getNotificationByTeacherId
}