import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const ANSWER_OPTION_COLLECTION_NAME = 'answerOptions'
const ANSWER_OPTION_COLLECTION_SCHEMA = Joi.object({
  questionId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  quizId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().required().trim().strict(),
  isCorrect: Joi.boolean().default(false),
  // thứ tự hiển thị đap án
  tempId: Joi.number().required(), // tempId FE

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const UNCHANGE_FIELDS = ['_id', 'createdAt']

const validBeforeCreate = async (data) => {
  return await ANSWER_OPTION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)
    const insertData = {
      ...validData,
      questionId: new ObjectId(data.questionId),
      quizId: new ObjectId(data.quizId)
    }

    const createdAnswerOption = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME).insertOne(insertData)
    return createdAnswerOption
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const answerOption = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return answerOption
  } catch (error) {
    throw new Error(error)
  }
}

const findByQuestionId = async (questionId) => {
  try {
    const answerOptions = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME)
      .find({ questionId: new ObjectId(questionId) })
      .toArray()
    return answerOptions
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (answerOptionId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    updateData.updatedAt = Date.now()

    const updateResult = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(answerOptionId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (answerOptionId) => {
  try {
    const deleteResult = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(answerOptionId)
    })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteByQuestionId = async (questionId) => {
  try {
    const deleteResult = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME).deleteMany({
      questionId: new ObjectId(questionId)
    })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

const findByQuizId = async (quizId) => {
  try {
    const answerOptions = await DB_GET().collection(ANSWER_OPTION_COLLECTION_NAME)
      .find({ quizId: quizId })
      .sort({ order: 1 })
      .toArray()
    return answerOptions
  } catch (error) {
    throw new Error(error)
  }
}

export const answerOptionModel = {
  ANSWER_OPTION_COLLECTION_NAME,
  ANSWER_OPTION_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByQuestionId,
  findByQuizId,
  update,
  deleteOne,
  deleteByQuestionId
}
