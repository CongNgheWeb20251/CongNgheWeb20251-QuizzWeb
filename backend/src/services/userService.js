/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { pickUser } from '~/utils/fomatter'
// import { ResendProvider } from '~/providers/ResendProvider'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'


const createNew = async (userData) => {
    // Logic to create a new user
}

const verifyAccount = async (resBody) => {
    //
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
            email: existingUser.email
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
