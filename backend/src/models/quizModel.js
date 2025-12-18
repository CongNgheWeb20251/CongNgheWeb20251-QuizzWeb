import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { questionModel } from './questionModel'
import { answerOptionModel } from './answerModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { sessionQuizModel } from './sessionQuizModel'

const QUIZ_COLLECTION_NAME = 'quizzes'
const QUIZ_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().trim().strict(),
  description: Joi.string().optional().trim().strict(),
  category: Joi.string().required().trim().strict(),
  level: Joi.string().required().trim().strict(),
  questionOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  status: Joi.string().valid('draft', 'published').default('draft'),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdBy: Joi.string().required(),
  totalQuestions: Joi.number(),
  totalPoints: Joi.number(),
  passingScore: Joi.number().required(),
  timeLimit: Joi.number().required(),
  // shuffleQuestions: Joi.boolean().default(false),
  allowRetake: Joi.boolean().default(true),
  showResults: Joi.boolean().default(true),
  startTime: Joi.date().timestamp('javascript'),
  endTime: Joi.date().timestamp('javascript'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  inviteToken: Joi.string().optional().trim().strict()
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
    { $or: [
      { createdBy: new ObjectId(userId) },
      { memberIds: { $all: [new ObjectId(userId)] } }
    ] }
  ]
  try {
    const quizz = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $lookup: {
        from: questionModel.QUESTION_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizId',
        as: 'questions',
        pipeline: [
          { $project: { createdAt: 0, updatedAt: 0, quizId: 0, correctAnswerIds: 0 } }
        ]
      } },
      { $lookup: {
        from: answerOptionModel.ANSWER_OPTION_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizId',
        as: 'options',
        pipeline: [
          { $project: { createdAt: 0, updatedAt: 0, quizId: 0 } }
        ]
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

const getQuizzes = async (userId, page, itemsPerPage, filter, search) => {
  try {
    //
    const queryConditions = [
      // Dk1 board thuoc ve userId (owner)
      { $or: [
        { createdBy: new ObjectId(userId) }
      ] }
    ]

    // filter status
    if (filter && filter !== 'all') {
      queryConditions.push({ status: filter })
    }
    // full text search
    if (search && search.trim() !== '') {
      queryConditions.push({
        $text: { $search: search.trim() }
      })
    }

    const query = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $sort: { title : 1 } },
      // Lấy số lượng completed của mỗi quiz
      { $lookup: {
        from: sessionQuizModel.SESSION_QUIZ_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizId',
        as: 'sessions',
        pipeline: [
          { $project: { createdAt: 0, updatedAt: 0, quizId: 0 } },
          { $match: { status: 'completed' } }
        ]
      } },
      { $addFields: {
        completedCount: { $size: '$sessions' }
      } },
      { $project: { sessions: 0 } },
      // Xử lí nhiều luồng
      { $facet: {
        // 1 query quizzes
        'queryQuizzes': [
          { $skip: pagingSkipValue(page, itemsPerPage) }, // bỏ qua số lượng bản ghi của những page trước đó
          { $limit: itemsPerPage } // giới hạn tối đa số lượng bản ghi trả về trên 1 page
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

// Thêm questionId vào mảng questionOrderIds của quiz
const pushQuestionIds = async (question) => {
  try {
    const updateResult = await DB_GET().collection(QUIZ_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(question.quizId) },
      { $push: { questionOrderIds: new ObjectId(question._id) } },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa questionId khỏi mảng questionOrderIds của quiz
const pullQuestionIds = async (question) => {
  try {
    const updateResult = await DB_GET().collection(QUIZ_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(question.quizId) },
      { $pull: { questionOrderIds: new ObjectId(question._id) } },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const getQuizzesStats = async (userId) => {
  try {
    const queryConditions = [
      { $or: [
        { createdBy: new ObjectId(userId) }
      ] }
    ]

    const stats = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $facet: {
        'totalQuizzes': [
          { $count: 'count' }
        ],
        'publishedQuizzes': [
          { $match: { status: 'published' } },
          { $count: 'count' }
        ],
        'draftQuizzes': [
          { $match: { status: 'draft' } },
          { $count: 'count' }
        ]
      } }
    ]).toArray()

    const result = stats[0]
    return {
      totalQuizzes: result.totalQuizzes[0]?.count || 0,
      publishedQuizzes: result.publishedQuizzes[0]?.count || 0,
      draftQuizzes: result.draftQuizzes[0]?.count || 0
    }
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Phải tạo index text cho các trường cần tìm kiếm trong ProductModel trước khi sử dụng hàm này
 * Đây là cách sử dụng tính năng Full-Text Search của MongoDB
 * Ví dụ: name: tuan pro 123 thì có thể search với keySearch = 'tuan' hoặc 'pro' hoặc '123', tương tự với product_description
 * @returns
 */

const getQuizzesByStudent = async (userId, page, itemsPerPage, search) => {
  try {
    const queryConditions = [
      { memberIds: { $all: [new ObjectId(userId)] } }
    ]
    // Thêm điều kiện search nếu có
    if (search && search.trim() !== '') {
      queryConditions.push({
        $text: { $search: search.trim() }
      })
    }

    // Build queryQuizzes pipeline
    const queryQuizzesPipeline = []

    // Nếu có search thì reset về page 1, nếu không thì dùng page từ params
    const currentPage = (search && search.trim() !== '') ? 1 : page

    queryQuizzesPipeline.push(
      { $skip: pagingSkipValue(currentPage, itemsPerPage) }, // bỏ qua số lượng bản ghi của những page trước đó
      { $limit: itemsPerPage } // giới hạn tối đa số lượng bản ghi trả về trên 1 page
    )

    // Thêm các lookup operations
    queryQuizzesPipeline.push(
      { $lookup: {
        from: sessionQuizModel.SESSION_QUIZ_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizId',
        as: 'sessions',
        pipeline: [
          { $project: { createdAt: 0, updatedAt: 0, quizId: 0 } },
          { $match: { userId: new ObjectId(userId) } },
          {
            $addFields: {
              statusPriority: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$status', 'doing'] }, then: 3 },
                    { case: { $eq: ['$status', 'completed'] }, then: 2 }
                  ],
                  default: 0
                }
              }
            }
          },
          { $sort: { statusPriority: -1, submitTime: -1 } },
          { $limit: 1 }
        ]
      } },
      // Thêm field sessionsCount
      { $addFields: {
        sessionsCount: { $size: '$sessions' },
        lastSession: { $arrayElemAt: ['$sessions', 0] }
      } },
      // Loại bỏ array sessions để giảm data trả về
      { $project: { status: 0, sessions: 0 } }
    )

    const query = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $sort: { title : 1 } },
      // Xử lí nhiều luồng
      { $facet: {
        // 1 query quizzes
        'queryQuizzes': queryQuizzesPipeline,
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

// Tìm quiz theo inviteToken
const findOneByInviteToken = async (inviteToken) => {
  try {
    const quiz = await DB_GET().collection(QUIZ_COLLECTION_NAME).findOne({ inviteToken: inviteToken })
    return quiz
  } catch (error) {
    throw new Error(error)
  }
}

// Thêm userId vào mảng memberIds của quiz
const addMemberToQuiz = async (quizId, userId) => {
  try {
    // Kiểm tra xem userId đã tồn tại trong memberIds chưa
    const quiz = await findOneById(quizId)
    if (!quiz) {
      throw new Error('Quiz not found')
    }

    // Nếu user đã là member rồi thì không thêm nữa
    const isMember = quiz.memberIds.some(memberId => memberId.toString() === userId.toString())
    if (isMember) {
      return quiz
    }

    const updateResult = await DB_GET().collection(QUIZ_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(quizId) },
      { $push: { memberIds: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const getSessionsByUserAndQuiz = async (userId, quizId) => {
  try {
    const sessions = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(quizId) } },
      { $lookup: {
        from: sessionQuizModel.SESSION_QUIZ_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'quizId',
        as: 'sessions',
        pipeline: [
          { $project: { createdAt: 0, updatedAt: 0, quizId: 0 } },
          { $match: { userId: new ObjectId(userId) } },
          { $sort: { startTime: -1 } }
        ]
      } },
      { $project: { category: 0, createdAt: 0, updatedAt: 0, status: 0, memberIds: 0, questionOrderIds: 0, level: 0, createdBy: 0 } }
    ]).toArray()
    return sessions[0] || []
  } catch (error) {
    throw new Error(error)
  }
}

const getQuizMetrics = async (quizId) => {
  try {
    const result = await DB_GET().collection(QUIZ_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(quizId) } },
      {
        $lookup: {
          from: sessionQuizModel.SESSION_QUIZ_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'quizId',
          as: 'sessions'
        }
      },
      {
        $facet: {
          quizInfo: [
            {
              $project: {
                passingScore: 1
              }
            }
          ],
          students: [
            {
              $project: {
                totalStudents: { $size: '$memberIds' }
              }
            }
          ],
          stats: [
            { $unwind: '$sessions' },
            {
              $addFields: {
                isCompleted: { $eq: ['$sessions.status', 'completed'] },
                scorePercentage: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$sessions.status', 'completed'] },
                        { $gt: ['$sessions.totalPoints', 0] }
                      ]
                    },
                    {
                      $multiply: [
                        {
                          $divide: [
                            '$sessions.score',
                            '$sessions.totalPoints'
                          ]
                        },
                        100
                      ]
                    },
                    null
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                passingScore: { $first: '$passingScore' },
                totalAttempts: { $sum: 1 },
                completedUsers: {
                  $addToSet: {
                    $cond: ['$isCompleted', '$sessions.userId', null]
                  }
                },
                passedUsers: {
                  $addToSet: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$scorePercentage', null] },
                          { $gte: ['$scorePercentage', '$passingScore'] }
                        ]
                      },
                      '$sessions.userId',
                      null
                    ]
                  }
                },
                scores: { $push: '$scorePercentage' }
              }
            },
            {
              $project: {
                passingScore: 1,
                totalAttempts: 1,
                completedStudents: {
                  $size: {
                    $filter: {
                      input: '$completedUsers',
                      as: 'u',
                      cond: { $ne: ['$$u', null] }
                    }
                  }
                },
                passedStudents: {
                  $size: {
                    $filter: {
                      input: '$passedUsers',
                      as: 'u',
                      cond: { $ne: ['$$u', null] }
                    }
                  }
                },
                scores: {
                  $filter: {
                    input: '$scores',
                    as: 's',
                    cond: { $ne: ['$$s', null] }
                  }
                }
              }
            },
            {
              $addFields: {
                avgScore: { $avg: '$scores' },
                highestScore: { $max: '$scores' }
              }
            }
          ]
        }
      },
      {
        $project: {
          passingScore: {
            $ifNull: [{ $arrayElemAt: ['$quizInfo.passingScore', 0] }, 0]
          },
          totalStudents: {
            $ifNull: [{ $arrayElemAt: ['$students.totalStudents', 0] }, 0]
          },
          totalAttempts: {
            $ifNull: [{ $arrayElemAt: ['$stats.totalAttempts', 0] }, 0]
          },
          completedStudents: {
            $ifNull: [{ $arrayElemAt: ['$stats.completedStudents', 0] }, 0]
          },
          passedStudents: {
            $ifNull: [{ $arrayElemAt: ['$stats.passedStudents', 0] }, 0]
          },
          avgScore: {
            $round: [
              { $ifNull: [{ $arrayElemAt: ['$stats.avgScore', 0] }, 0] },
              0
            ]
          },
          highestScore: {
            $round: [
              { $ifNull: [{ $arrayElemAt: ['$stats.highestScore', 0] }, 0] },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          passRate: {
            $cond: [
              { $gt: ['$completedStudents', 0] },
              {
                $multiply: [
                  { $divide: ['$passedStudents', '$completedStudents'] },
                  100
                ]
              },
              0
            ]
          }
        }
      }
    ]).toArray()
    return (
      result[0] || null
    )
  } catch (error) {
    throw new Error(error)
  }
}

export const quizModel = {
  QUIZ_COLLECTION_NAME,
  QUIZ_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByCreator,
  findByStatus,
  update,
  deleteOne,
  getDetails,
  getQuizzes,
  pushQuestionIds,
  pullQuestionIds,
  getQuizzesStats,
  getQuizzesByStudent,
  findOneByInviteToken,
  addMemberToQuiz,
  getSessionsByUserAndQuiz,
  getQuizMetrics
}
