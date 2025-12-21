// singleton pattern to store socket.io instance
let ioInstance = null

export const setSocketIo = (io) => {
  ioInstance = io
}

export const getSocketIo = () => ioInstance
