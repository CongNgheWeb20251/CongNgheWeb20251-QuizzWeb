// middlewares/rateLimit.js
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { StatusCodes } from 'http-status-codes'
import { RedisDB } from '../config/redis.init.js'

/*
  Giới hạn tần suất truy cập toàn cục: 100 request / phút
  Dùng giải thuật fixed window
*/
export const createGlobalRateLimit = () => {
  const redis = RedisDB.getRedis().instanceConnect

  if (!redis) {
    throw new Error('Redis client is not initialized. Call RedisDB.initRedis() first.')
  }
  // hàm này của thư viện rate-limit-express dùng để tạo middleware rate limit
  return rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 100, // 100 request / phút
    standardHeaders: true, // standardHeaders dùng để gửi thông tin rate limit trong header `RateLimit-*`
    legacyHeaders: false, // disable the `X-RateLimit-*` headers

    store: new RedisStore({
      // hàm này được gọi để gửi lệnh đến Redis để lưu trữ và truy xuất dữ liệu
      sendCommand: (...args) => redis.sendCommand(args)
    }),

    handler: (req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: 'Too many requests, please try again later'
      })
    }
  })
}
