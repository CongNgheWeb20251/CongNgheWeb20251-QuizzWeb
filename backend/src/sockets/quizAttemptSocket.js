/* eslint-disable no-console */
import { sessionQuizModel } from '~/models/sessionQuizModel'

let socket = null

// để server.js gọi khi init
function initSocketIO(_io) {
  socket = _io
}

// Hàm BE gọi khi vừa tạo session
function scheduleQuizTimeout(sessionId, endTime) {
  const delay = endTime - Date.now()

  if (delay <= 0) return

  console.log('Setting timeout for session', sessionId, 'after', delay, 'ms')

  setTimeout(async () => {
    console.log('Timeout for session:', sessionId)

    const session = await sessionQuizModel.findOneById(sessionId)
    if (!session) return

    if (session.status !== 'doing') return

    // cập nhật session sang completed
    await sessionQuizModel.update(sessionId, {
      status: 'completed',
      submittedAt: Date.now()
    })

    // thông báo cho user (join vào room = userId)
    socket.to(String(session.userId)).emit('quizTimeout', {
      sessionId,
      status: 'timeout'
    })
    console.log('Quiz timeout notification sent to user:', session.userId)
  }, delay)
}

export const quizAttemptSocket = {
  initSocketIO,
  scheduleQuizTimeout
}
