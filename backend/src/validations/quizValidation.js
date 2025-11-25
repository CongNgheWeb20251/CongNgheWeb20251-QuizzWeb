import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const quizzSchema = Joi.object({
    title: Joi.string().required().trim().strict(),
    description: Joi.string().optional().trim().strict(),
    category: Joi.string().required().trim().strict(),
    difficulty: Joi.string().required().trim().strict(),
    passingScore: Joi.number().required(),
    timeLimit: Joi.number().required()
  })
  try {
    await quizzSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateInfo = async (req, res, next) => {
  const quizzUpdateSchema = Joi.object({
    title: Joi.string().optional().trim().strict(),
    description: Joi.string().optional().trim().strict(),
    category: Joi.string().optional().trim().strict(),
    level: Joi.string().optional().trim().strict(),
    passingScore: Joi.number().optional(),
    timeLimit: Joi.number().optional(),
    allowRetake: Joi.boolean().optional(),
    showResults: Joi.boolean().optional()
  })
  try {
    await quizzUpdateSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const quizValidation = {
  createNew,
  updateInfo
}

