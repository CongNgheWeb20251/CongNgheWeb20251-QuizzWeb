import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE } from '~/utils/validators'


const createSingleQuestion = async (req, res, next) => {
  const optionSchema = Joi.object({
    content: Joi.string().required().trim().replace(/\s+/g, ' '),
    isCorrect: Joi.boolean().required()
  })

  const singleQuestionSchema = Joi.object({
    content: Joi.string().required().min(1).trim().replace(/\s+/g, ' '),
    points: Joi.number().integer().min(1).required(),
    type: Joi.string().valid('single-choice', 'multiple-choice', 'true-false').required(),
    options: Joi.array().items(optionSchema).min(2).max(5).required(),
    quizId: Joi.string().required().pattern(OBJECT_ID_RULE)
  })

  try {
    const validatedData = await singleQuestionSchema.validateAsync(req.body, { abortEarly: false })
    // kiểm tra logic xem đã có đáp án đúng chưa
    const hasCorrectAnswer = validatedData.options.some(opt => opt.isCorrect === true)
    if (!hasCorrectAnswer) {
      throw new Error('At least one option must be marked as correct')
    }

    // chỉ được có một đáp án đúng nếu là single-choice hoặc true-false
    if (validatedData.type === 'single-choice' || validatedData.type === 'true-false') {
      const correctCount = validatedData.options.filter(opt => opt.isCorrect === true).length
      if (correctCount > 1) {
        throw new Error(`${validatedData.type} questions can only have one correct answer`)
      }
    }

    req.body = validatedData
    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const questionValidation = {
  createSingleQuestion
}

