// let apiRoot = ''
// Lỗi process is not defined vite, config trong vite.config.js
// if (process.env.BUILD_MODE === 'production') {
//   apiRoot = 'http://localhost:8017'
// }

// if (process.env.BUILD_MODE === 'dev') {
//   apiRoot = 'https://trello-api-express.onrender.com'
// }

const apiRoot = import.meta.env.DEV
  ? 'http://localhost:8017' // Development
  : 'https://congngheweb20251-quizzweb.onrender.com' // Production

export const API_ROOT = apiRoot

// Frontend URL for invite links
export const FRONTEND_URL = import.meta.env.DEV
  ? 'http://localhost:5173' // Development
  : 'https://cong-nghe-web20251-quizz-web.vercel.app' // Production

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 4
