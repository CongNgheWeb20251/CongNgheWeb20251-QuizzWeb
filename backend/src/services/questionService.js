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
    for (const q of questions) {
      if (q._id) {
        // câu hỏi đã có, update
        await questionModel.update(
          q._id,
          { content: q.content, type: q.type, points: q.points, tempId: q.tempId }
        )
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
