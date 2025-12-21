/* eslint-disable no-useless-catch */
import { notificationModel } from '~/models/notificationModel'
import { cloneDeep } from 'lodash'

const getNotificationByTeacher = async (teacherId) => {
  try {
    const result = await notificationModel.getNotificationByTeacherId(teacherId, 5)
    const notifications = cloneDeep(result)
    notifications.forEach(notification => {
      notification['studentName'] = notification.student.fullName
      notification['quizTitle'] = notification.quiz.title
      notification['scorePercents'] = (notification.session.score / notification.session.totalPoints) * 100
      delete notification.student
      delete notification.quiz
      delete notification.session
    })

    return notifications
  } catch (error) {
    throw error
  }
}

export const notificationService = {
  getNotificationByTeacher
}
