import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const USER_ANSWER_COLLECTION_NAME = 'userAnswers'
const USER_ANSWER_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  quizId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  sessionId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  questionId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  selectedAnswerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const UNCHANGE_FIELDS = ['_id', 'createdAt']

const validBeforeCreate = async (data) => {
  return await USER_ANSWER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdUserAnswer = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME).insertOne(validData)
    return createdUserAnswer
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const userAnswer = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return userAnswer
  } catch (error) {
    throw new Error(error)
  }
}

const findByUserId = async (userId) => {
  try {
    const userAnswers = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .toArray()
    return userAnswers
  } catch (error) {
    throw new Error(error)
  }
}

const findByQuizId = async (quizId) => {
  try {
    const userAnswers = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME)
      .find({ quizId: new ObjectId(quizId) })
      .toArray()
    return userAnswers
  } catch (error) {
    throw new Error(error)
  }
}

const findByUserAndQuiz = async (userId, quizId) => {
  try {
    const userAnswers = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId), quizId: new ObjectId(quizId) })
      .toArray()
    return userAnswers
  } catch (error) {
    throw new Error(error)
  }
}

const findByQuestion = async (questionId) => {
  try {
    const userAnswers = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME)
      .find({ questionId: new ObjectId(questionId) })
      .toArray()
    return userAnswers
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (userAnswerId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    updateData.updatedAt = Date.now()

    const updateResult = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userAnswerId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOne = async (userAnswerId) => {
  try {
    const deleteResult = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(userAnswerId)
    })
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

const findBySessionAndQuestion = async (sessionId, questionId) => {
  try {
    const userAnswer = await DB_GET().collection(USER_ANSWER_COLLECTION_NAME).findOne({ sessionId: new ObjectId(sessionId), questionId: new ObjectId(questionId) })
    return userAnswer
  } catch (error) {
    throw new Error(error)
  }
}


export const userAnswerModel = {
  USER_ANSWER_COLLECTION_NAME,
  USER_ANSWER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByUserId,
  findByQuizId,
  findByUserAndQuiz,
  findByQuestion,
  update,
  deleteOne,
  findBySessionAndQuestion
}

/*
userId - ID người dùng
quizId - ID bài quiz
questionId - ID câu hỏi
selectedAnswerId - ID đáp án được chọn
isCorrect - Đúng/sai
Functions:

findByUserId() - Tất cả câu trả lời của user
findByQuizId() - Tất cả câu trả lời trong quiz
findByUserAndQuiz() - Câu trả lời của user trong 1 quiz cụ thể
findByQuestion() - Tất cả câu trả lời cho 1 câu hỏi

*/
