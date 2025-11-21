
import { env } from '~/config/environment'

/**
 * Danh sách các domain được phép truy cập API
 */

export const WHITELIST_DOMAINS = ['http://localhost:5173']

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 4
export const DEFAULT_FILTER = 'all'

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEV)