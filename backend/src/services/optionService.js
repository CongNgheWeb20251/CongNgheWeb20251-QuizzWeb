/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { answerOptionModel } from '~/models/answerModel'
import { questionModel } from '~/models/questionModel'


const createNew = async (data) => {
  try {
    const result = await answerOptionModel.createNew({
      questionId: data.questionId,
      quizId: data.quizId,
      content: data.content,
      isCorrect: data.isCorrect,
      tempId: data.tempId,
      createdAt: new Date()
    })
    const option = await answerOptionModel.findOneById(result.insertedId)
    // Push optionId vào mảng optionOrderIds của question
    await questionModel.pushOptionIds(option)
    return option
  } catch (error) {
    throw error
  }
}

// const update = async (optionId, updateData) => {
//   try {
//     const result = await answerOptionModel.update(optionId, updateData)
//     return result
//   } catch (error) {
//     throw error
//   }
// }

// const deleteOne = async (optionId) => {
//   try {
//     const result = await answerOptionModel.deleteOne(optionId)
//     return result
//   } catch (error) {
//     throw error
//   }
// }

export const optionService = {
  createNew
  // update,
  // deleteOne
}
