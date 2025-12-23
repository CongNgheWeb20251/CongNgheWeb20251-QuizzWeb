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
          { content: q.content, type: q.type, points: q.points }
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
              { content: opt.content, isCorrect: opt.isCorrect }
            )
          } else {
            // option mới, tạo mới, trong hàm tạo mới này đã xử lí push optionId vào question
            await optionService.createNew({
              questionId: q._id.toString(),
              quizId,
              content: opt.content,
              isCorrect: opt.isCorrect
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
          createdAt: new Date()
        })
        const question = await questionModel.findOneById(createdQuestion.insertedId)
        await quizModel.pushQuestionIds(question)
        await Promise.all(q.options.map(async (opt) => {
          await optionService.createNew({
            questionId: createdQuestion.insertedId.toString(),
            quizId,
            content: opt.content,
            isCorrect: opt.isCorrect
          })
        }))
      }
    }
  } catch (error) {
    throw error
  }
}

const createNew = async (data) => {
  try {
    const result = await questionModel.createNew({
      quizId: data.quizId,
      content: data.content,
      type: data.type,
      points: data.points
    })

    const question = await questionModel.findOneById(result.insertedId)
    // push vào quiz
    await quizModel.pushQuestionIds(question)
    // tạo options tương ứng với question, trong hàm createNew đã xử lí push optionId vào question
    await Promise.all(data.options.map(async (opt) => {
      await optionService.createNew({
        questionId: question._id.toString(),
        quizId: data.quizId,
        content: opt.content,
        isCorrect: opt.isCorrect
      })
    }))
    return result
  } catch (error) {
    throw error
  }
}

const updateQuestion = async (questionId, updateData) => {
  try {
    // Tìm question
    const question = await questionModel.findOneById(questionId)
    if (!question) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Question not found')
    }

    // Update question
    const updatedQuestion = await questionModel.update(questionId, {
      content: updateData.content,
      type: updateData.type,
      points: updateData.points
    })

    // Nếu có cập nhật options
    if (updateData.options && Array.isArray(updateData.options)) {
      // Lấy danh sách option IDs hiện tại của question này
      const existingOptions = await answerOptionModel.findByQuestionId(questionId)
      const existingOptionIds = existingOptions.map(opt => opt._id.toString())

      // Lấy danh sách option IDs được gửi từ frontend
      const incomingOptionIds = updateData.options
        .filter(opt => opt._id)
        .map(opt => opt._id.toString())

      // Tìm options bị xóa (có trong DB nhưng không có trong request)
      const deletedOptionIds = existingOptionIds.filter(
        id => !incomingOptionIds.includes(id)
      )

      // Xóa các options bị xóa
      for (const optionId of deletedOptionIds) {
        await answerOptionModel.deleteOne(optionId)
        await questionModel.pullOptionIds({ _id: optionId, questionId: questionId })
      }

      // Xử lý create và update options
      for (const opt of updateData.options) {
        if (opt._id) {
          // option đã có, update
          await answerOptionModel.update(
            opt._id,
            { content: opt.content, isCorrect: opt.isCorrect }
          )
        } else {
          // option mới, tạo mới, trong hàm tạo mới này đã xử lí push optionId vào question
          await optionService.createNew({
            questionId: questionId.toString(),
            quizId: question.quizId.toString(),
            content: opt.content,
            isCorrect: opt.isCorrect
          })
        }
      }
    }

    return updatedQuestion
  } catch (error) {
    throw error
  }
}

const deleteQuestion = async (questionId) => {
  try {
    // Kiểm tra question tồn tại
    const question = await questionModel.findOneById(questionId)
    if (!question) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Question not found')
    }

    // Xóa tất cả answerOptions của câu hỏi
    await answerOptionModel.deleteByQuestionId(questionId)

    // Xóa câu hỏi
    await questionModel.deleteOne(questionId)

    // Xóa questionId từ quiz
    await quizModel.pullQuestionIds({ _id: questionId, quizId: question.quizId.toString() })

    return {
      message: 'Question deleted successfully',
      questionId
    }
  } catch (error) {
    throw error
  }
}

export const questionService = {
  updateQuestionsInBatch,
  createNew,
  updateQuestion,
  deleteQuestion
}
