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
    if (session.status === 'completed') {
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

  // Xử lý khi client rời khỏi session
  socket.on('leave-session', (sessionId) => {
    socket.leave(sessionId)
    console.log(`User left session: ${sessionId}`)

    // Nếu không còn ai trong room thì clear timer
    const room = socket.adapter.rooms.get(sessionId)
    if (!room || room.size === 0) {
      const timer = activeSessions.get(sessionId)
      if (timer) {
        clearTimeout(timer)
        activeSessions.delete(sessionId)
        console.log(`Cleared timer for empty session: ${sessionId}`)
      }
    }
  })

  // Xử lý khi client disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
}


// Backup timer: chỉ auto-submit nếu client không tự submit (mất kết nối)
const startSessionTimer = (socket, sessionId, endTime, activeSessions) => {
  if (activeSessions.has(sessionId)) return

  const timeLeft = Math.max(0, endTime - Date.now())

  // Set timeout 1 lần duy nhất khi hết giờ
  const timer = setTimeout(async () => {
    activeSessions.delete(sessionId)

    // Kiểm tra nếu session chưa completed thì mới auto-submit (backup)
    const session = await sessionQuizModel.findOneById(sessionId)
    if (session && session.status !== 'completed') {
      await autoSubmitSession(sessionId, socket)
      socket.to(sessionId).emit('timeout')
      socket.emit('timeout')
      console.log(`[BACKUP] Auto-submitted session: ${sessionId}`)
    } else {
      console.log(`Session ${sessionId} already completed by client`)
    }
  }, timeLeft)

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