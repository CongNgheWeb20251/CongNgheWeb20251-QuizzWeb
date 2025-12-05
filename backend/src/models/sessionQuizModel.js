import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const SESSION_QUIZ_COLLECTION_NAME = 'sessionQuizzes'
const SESSION_QUIZ_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  quizId: Joi.string().required(),

  // Thời gian
  timeSpent: Joi.number().required(), // tổng thời gian làm bài (giây)
  startTime: Joi.date().timestamp('javascript'),
  submitTime: Joi.date().timestamp('javascript'),
  endTime: Joi.date().timestamp('javascript'),

  // Điểm số
  score: Joi.number(), // điểm đạt được
  totalPoints: Joi.number(), // tổng điểm số


  //Trạng thái
  status: Joi.string().valid('completed', 'doing', 'timeout').default('doing'),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const UNCHANGE_FIELDS = ['_id', 'createdAt', 'userId', 'quizId']

const validBeforeCreate = async (data) => {
  return await SESSION_QUIZ_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdResult = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).insertOne(validData)
    return createdResult
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findByUserId = async (userId) => {
  try {
    const results = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME)
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
    const results = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME)
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
    const results = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME)
      .find({ userId: userId, quizId: quizId })
      .sort({ createdAt: -1 })
      .toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

export const sessionQuizModel = {
  SESSION_QUIZ_COLLECTION_NAME,
  SESSION_QUIZ_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByUserId,
  findByQuizId,
  findByUserAndQuiz

}
