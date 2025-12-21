import { StatusCodes } from 'http-status-codes'
import { notificationService } from '~/services/notificationsService'

const getNotificationByTeacher = async (req, res, next) => {
  try {
    const teacherId = req.jwtDecoded._id
    const result = await notificationService.getNotificationByTeacher(teacherId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const notificationController = {
  getNotificationByTeacher
}
