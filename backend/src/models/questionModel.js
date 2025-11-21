import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const QUESTION_COLLECTION_NAME = 'questions'
const QUESTION_COLLECTION_SCHEMA = Joi.object({
  content: Joi.string().required().trim().strict(),
  options: Joi.object().required(),
  correctAnswer: Joi.string().required().trim().strict(),
  level: Joi.string().required().trim().strict(),
  quizzId: Joi.string().required(),
  answerIds: Joi.array().items(Joi.string()).default([]),

  createdBy: Joi.string().optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const UNCHANGE_FIELDS = ['_id', 'createdAt']

const validBeforeCreate = async (data) => {
  return await QUESTION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdQuestion = await DB_GET().collection(QUESTION_COLLECTION_NAME).insertOne(validData)
    return createdQuestion
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const question = await DB_GET().collection(QUESTION_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return question
  } catch (error) {
    throw new Error(error)
  }
}

const findByExamId = async (examId) => {
  try {
    const questions = await DB_GET().collection(QUESTION_COLLECTION_NAME).find({ examId: examId }).toArray()
    return questions
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (questionId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    updateData.updatedAt = Date.now()

    const updateResult = await DB_GET().collection(QUESTION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(questionId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (questionId) => {
  try {
    const deleteResult = await DB_GET().collection(QUESTION_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(questionId)
    })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

export const questionModel = {
  QUESTION_COLLECTION_NAME,
  QUESTION_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByExamId,
  update,
  deleteOne
}