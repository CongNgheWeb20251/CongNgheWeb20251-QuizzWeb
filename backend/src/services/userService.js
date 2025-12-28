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
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import { otpModel } from '~/models/otpModel'
import { generateVerifyEmailTemplate } from '~/utils/generateTemplate'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'
import { twoFASecretKeyModel } from '~/models/twoFASecretKeyModel'
import { userSessionModel } from '~/models/userSessionModel'

const serviceName = '2FA-Quizzy (MERN)'


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
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút hết hạn
      // verifyToken: uuidv4()
    }
    const token = uuidv4()
    const otpData = {
      email: userData.email,
      token: token,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút hết hạn
    }

    // const createdUser = await userModel.createNew(newUser)
    const [createdUser] = await Promise.all([
      userModel.createNew(newUser),
      otpModel.createNew(otpData)
    ])

    const result = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${result.email}&token=${token}`
    const to = result.email
    // const html = `
    // <h1>Welcome!</h1>
    // <h2>Thank you for joining us.</h2>
    // <h3>Here is your verification link:</h3>
    // <h3>${verificationLink}</h3>
    // <h3>Sincerely!</h3>
    // `
    const html = generateVerifyEmailTemplate({
      link: verificationLink,
      title: 'Verify Your Email Address',
      content: 'Thank you for registering with Quizzy! Please verify your email address by clicking the button below to activate your account and start using our services.',
      linkText: 'Verify Email'
    })
    // await ResendProvider.sendEmail({ to, subject, html })
    // Sử dụng Brevo để gửi email
    const customSubject = 'Quizzy: Please verify your email before using our services!'
    // Gọi tới cái Provider gửi email
    try {
      await BrevoProvider.sendEmail(to, customSubject, html)
    } catch (emailError) {
      // Log lỗi nhưng không throw để user vẫn được tạo
      // eslint-disable-next-line no-console
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

    // if (resBody.token !== existingUser.verifyToken) {
    //   throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid verification token!')
    // }

    // Tìm token trong db
    const existingOtp = await otpModel.findOneByEmailToken({ email: resBody.email, token: resBody.token })
    if (!existingOtp) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid or expired verification token!')
    }

    // Ok
    const updateData = {
      isActive: true
    }

    const updatedUser = await userModel.updateUserActive(existingUser._id, updateData)
    return pickUser(updatedUser)

  } catch (error) {
    throw error
  }
}

const login = async (resBody) => {
  try {
    //
    const existingUser = await userModel.findOneByEmail(resBody.email)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }
    if (!existingUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active! Please verify your account first.')
    }
    // Nếu authProvider là google thì không cho login bằng password
    if (existingUser.authProvider === 'google') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This account is registered via Google OAuth. Please use Google Sign-In to log in.')
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
    resUser['is_2fa_verified'] = false
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

const loginWithGoogle = async (user) => {
  try {
    // User đã được tạo hoặc cập nhật trong passportProvider
    // Tạo token để trả về cho frontend
    const userInfo = {
      _id: user._id,
      email: user.email,
      role: user.role
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET,
      env.REFRESH_TOKEN_LIFE
    )

    return {
      accessToken,
      refreshToken,
      ...pickUser(user)
    }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  //
  try {
    //
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role
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

const forgotPassword = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    // Nếu authProvider là google thì không cho reset password
    if (user.authProvider === 'google' || user.authProvider === 'facebook') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'This account is registered via Google OAuth. Password reset is not applicable.')
    }

    const token = uuidv4()

    // Lưu token vào otpModel
    const otpData = {
      email: email,
      token: token,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút hết hạn
    }
    await otpModel.createNew(otpData)

    const resetLink = `${WEBSITE_DOMAIN}/account/reset-password?email=${email}&token=${token}`
    const to = email
    const html = generateVerifyEmailTemplate({
      link: resetLink,
      title: 'Reset Your Quizzy Password',
      content: 'We received a request to reset your password for your Quizzy account. Click the button below to set a new password for your account.',
      linkText: 'Reset Password'
    })
    const customSubject = 'Quizzy: Password Reset Request'

    try {
      await BrevoProvider.sendEmail(to, customSubject, html)
    } catch (emailError) {
      // eslint-disable-next-line no-console
      console.error('Failed to send password reset email:', emailError.message)
    }

    return { message: 'Password reset link has been sent to your email.' }
  }
  catch (error) {
    throw error
  }
}

const resetPassword = async (email, token, password) => {
  try {
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    // Tìm token trong otpModel theo email và token
    const existingOtp = await otpModel.findOneByEmailToken({ email, token })
    if (!existingOtp) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid or expired reset token!')
    }

    // Update mật khẩu mới
    const updateData = {
      password: bcrypt.hashSync(password, 8)
    }
    await userModel.update(user._id, updateData)

    // Xóa token sau khi reset thành công
    await otpModel.clearTokenByEmail(email)

    return { message: 'Password has been reset successfully.' }
  }
  catch (error) {
    throw error
  }
}

const update = async (userId, userAvatarFile, updateData) => {
  try {
    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await userModel.findOneById(userId)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    // Khi thay đổi mật khẩu thì chắc chắn user đã active, nhưng cứ làm bước này cho chắc.
    if (!existingUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active! Please verify your account first.')
    }
    let updatedUser = { }
    // Trường hợp thay đổi mật khẩu
    if (updateData.new_password && updateData.current_password) {
      // Kiểm tra xem current_password có đúng hay không
      if (!bcrypt.compareSync(updateData.current_password, existingUser.password)) {
        // Nên tránh mã authorized 401 vì khi trả về mã 401 cho bên fe thì phần interceptor sẽ logout luôn
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Current password is incorrect!')
      }
      updatedUser = await userModel.update(
        userId,
        { password: bcrypt.hashSync(updateData.new_password, 8) }
      )

    } else if (userAvatarFile) {
      // upload lên cloundinary
      const userAvatar = await cloudinaryProvider.streamUploadAvatarWithOverwrite(userAvatarFile.buffer, 'avatars', `user_${userId}_avatar`)
      // Lưu lại url avatar vào database
      updatedUser = await userModel.update(userId, { avatar: userAvatar.avatar_url })
    } else {
      // update các thông tin khác
      updatedUser = await userModel.update(userId, updateData)
    }
    // Cập nhật thông tin người dùng
    return pickUser(updatedUser)

  } catch (error) {
    throw error
  }
}

const getCurrentUser = async (userId) => {
  try {
    const existingUser = await userModel.findOneById(userId)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return pickUser(existingUser)
  } catch (error) {
    throw error
  }
}

const get2FA_QRCode = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    // Biến lưu trữ 2fa secret key của user trong Database > 2fa_secret_keys tại đây
    let twoFactorSecretKeyValue = null
    const twoFactorSecretKey = await twoFASecretKeyModel.getSecretKeyByUserId(userId)
    if (twoFactorSecretKey) {
      twoFactorSecretKeyValue = twoFactorSecretKey.value
    }
    else {
      // Tạo mới secret key và lưu vào db
      twoFactorSecretKeyValue = authenticator.generateSecret()
      await twoFASecretKeyModel.createNew({
        userId: userId,
        value: twoFactorSecretKeyValue
      })
    }
    const otpAuthToken = authenticator.keyuri(user.email, serviceName, twoFactorSecretKeyValue)
    // Tạo QR code từ OTP token trên
    const qrCodeImageUrl = await qrcode.toDataURL(otpAuthToken)

    return { qrCodeImageUrl }
  } catch (error) {
    throw error
  }
}

const setup2FA = async (userId, reqBody, device) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    const twoFactorSecretKey = await twoFASecretKeyModel.getSecretKeyByUserId(userId)
    if (!twoFactorSecretKey) {
      throw new ApiError(StatusCodes.NOT_FOUND, '2FA secret key not found!')
    }
    const secretKey = twoFactorSecretKey.value
    const otpTokenFromClient = reqBody.otpToken
    if (!otpTokenFromClient) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP token is required!')
    }
    // Verify OTP token
    const isValid = authenticator.verify({ token: otpTokenFromClient, secret: secretKey })
    if (!isValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP token!')
    }
    // Cập nhật trạng thái 2fa của user
    const updatedUser = await userModel.update(userId, { require_2fa: true })
    userSessionModel.createNew({ userId: userId, device_id: device, is_2fa_verified: true })
    return {
      ...pickUser(updatedUser),
      is_2fa_verified: true
    }
  } catch (error) {
    throw error
  }
}

const verify2FA = async (userId, reqBody, device) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    const twoFactorSecretKey = await twoFASecretKeyModel.getSecretKeyByUserId(userId)
    if (!twoFactorSecretKey) {
      throw new ApiError(StatusCodes.NOT_FOUND, '2FA secret key not found!')
    }
    const secretKey = twoFactorSecretKey.value
    const otpTokenFromClient = reqBody.otpToken
    if (!otpTokenFromClient) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP token is required!')
    }
    // Verify OTP token
    const isValid = authenticator.verify({ token: otpTokenFromClient, secret: secretKey })
    if (!isValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP token!')
    }
    const userSession = await userSessionModel.getSessionByUserId(user._id, device)
    // Cập nhật trạng thái 2fa của user
    if (!userSession) {
      await userSessionModel.createNew({ userId: userId, device_id: device, is_2fa_verified: true })
    }
    return {
      ...pickUser(user),
      is_2fa_verified: true
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  loginWithGoogle,
  refreshToken,
  forgotPassword,
  resetPassword,
  update,
  getCurrentUser,
  get2FA_QRCode,
  setup2FA,
  verify2FA
}
