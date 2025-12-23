import { StatusCodes } from 'http-status-codes'
import { questionService } from '~/services/questionService'
import ApiError from '~/utils/ApiError'

const updateQuestionsInBatch = async (req, res, next) => {
  try {
    //
    const { quizId } = req.params
    const { questions }= req.body
    // console.log({ quizId, questions })
    // questions.forEach(q => {
    //   console.log('Câu hỏi:', q.content)
    //   console.log('Điểm:', q.points)

    //   console.log('Options:')
    //   q.options.forEach(opt => {
    //     console.log(' -', opt.content)
    //     console.log('   - Đúng:', opt.isCorrect)

    //   })
    // })
    const result = await questionService.updateQuestionsInBatch(quizId, questions)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params
    const updateData = req.body

    if (!questionId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'questionId is required')
    }

    const updatedQuestion = await questionService.updateQuestion(questionId, updateData)
    res.status(StatusCodes.OK).json(updatedQuestion)
  } catch (error) {
    next(error)
  }
}

const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params

    if (!questionId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'questionId is required')
    }

    await questionService.deleteQuestion(questionId)
    res.status(StatusCodes.OK).json({
      message: 'Question deleted successfully',
      questionId
    })
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const questionData = req.body
    const createdQuestion = await questionService.createNew(questionData)
    res.status(StatusCodes.CREATED).json(createdQuestion)
  } catch (error) {
    next(error)
  }
}


export const questionController = {
  updateQuestionsInBatch,
  updateQuestion,
  deleteQuestion,
  createNew
}
