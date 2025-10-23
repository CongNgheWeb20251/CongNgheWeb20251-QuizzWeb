/* eslint-disable no-useless-catch */

const createNew = async (userData) => {
  // Logic to create a new user
}

const verifyAccount = async (resBody) => {
  // Logic to verify user account
}

const login = async (resBody, device) => {
  // Logic to login user
}

const loginGoogle = async (resBody) => {
}

const refreshToken = async (clientRefreshToken) => {
}

const update = async (userId, userAvatarFile, updateData) => {
}
export const userService = {
  createNew,
  verifyAccount,
  login,
  loginGoogle,
  refreshToken,
  update,
}
