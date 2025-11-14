/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { pickUser } from '~/utils/fomatter'
import { v4 as uuidv4 } from 'uuid'
// import { ResendProvider } from '~/providers/ResendProvider'
import { env } from '~/config/environment'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { JwtProvider } from '~/providers/JwtProvider'
import { BrevoProvider } from '~/providers/BrevoProvider'


const createNew = async (userData) => {
  // Logic to create a new user
  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await userModel.findOneByEmail(userData.email)
    if (existingUser) {
      throw new ApiError( StatusCodes.CONFLICT, 'Email already exists!')
    }

    // Tạo data lưu vào database
    const nameFromEmail = userData.email.split('@')[0]

    const newUser = {
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 8),
      username: userData.username || nameFromEmail,
      fullName: userData.fullName || nameFromEmail,
      role: userData.accountType || 'student',
      authProvider: 'local',
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUser)
    const result = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${result.email}&token=${result.verifyToken}`
    const to = result.email
    const html = `
    <h1>Welcome!</h1>
    <h2>Thank you for joining us.</h2>
    <h3>Here is your verification link:</h3>
    <h3>${verificationLink}</h3>
    <h3>Sincerely!</h3>
    `
    // await ResendProvider.sendEmail({ to, subject, html })
    // Sử dụng Brevo để gửi email
    const customSubject = 'Quizzy: Please verify your email before using our services!'
    // Gọi tới cái Provider gửi email
    try {
      await BrevoProvider.sendEmail(to, customSubject, html)
    } catch (emailError) {
      // Log lỗi nhưng không throw để user vẫn được tạo
      console.error('Failed to send verification email:', emailError.message)
    }

    // return trả về dữ liệu người dùng đã tạo
    return pickUser(result)

  } catch (error) {
    throw error
  }
}

const verifyAccount = async (resBody) => {
  //
  try {
    //
    const existingUser = await userModel.findOneByEmail(resBody.email)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }
    if (existingUser.isActive) {
      // Nếu đã active rồi thì trả về thông tin luôn, không cần update
      return pickUser(existingUser)
    }
    if (resBody.token !== existingUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid verification token!')
    }

    // Ok
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existingUser._id, updateData)
    return pickUser(updatedUser)

  } catch (error) {
    throw error
  }
}

const login = async (resBody, device) => {
  try {
    //
    const existingUser = await userModel.findOneByEmail(resBody.email)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }
    if (!existingUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active! Please verify your account first.')
    }
    // Nếu tài khoản là social login thì không thể đăng nhập bằng email/password
    if (existingUser.authProvider !== 'local') {
      throw new ApiError(StatusCodes.BAD_REQUEST, `This account was created with ${existingUser.authProvider}. Please use that login method.`)
    }
    // Kiểm tra mật khẩu
    if (!existingUser.password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This account does not have a password. Please use social login.')
    }
    if (!bcrypt.compareSync(resBody.password, existingUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password!')
    }
    // Ok thì tạo token đăng nhập để trả về cho fe
    // Thông tin sẽ đính kèm trong JWT Token gồm _id và email của user
    const userInfo = {
      _id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role
    }

    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho fe
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET,
      // 5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET,
      // 15
      env.REFRESH_TOKEN_LIFE
    )
    const resUser = pickUser(existingUser)
    // resUser['last_login'] = userSession.last_login || null
    // Trả về thông tin kèm theo 2 token bên trên
    return {
      accessToken,
      refreshToken,
      ...pickUser(resUser)
    }

  } catch (error) {
    throw error
  }
}

const loginGoogle = async (resBody) => {
  //
}

const refreshToken = async (clientRefreshToken) => {
  //
  try {
    //
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    // Tạo ra accessToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET,
      // 5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    )

    // Trả về accessToken
    return {
      accessToken
    }

  } catch (error) {
    throw error
  }
}

const update = async (userId, userAvatarFile, updateData) => {
  //
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  loginGoogle,
  refreshToken,
  update,
}
