/* eslint-disable no-useless-catch */
import { cloneDeep } from 'lodash'
import { sessionQuizModel } from '~/models/sessionQuizModel'
import { userAnswerModel } from '~/models/userAnswerModel'
import { notificationModel } from '~/models/notificationModel'
import { quizModel } from '~/models/quizModel'
import { getSocketIo } from '~/sockets/io'

const getQuizSessionDetails = async (sessionId) => {
  try {
    //
    const sessionDetails = await sessionQuizModel.getQuizSessionDetails(sessionId)
    return sessionDetails
  } catch (error) {
    throw error
  }
}
const submitAnswers = async (sessionId, answersData, userId) => {
  try {
    // Cập nhật câu trả lời vào bảng userAnswer
    const { questionId, answerIds } = answersData
    const result = await userAnswerModel.updateBySessionAndQuestion(sessionId, questionId, {
      selectedAnswerIds: answerIds
    }, userId)
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

    // Tính số câu trả lời đúng
    let correctAnswersCount = 0

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
        correctAnswersCount += 1
      }
    })

    // Tính thời gian làm bài
    const submitTime = Date.now()
    const timeSpent = session.startTime
      ? submitTime - session.startTime
      : 0

    // Cập nhật session
    await sessionQuizModel.update(sessionId, {
      submitTime,
      score: totalScore,
      totalPoints,
      correctAnswers: correctAnswersCount,
      totalQuestions: sessionData.questions.length,
      timeSpent: Math.floor(timeSpent / 1000), // chuyển sang giây
      status: 'completed'
    })

    // Tìm quiz để lấy teacherId
    const quiz = await quizModel.findOneById(session.quizId.toString())
    if (!quiz) {
      throw new Error('Quiz not found')
    }

    // Sau khi câp nhật xong thì thêm 1 bản ghi notification, gồm cả thông tin teacherId
    const newNotification = await notificationModel.createNewNotification({
      studentId: session.userId.toString(),
      sessionId: sessionId,
      quizId: session.quizId.toString(),
      teacherId: quiz.createdBy.toString(),
      type: 'submit'
    })
    // emit kết quả notification mới cho teacher qua socket.io
    const io = getSocketIo()
    const socketData = await notificationModel.getNotificationById(newNotification.insertedId.toString())
    io.to(`teacher:${quiz.createdBy.toString()}`).emit('notification:new', socketData)

    return {
      status: 'completed'
    }
  } catch (error) {
    throw error
  }
}

const getQuizSessionResult = async (sessionId) => {
  try {
    const result = await sessionQuizModel.getQuizSessionResult(sessionId)
    const session = cloneDeep(result)
    session.questions.forEach(question => {
      question.options = session.options.filter(opt => opt.questionId.toString() === question._id.toString())
      // lấy ra mảng đáp án đúng của câu hỏi này
      const correctOptions = session.options.filter(opt => opt.questionId.toString() === question._id.toString() && opt.isCorrect)
      question.correctAnswerIds = correctOptions.map(opt => opt._id.toString())
      // Lấy ra đáp án user đã chọn
      const userAnswer = session.answers.filter(ans => ans.questionId.toString() === question._id.toString())
      if (userAnswer.length > 0) {
        question.userSelectedAnswerIds = userAnswer[0].selectedAnswerIds.map(id => id.toString())
      } else {
        question.userSelectedAnswerIds = []
      }
    })
    delete session.options
    delete session.answers
    return session
  } catch (error) {
    throw error
  }
}

export const sessionQuizService = {
  getQuizSessionDetails,
  submitAnswers,
  calculateQuizScore,
  getQuizSessionResult
}
