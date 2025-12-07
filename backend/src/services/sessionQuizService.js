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

export const sessionQuizService = {
  getQuizSessionDetails,
  submitAnswers
}
