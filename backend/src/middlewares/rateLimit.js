// middlewares/rateLimit.js
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { StatusCodes } from 'http-status-codes'
import { RedisDB } from '../config/redis.init.js'

/*
  Rate limit cho auth routes (đăng ký, đăng nhập): 20 request / phút
  Chỉ apply cho các route public authentication
*/

let authRateLimitMiddleware = null

export const initAuthRateLimit = () => {
  const redis = RedisDB.getRedis().instanceConnect

  if (!redis) {
    throw new Error('Redis client is not initialized. Call RedisDB.initRedis() first.')
  }

  authRateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 20, // 20 request / phút
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redis.sendCommand(args)
    }),

    handler: (req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: 'Too many requests, please try again later'
      })
    }
  })
}

// Middleware cho auth routes
export const authRateLimit = (req, res, next) => {
  if (!authRateLimitMiddleware) {
    return next(new Error('Auth rate limit not initialized. Call initAuthRateLimit() first.'))
  }
  return authRateLimitMiddleware(req, res, next)
}

/*
  Rate limit theo user ID: 100 request / phút
  Apply cho các route đã authenticated
  Dùng sau authMiddleware trong các protected routes
*/
let userRateLimitMiddleware = null

export const initUserRateLimit = () => {
  const redis = RedisDB.getRedis().instanceConnect

  if (!redis) {
    throw new Error('Redis client is not initialized. Call RedisDB.initRedis() first.')
  }

  userRateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 100, // 100 request / phút cho mỗi user
    standardHeaders: true,
    legacyHeaders: false,

    // Rate limit theo user ID
    keyGenerator: (req) => {
      const userId = req.jwtDecoded?._id
      if (userId) {
        // console.log(req.jwtDecoded?.email)
        return `user:${userId.toString()}`
      }
      // Nếu không có userId, skip middleware này (để global IP rate limit xử lý)
      return undefined
    },

    // Skip nếu không có userId (không tạo key)
    skip: (req) => !req.jwtDecoded?._id,

    store: new RedisStore({
      sendCommand: (...args) => redis.sendCommand(args)
    }),

    handler: (req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: 'Too many requests, please try again later'
      })
    }
  })
}

// Middleware wrapper để dùng trong routes
export const userRateLimit = (req, res, next) => {
  if (!userRateLimitMiddleware) {
    return next(new Error('User rate limit not initialized. Call initUserRateLimit() first.'))
  }
  return userRateLimitMiddleware(req, res, next)
}
