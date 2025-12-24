
import { env } from '~/config/environment'

/**
 * Danh sách các domain được phép truy cập API
 */

export const WHITELIST_DOMAINS = ['http://localhost:5173', 'https://cong-nghe-web20251-quizz-web.vercel.app']

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 4
export const DEFAULT_FILTER = 'all'

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEV)
export const SERVER_DOMAIN = (env.BUILD_MODE === 'production' ? env.APP_DOMAIN_PRODUCTION : env.APP_DOMAIN_DEV)
// Bên config vercel đã rewrite /api về đúng backend domain nên ở đây chỉ cần thêm /api vào là được
export const CALLBACK_URL = (env.BUILD_MODE === 'production' ? `${env.WEBSITE_DOMAIN_PRODUCTION}/api` : env.APP_DOMAIN_DEV)