import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { userAnswerModel } from './userAnswerModel'
import { answerOptionModel } from './answerModel'
import { questionModel } from './questionModel'
import { quizModel } from './quizModel'

const SESSION_QUIZ_COLLECTION_NAME = 'sessionQuizzes'
const SESSION_QUIZ_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  quizId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  // Thời gian
  timeSpent: Joi.number(), // tính theo giây
  startTime: Joi.number(),
  submitTime: Joi.date().timestamp('javascript'),
  endTime: Joi.number(),

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

    const createdResult = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).insertOne({
      ...validData,
      userId: new ObjectId(data.userId),
      quizId: new ObjectId(data.quizId)
    })
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
      .find({ userId: new ObjectId(userId) })
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
      .find({ quizId: new ObjectId(quizId) })
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
      .find({ userId: new ObjectId(userId), quizId: new ObjectId(quizId) })
      .sort({ createdAt: -1 })
      .toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (sessionId, updateData) => {
  try {
    Object.keys(updateData).forEach(key => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    const result = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(sessionId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getQuizSessionDetails = async (sessionId) => {
  try {
    // lấy cả thông tin các câu hỏi đã làm trong session
    /*
      {
        "sessionId": "abc",
        "userId": "...",
        "quizId": "...",
        "startTime": 171000000,
        "endTime": 171003600,
        "status": "doing",
        "answers": [
          {
            "questionId": "q1",
            "selectedAnswerIds": ["optA"]
          },
          {
            "questionId": "q2",
            "selectedAnswerIds": []
          }
        ]
      }
    */
    const session = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(sessionId) } },
      {
        $lookup: {
          from: userAnswerModel.USER_ANSWER_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'sessionId',
          as: 'answers',
          pipeline: [
            {
              $project: {
                _id: 0,
                questionId: 1,
                selectedAnswerIds: 1
              }
            }
          ]
        }
      }
    ]).toArray()
    if (!session || session.length === 0) return null
    return session[0]
  } catch (error) {
    throw new Error(error)
  }
}

const calculateQuizScore = async (sessionId) => {
  try {
    // lấy cả thông tin các câu hỏi đã làm trong session
    /*
      {
        "sessionId": "abc",
        "userId": "...",
        "quizId": "...",
        "startTime": 171000000,
        "endTime": 171003600,
        "status": "doing",
        "answers": [
          {
            "questionId": "q1",
            "selectedAnswerIds": ["optA"]
          },
          {
            "questionId": "q2",
            "selectedAnswerIds": []
          }
        ],
        "trueOptions": [
          {
            "_id": "optA",
            "questionId": "q1",
            "isCorrect": true
          },
        ],
        "questions": [
          {
            "_id": "q1",
            "points": 10
          },
          {
            "_id": "q2",
            "points": 20
          }
        ]
      }
    */
    const session = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(sessionId) } },
      {
        $lookup: {
          from: userAnswerModel.USER_ANSWER_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'sessionId',
          as: 'answers',
          pipeline: [
            {
              $project: {
                _id: 0,
                questionId: 1,
                selectedAnswerIds: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: answerOptionModel.ANSWER_OPTION_COLLECTION_NAME,
          localField: 'answers.questionId',
          foreignField: 'questionId',
          as: 'trueOptions',
          pipeline: [
            {
              $match: { isCorrect: true }
            },
            {
              $project: {
                _id: 1,
                questionId: 1,
                isCorrect: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: questionModel.QUESTION_COLLECTION_NAME,
          localField: 'quizId',
          foreignField: 'quizId',
          as: 'questions',
          pipeline: [
            {
              $project: {
                _id: 1,
                points: 1
              }
            }
          ]
        }
      }
    ]).toArray()
    if (!session || session.length === 0) return null
    return session[0]
  } catch (error) {
    throw new Error(error)
  }
}

const getQuizSessionResult = async (sessionId) => {
  try {
    const session = await DB_GET().collection(SESSION_QUIZ_COLLECTION_NAME).aggregate([
      { $match: { _id: new ObjectId(sessionId) } },
      {
        $lookup: {
          from: userAnswerModel.USER_ANSWER_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'sessionId',
          as: 'answers',
          pipeline: [
            {
              $project: {
                _id: 0,
                questionId: 1,
                selectedAnswerIds: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: quizModel.QUIZ_COLLECTION_NAME,
          localField: 'quizId',
          foreignField: '_id',
          as: 'quizInfo',
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                passingScore: 1,
                timeLimit: 1,
                allowRetake: 1,
                showResults: 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$quizInfo'
      },
      {
        $lookup: {
          from: questionModel.QUESTION_COLLECTION_NAME,
          // có thể dùng let và pipeline để lọc dữ liệu nâng cao hơn nếu localField ngừng sp pipeline
          let: { quizId: '$quizId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$quizId', '$$quizId']
                }
              }
            },
            {
              $project: {
                _id: 1,
                points: 1,
                content: 1,
                type: 1
              }
            }
          ],
          as: 'questions'
        }
      },
      {
        $lookup: {
          from: answerOptionModel.ANSWER_OPTION_COLLECTION_NAME,
          localField: 'quizId',
          foreignField: 'quizId',
          as: 'options',
          pipeline: [
            {
              $project: {
                _id: 1,
                questionId: 1,
                isCorrect: 1,
                content: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          createdAt: 0,
          startTime: 0,
          submitTime: 0,
          endTime: 0,
          updatedAt: 0,
          userId: 0
        }
      }
    ]).toArray()
    if (!session || session.length === 0) return null
    return session[0]
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
  findByUserAndQuiz,
  update,
  getQuizSessionDetails,
  calculateQuizScore,
  getQuizSessionResult

}
