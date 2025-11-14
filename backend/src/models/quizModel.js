import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const QUIZ_COLLECTION_NAME = 'quizzes'
const QUIZ_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().trim().strict(),
  description: Joi.string().optional().trim().strict(),
  category: Joi.string().required().trim().strict(),
  level: Joi.string().required().trim().strict(),
  duration: Joi.number().required(),
  questionIds: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published').default('draft'),

  createdBy: Joi.string().required(),
  totalQuestions: Joi.number().default(0),
  totalPoints: Joi.number().default(0),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const UNCHANGE_FIELDS = ['_id', 'createdAt', 'createdBy']

const validBeforeCreate = async (data) => {
  return await QUIZ_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdQuiz = await DB_GET().collection(QUIZ_COLLECTION_NAME).insertOne(validData)
    return createdQuiz
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const quiz = await DB_GET().collection(QUIZ_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return quiz
  } catch (error) {
    throw new Error(error)
  }
}

const findAll = async () => {
  try {
    const quizzes = await DB_GET().collection(QUIZ_COLLECTION_NAME).find({}).toArray()
    return quizzes
  } catch (error) {
    throw new Error(error)
  }
}

const findByCreator = async (userId) => {
  try {
    const quizzes = await DB_GET().collection(QUIZ_COLLECTION_NAME).find({ createdBy: userId }).toArray()
    return quizzes
  } catch (error) {
    throw new Error(error)
  }
}

const findByStatus = async (status) => {
  try {
    const quizzes = await DB_GET().collection(QUIZ_COLLECTION_NAME).find({ status: status }).toArray()
    return quizzes
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (quizId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    updateData.updatedAt = Date.now()

    const updateResult = await DB_GET().collection(QUIZ_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(quizId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (quizId) => {
  try {
    const deleteResult = await DB_GET().collection(QUIZ_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(quizId)
    })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

export const quizModel = {
  QUIZ_COLLECTION_NAME,
  QUIZ_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findAll,
  findByCreator,
  findByStatus,
  update,
  deleteOne
}
