/* eslint-disable no-useless-catch */
import { sessionQuizModel } from '~/models/sessionQuizModel'
import { userAnswerModel } from '~/models/userAnswerModel'

const getQuizSessionDetails = async (sessionId) => {
  try {
    //
    const sessionDetails = await sessionQuizModel.getQuizSessionDetails(sessionId)
    return sessionDetails
  } catch (error) {
    throw error
  }
}
const submitAnswers = async (sessionId, answersData) => {
  try {
    // Cập nhật câu trả lời vào bảng userAnswer
    const { questionId, answerIds } = answersData
    const result = await userAnswerModel.updateBySessionAndQuestion(sessionId, questionId, {
      selectedAnswerIds: answerIds
    })
    return result

  } catch (error) {
    throw error
  }
}

const calculateQuizScore = async (sessionId) => {
  try {
    // Lấy thông tin session
    const session = await sessionQuizModel.findOneById(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Kiểm tra nếu session đã được submit rồi
    if (session.status === 'completed') {
      return { message: 'Session already submitted' }
    }

    // Lấy thông tin chi tiết để tính điểm
    const sessionData = await sessionQuizModel.calculateQuizScore(sessionId)

    // Tạo map để tra cứu nhanh các đáp án đúng theo questionId
    const correctOptionsMap = new Map()
    sessionData.trueOptions.forEach(opt => {
      const qId = opt.questionId.toString()
      if (!correctOptionsMap.has(qId)) {
        correctOptionsMap.set(qId, [])
      }
      correctOptionsMap.get(qId).push(opt._id.toString())
    })

    const questionsMap = new Map()
    let totalPoints = 0
    sessionData.questions.forEach(q => {
      questionsMap.set(q._id.toString(), q)
      totalPoints += q.points
    })

    // Tính điểm
    let totalScore = 0

    sessionData.answers.forEach(answer => {
      const questionId = answer.questionId.toString()
      const question = questionsMap.get(questionId)
      if (!question) return

      // Lấy tất cả options đúng của câu hỏi này
      const correctOptions = correctOptionsMap.get(questionId) || []

      // Lấy các đáp án user đã chọn
      const selectedAnswerIds = answer.selectedAnswerIds.map(id => id.toString())

      // Kiểm tra user có trả lời đúng không
      // Đúng khi: chọn đủ tất cả đáp án đúng và không chọn đáp án sai
      const isCorrect =
        correctOptions.length === selectedAnswerIds.length &&
        correctOptions.every(id => selectedAnswerIds.includes(id)) &&
        selectedAnswerIds.every(id => correctOptions.includes(id))

      if (isCorrect) {
        totalScore += question.points
      }
    })

    // Tính thời gian làm bài
    const submitTime = Date.now()
    const timeSpent = session.startTime
      ? submitTime - session.startTime
      : 0

    // Cập nhật session
    const updatedSession = await sessionQuizModel.update(sessionId, {
      submitTime,
      score: totalScore,
      totalPoints,
      timeSpent: Math.floor(timeSpent / 1000), // chuyển sang giây
      status: 'completed'
    })

    return {
      score: totalScore,
      totalPoints,
      timeSpent,
      status: 'completed',
      session: updatedSession
    }
  } catch (error) {
    throw error
  }
}

export const sessionQuizService = {
  getQuizSessionDetails,
  submitAnswers,
  calculateQuizScore
}
