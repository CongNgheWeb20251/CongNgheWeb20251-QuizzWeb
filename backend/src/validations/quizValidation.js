import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const quizzSchema = Joi.object({
    title: Joi.string().required().trim().replace(/\s+/g, ' '),
    description: Joi.string().allow('').trim().replace(/\s+/g, ' '),
    category: Joi.string().required().trim(),
    difficulty: Joi.string().required().trim(),
    passingScore: Joi.number().required(),
    timeLimit: Joi.number().required()
  })
  try {
    const validatedData = await quizzSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    req.body = validatedData
    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateInfo = async (req, res, next) => {
  const quizzUpdateSchema = Joi.object({
    title: Joi.string().optional().trim().replace(/\s+/g, ' '),
    description: Joi.string().optional().trim().replace(/\s+/g, ' '),
    category: Joi.string().optional().trim().replace(/\s+/g, ' '),
    level: Joi.string().optional().trim().replace(/\s+/g, ' '),
    passingScore: Joi.number().optional(),
    timeLimit: Joi.number().optional(),
    allowRetake: Joi.boolean().optional(),
    showResults: Joi.boolean().optional()
  })
  try {
    const validatedData = await quizzUpdateSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    req.body = validatedData
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

