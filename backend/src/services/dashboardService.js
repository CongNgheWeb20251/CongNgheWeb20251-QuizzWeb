/* eslint-disable no-useless-catch */
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const getDashboardStats = async (teacherId) => {
  try {
    const db = DB_GET()
    const teacherObjectId = new ObjectId(teacherId)

    const [totalQuizzes, studentsAgg, completionAgg] = await Promise.all([
      db.collection('quizzes').countDocuments({ createdBy: teacherObjectId }),
      db.collection('quizzes').aggregate([
        { $match: { createdBy: teacherObjectId } },
        { $project: { memberIds: 1 } },
        { $unwind: { path: '$memberIds', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$memberIds' } },
        { $count: 'count' }
      ]).toArray(),
      db.collection('sessionQuizzes').aggregate([
        {
          $lookup: {
            from: 'quizzes',
            let: { quizId: '$quizId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$quizId'] },
                      { $eq: ['$createdBy', teacherObjectId] }
                    ]
                  }
                }
              },
              { $project: { _id: 1 } }
            ],
            as: 'quiz'
          }
        },
        { $unwind: '$quiz' },
        { $group: { _id: null, totalSessions: { $sum: 1 }, completedSessions: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } }
      ]).toArray()
    ])

    const totalStudents = studentsAgg[0]?.count || 0
    const totalSessions = completionAgg[0]?.totalSessions || 0
    const completedSessions = completionAgg[0]?.completedSessions || 0
    const avgCompletionValue = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0

    return {
      totalQuizzes: { value: totalQuizzes, change: '+0%', isPositive: true },
      totalStudents: { value: totalStudents, change: '+0%', isPositive: true },
      avgCompletion: { value: avgCompletionValue, change: '+0%', isPositive: true }
    }
  } catch (error) {
    throw error
  }
}

const getTopStudents = async (teacherId, limit) => {
  try {
    const db = DB_GET()
    const teacherObjectId = new ObjectId(teacherId)
    const parsedLimit = Number(limit) || 5

    const topStudents = await db.collection('sessionQuizzes').aggregate([
      { $match: { startTime: { $exists: true, $ne: null } } },
      { $sort: { startTime: -1 } },
      {
        $lookup: {
          from: 'quizzes',
          let: { quizId: '$quizId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$quizId'] },
                    { $eq: ['$createdBy', teacherObjectId] }
                  ]
                }
              }
            },
            { $project: { title: 1, category: 1 } }
          ],
          as: 'quiz'
        }
      },
      { $unwind: '$quiz' },
      {
        $group: {
          _id: '$userId',
          latestCategory: { $first: '$quiz.category' },
          totalScore: { $sum: { $ifNull: ['$score', 0] } },
          totalPoints: { $sum: { $ifNull: ['$totalPoints', 0] } },
          completedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          attempts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $project: { fullName: 1, username: 1 } }
          ]
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          score: {
            $cond: [
              { $gt: ['$totalPoints', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalScore', '$totalPoints'] },
                      100
                    ]
                  },
                  0
                ]
              },
              0
            ]
          },
          name: { $ifNull: ['$user.fullName', '$user.username'] },
          subject: { $ifNull: ['$latestCategory', 'General'] }
        }
      },
      { $project: { _id: 0, name: 1, subject: 1, score: 1 } },
      { $sort: { score: -1, completedCount: -1, attempts: -1 } },
      { $limit: parsedLimit }
    ]).toArray()

    return topStudents
  } catch (error) {
    throw error
  }
}

const getTopPerformingQuizzes = async (teacherId, limit) => {
  try {
    const db = DB_GET()
    const teacherObjectId = new ObjectId(teacherId)
    const parsedLimit = Number(limit) || 3

    const quizzes = await db.collection('quizzes').aggregate([
      // Bắt đầu từ tất cả quizzes của teacher
      { $match: { createdBy: teacherObjectId } },
      // Lookup các session completed của từng quiz
      {
        $lookup: {
          from: 'sessionQuizzes',
          let: { quizId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$quizId', '$$quizId'] },
                    { $eq: ['$status', 'completed'] }
                  ]
                }
              }
            },
            { $count: 'total' }
          ],
          as: 'completionData'
        }
      },
      // Tính số students và completions (có thể = 0)
      {
        $addFields: {
          students: { $size: { $ifNull: ['$memberIds', []] } },
          completions: {
            $ifNull: [
              { $arrayElemAt: ['$completionData.total', 0] },
              0
            ]
          }
        }
      },
      // Sort theo completions trước, nếu bằng nhau thì theo students
      { $sort: { completions: -1, students: -1 } },
      { $limit: parsedLimit },
      {
        $project: {
          _id: { $toString: '$_id' },
          title: 1,
          subject: { $ifNull: ['$category', 'General'] },
          students: 1,
          completions: 1
        }
      }
    ]).toArray()

    return quizzes
  } catch (error) {
    throw error
  }
}

const getRecentQuizzesByTeacher = async (teacherId, limit) => {
  const db = DB_GET()
  const teacherObjectId = new ObjectId(teacherId)
  const parsedLimit = Number(limit) || 5

  const result = await db.collection('sessionQuizzes').aggregate([
    // Only sessions with a start time
    { $match: { startTime: { $exists: true, $ne: null } } },
    // Sort sessions by most recent activity first so $first in group is latest
    { $sort: { startTime: -1 } },
    // Attach quiz owned by teacher
    {
      $lookup: {
        from: 'quizzes',
        let: { quizId: '$quizId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$quizId'] },
                  { $eq: ['$createdBy', teacherObjectId] }
                ]
              }
            }
          },
          {
            $project: {
              title: 1,
              status: 1,
              memberIds: 1,
              totalQuestions: 1
            }
          }
        ],
        as: 'quiz'
      }
    },
    { $unwind: '$quiz' },
    // Group by quiz to aggregate attempts and pick latest session info
    {
      $group: {
        _id: '$quiz._id',
        quizTitle: { $first: '$quiz.title' },
        quizStatus: { $first: '$quiz.status' },
        totalStudents: { $first: { $size: { $ifNull: ['$quiz.memberIds', []] } } },
        totalQuestions: { $first: { $ifNull: ['$totalQuestions', 0] } },
        latestSessionStatus: { $first: '$status' },
        latestStartTime: { $first: '$startTime' },
        attempts: { $sum: 1 }
      }
    },
    { $sort: { latestStartTime: -1 } },
    { $limit: parsedLimit },
    {
      $project: {
        _id: 0,
        quizId: { $toString: '$_id' },
        quizTitle: 1,
        quizStatus: 1,
        totalStudents: 1,
        totalQuestions: 1,
        latestSessionStatus: 1,
        latestStartTime: 1,
        attempts: 1
      }
    }
  ]).toArray()

  return result
}

export const dashboardService = {
  getDashboardStats,
  getTopStudents,
  getTopPerformingQuizzes,
  getRecentQuizzesByTeacher
}
