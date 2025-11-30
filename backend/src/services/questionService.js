/* eslint-disable no-useless-catch */
// import { cloneDeep } from 'lodash'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { quizModel } from '~/models/quizModel'
import { questionModel } from '~/models/questionModel'
import { answerOptionModel } from '~/models/answerModel'
import { optionService } from './optionService'


const updateQuestionsInBatch = async (quizId, questions) => {
  try {
    const quiz = await quizModel.findOneById(quizId)
    if (!quiz) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Quiz not found')
    }

    // Lấy danh sách question IDs hiện tại trong database
    const existingQuestionIds = quiz.questionOrderIds.map(id => id.toString())

    // Lấy danh sách question IDs được gửi từ frontend
    const incomingQuestionIds = questions
      .filter(q => q._id)
      .map(q => q._id.toString())

    // Tìm questions bị xóa (có trong DB nhưng không có trong request)
    const deletedQuestionIds = existingQuestionIds.filter(
      id => !incomingQuestionIds.includes(id)
    )

    // Xóa các questions bị xóa
    for (const questionId of deletedQuestionIds) {
      // Xóa tất cả options của question này
      await answerOptionModel.deleteByQuestionId(questionId)

      // Xóa question
      await questionModel.deleteOne(questionId)

      // Xóa questionId khỏi quiz
      await quizModel.pullQuestionIds({ _id: questionId, quizId })
    }

    // Xử lý create và update questions
    for (const q of questions) {
      if (q._id) {
        // câu hỏi đã có, update
        await questionModel.update(
          q._id,
          { content: q.content, type: q.type, points: q.points, tempId: q.tempId }
        )

        // Lấy danh sách option IDs hiện tại của question này
        const existingOptions = await answerOptionModel.findByQuestionId(q._id)
        const existingOptionIds = existingOptions.map(opt => opt._id.toString())

        // Lấy danh sách option IDs được gửi từ frontend
        const incomingOptionIds = q.options
          .filter(opt => opt._id)
          .map(opt => opt._id.toString())

        // Tìm options bị xóa
        const deletedOptionIds = existingOptionIds.filter(
          id => !incomingOptionIds.includes(id)
        )

        // Xóa các options bị xóa
        for (const optionId of deletedOptionIds) {
          await answerOptionModel.deleteOne(optionId)
          await questionModel.pullOptionIds({ _id: optionId, questionId: q._id })
        }

        // Xử lý options của question
        for (const opt of q.options) {
          if (opt._id) {
            // option đã có, update
            await answerOptionModel.update(
              opt._id,
              { content: opt.content, isCorrect: opt.isCorrect, tempId: opt.tempId }
            )
          } else {
            // option mới, tạo mới
            await optionService.createNew({
              questionId: q._id.toString(),
              quizId,
              content: opt.content,
              isCorrect: opt.isCorrect,
              tempId: opt.tempId
            })
          }
        }
      } else {
        // câu hỏi mới
        const createdQuestion = await questionModel.createNew({
          quizId,
          content: q.content,
          type: q.type,
          points: q.points,
          tempId: q.tempId, // tempId FE
          createdAt: new Date()
        })
        const question = await questionModel.findOneById(createdQuestion.insertedId)
        await quizModel.pushQuestionIds(question)
        await Promise.all(q.options.map(async (opt) => {
          await optionService.createNew({
            questionId: createdQuestion.insertedId.toString(),
            quizId,
            content: opt.content,
            isCorrect: opt.isCorrect,
            tempId: opt.tempId // tempId FE
          })
        }))
      }
    }
  } catch (error) {
    throw error
  }
}

const createNew = async (quizId, data) => {
  try {
    const result = await questionModel.createNew({
      quizId: quizId,
      content: data.content,
      type: data.type,
      points: data.points,
      tempId: data.tempId // tempId FE
    })
    const question = await questionModel.findOneById(result.insertedId)
    await quizModel.pushQuestionIds(question)
    await Promise.all(data.options.map(async (opt) => {
      await optionService.createNew({
        questionId: question._id.toString(),
        quizId,
        content: opt.content,
        isCorrect: opt.isCorrect,
        tempId: opt.tempId // tempId FE

      })
    }))
    return result
  } catch (error) {
    throw error
  }
}


export const questionService = {
  updateQuestionsInBatch,
  createNew
}
