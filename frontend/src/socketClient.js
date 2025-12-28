// cấu hình socketio
import { io } from 'socket.io-client'
import { SOCKET_URL } from './utils/constants'
export const socketIoInstance = io(SOCKET_URL)