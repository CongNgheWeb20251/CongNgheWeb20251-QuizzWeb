import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'

const createNew = async (req, res, next) => {
  try {
    // console.log('Registration request body:', req.body)
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)

  }
  catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)

  }
  catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    // const {username, email, password } = req.body
    // console.log('Login request received for user:', email)
    // console.log('Password:', password)
    // console.log('Login request body:', req.body)

    const result = await userService.login(req.body)

    //
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(result)

  }
  catch (error) {
    next(error)
  }
}

const googleOAuthCallback = async (req, res, next) => {
  try {
    const user = req.user
    const result = await userService.loginWithGoogle(user)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Redirect về frontend
    return res.redirect(`${env.WEBSITE_DOMAIN_DEV}/auth-successful`)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' })
  }
  catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)

  }
  catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Log in again to refresh your session'))
  }
}

const update = async (req, res, next) => {
  try {
    // Biến jwtDecoded chứa thông tin người dùng đã xác thực sau khi đi qua authMiddleware.isAuthorized
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    // console.log('userAvatarFile:', userAvatarFile)
    // console.log("data", req.body)
    const updatedUser = await userService.update(userId, userAvatarFile, req.body)
    res.status(StatusCodes.OK).json(updatedUser)
  }
  catch (error) {
    next(error)
  }
}

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const user = await userService.getCurrentUser(userId)
    res.status(StatusCodes.OK).json(user)
  }
  catch (error) {
    next(error)
  }
}


export const userController = {
  createNew,
  verifyAccount,
  login,
  googleOAuthCallback,
  logout,
  refreshToken,
  update,
  getCurrentUser
}
