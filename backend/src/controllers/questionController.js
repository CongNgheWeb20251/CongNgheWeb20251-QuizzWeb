import { StatusCodes } from 'http-status-codes'
import { questionService } from '~/services/questionService'

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


export const questionController = {
  updateQuestionsInBatch
}
