import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
    //
}

const verifyAccount = async (req, res, next) => {
    //
}

const login = async (req, res, next) => {
    try {
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

const loginGoogle = async (req, res, next) => {
    //
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
    //
}



export const userController = {
    createNew,
    verifyAccount,
    login,
    loginGoogle,
    logout,
    refreshToken,
    update,
}
