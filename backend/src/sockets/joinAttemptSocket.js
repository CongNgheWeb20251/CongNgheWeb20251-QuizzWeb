/* eslint-disable no-console */
import { sessionQuizModel } from '~/models/sessionQuizModel'
import { sessionQuizService } from '~/services/sessionQuizService'

export const joinAttemptSocket = (socket, activeSessions) => {
  // Lắng nghe sự kiện client tham gia vào phiên làm quiz
  socket.on('join-session', async (sessionId) => {
    const session = await sessionQuizModel.findOneById(sessionId)
    if (!session) {
      socket.emit('session-error', { message: 'Session not found' })
      return
    }

    // Kiểm tra nếu session đã kết thúc
    if (session.status === 'completed' || session.status === 'submitted') {
      socket.emit('session-ended', { message: 'This session has already ended' })
      return
    }

    socket.join(sessionId)
    console.log(`User joined session: ${sessionId}`)

    const timeLeft = Math.max(0, session.endTime - Date.now())
    socket.emit('timeLeft', { timeLeft })

    // Nếu hết thời gian ngay lập tức
    if (timeLeft <= 0) {
      await autoSubmitSession(sessionId)
      socket.emit('timeout')
      return
    }

    startSessionTimer(socket, sessionId, session.endTime, activeSessions)
  })

  // Xử lý khi client disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
}


// Tính toán thời gian còn lại và gửi cập nhật định kỳ cho tất cả clients trong room
const startSessionTimer = (socket, sessionId, endTime, activeSessions) => {
  if (activeSessions.has(sessionId)) return

  const timer = setInterval(async () => {
    const now = Date.now()
    const timeLeft = Math.max(0, endTime - now)

    // Broadcast time left to all clients in the session room
    socket.to(sessionId).emit('timeLeft', { timeLeft })

    if (timeLeft <= 0) {
      clearInterval(timer)
      activeSessions.delete(sessionId)

      await autoSubmitSession(sessionId, socket)
      // Emit timeout to all clients in the session
      socket.to(sessionId).emit('timeout')
      console.log(`Session ${sessionId} has timed out and auto-submitted`)
    }
  }, 1000)

  activeSessions.set(sessionId, timer)
}


async function autoSubmitSession(sessionId, socket) {
  try {
    // Tự động submit và tính điểm
    await sessionQuizService.calculateQuizScore(sessionId)
    console.log(`Auto-submitted session: ${sessionId}`)
  } catch (error) {
    console.error(`Error auto-submitting session ${sessionId}:`, error)
    socket.to(sessionId).emit('submit-error', { message: 'Failed to auto-submit quiz' })
  }
}