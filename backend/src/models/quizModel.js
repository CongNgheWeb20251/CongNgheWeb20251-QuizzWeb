import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { questionModel } from './questionModel'
import { answerOptionModel } from './answerModel'
import { pagingSkipValue } from '~/utils/algorithms'

const QUIZ_COLLECTION_NAME = 'quizzes'
const QUIZ_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().trim().strict(),
  description: Joi.string().optional().trim().strict(),
  category: Joi.string().required().trim().strict(),
  level: Joi.string().required().trim().strict(),
  questionIds: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published').default('draft'),

  createdBy: Joi.string().required(),
  totalQuestions: Joi.number(),
  totalPoints: Joi.number(),
  passingScore: Joi.number().required(),
  timeLimit: Joi.number().required(),

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

    const createdQuiz = await DB_GET().collection(QUIZ_COLLECTION_NAME).insertOne({ ...validData, createdBy: new ObjectId(data.createdBy) })
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

const getDetails = async (userId, quizId) => {
  const queryConditions = [
    { _id: new ObjectId(quizId) },
    // Dk1 board chua xoa
    { _destroy: false },
    { $or: [
      { createdBy: new ObjectId(userId) }
      // { memberIds: { $all: [new ObjectId(userId)] } }
    ] }
  ]
  try {
    const quizz = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $lookup: {
        from: questionModel.QUESTION_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizzId',
        as: 'questions'
      } },
      { $lookup: {
        from: answerOptionModel.ANSWER_OPTION_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizzId',
        as: 'answerOptions'
      } }
    ]).toArray()
    return quizz[0] || null
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

const getQuizzes = async (userId, page, itemsPerPage, filter) => {
  try {
    //
    const queryConditions = [
      // Dk1 board thuoc ve userId (member or owner)
      { $or: [
        { createdBy: new ObjectId(userId) }
        // { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]

    // filter status
    if (filter && filter !== 'all') {
      queryConditions.push({ status: filter })
    }

    const query = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $sort: { title : 1 } },
      // Xử lí nhiều luồng
      { $facet: {
        // 1 query quizzes
        'queryQuizzes': [
          { $skip: pagingSkipValue(page, itemsPerPage) }, // bỏ qua số lượng bản ghi của những page trước đó
          { $limit: itemsPerPage }, // giới hạn tối đa số lượng bản ghi trả về trên 1 page
          // Lookup questions để đếm số câu hỏi
          { $lookup: {
            from: questionModel.QUESTION_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'quizzId',
            as: 'questions'
          } },
          // Thêm field questionsCount
          { $addFields: {
            questionsCount: { $size: '$questions' }
          } },
          // Loại bỏ array questions để giảm data trả về
          { $project: { questions: 0 } }
        ],
        // 2 query total count
        'queryCountTotalQuizzes': [
          { $count: 'totalQuizzes' }
        ]

      } }
    ]).toArray()
    const res = query[0]
    return {
      quizzes: res.queryQuizzes || [],
      totalQuizzes: res.queryCountTotalQuizzes[0]?.totalQuizzes || 0
    }
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
  deleteOne,
  getDetails,
  getQuizzes
}
