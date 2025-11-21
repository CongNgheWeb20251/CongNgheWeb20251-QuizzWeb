// let apiRoot = ''
// Lỗi process is not defined vite, config trong vite.config.js
// if (process.env.BUILD_MODE === 'production') {
//   apiRoot = 'http://localhost:8017'
// }

// if (process.env.BUILD_MODE === 'dev') {
//   apiRoot = 'https://trello-api-express.onrender.com'
// }

// const apiRoot = import.meta.env.DEV
//   ? 'http://localhost:8017' // Development
//   : '' // Production

export const API_ROOT = 'http://localhost:8017'

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 4
