import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) // Cho phép nếu header ko có "Origin" (Postman hoặc direct call)
      return callback(null, true)

    if (env.BUILD_MODE === 'dev') // Cho phép tất cả trong mode dev
      return callback(null, true)

    if (WHITELIST_DOMAINS.includes(origin)) // Cho phép domain có trong WHITELIST_DOMAINS
      return callback(null, true)

    // Còn lại sẽ lỗi
    // console.error('CORS blocked:', origin)
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
  },
  optionsSuccessStatus: 200, // ép server trả về 200 (thay vì 204 mặc định) cho request OPTIONS (preflight)
  credentials: true // cho phép gửi cookie, token giữa các domain khác nhau (ở đây là domain trong WHITELIST_DOMAINS)
}
