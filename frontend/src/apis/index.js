import { toast } from 'react-toastify'
// import { API_ROOT } from '../utils/constants' // Không cần nữa vì đã set baseURL trong axios instance
import authorizedAxiosInstance from '~/utils/authorizeAxios'

// Mock API functions - replace with real API calls when backend is ready
// Example: import axios from 'axios'
// const api = axios.create({ baseURL: 'http://localhost:8017/api' })

// User APIs-------------------------------------------------------------
export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put('/v1/users/verify', data)
  toast.success('Your account has been verified successfully!', { theme:'colored' })
  return response.data
}

export const forgotPassAPI = async(data) => {
  const res = await authorizedAxiosInstance.post('/v1/users/forgot-password', data)
  return res.data
}

export const resetPasswordAPI = async(data) => {
  const res = await authorizedAxiosInstance.post('/v1/users/reset-password', data)
  // toast.success('Your password has been reset successfully!', { theme:'colored' })
  return res.data
}

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post('/v1/users/register', data)
  toast.success('Your account has been registered successfully! Please check your email to verify your account!', { theme:'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get('/v1/users/refresh_token')
  return response.data
}

// Dashboard APIs
export const getDashboardStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get('/v1/dashboard/stats')
  return response.data
}

export const getTopStudentsAPI = async (limit = 5) => {
  const response = await authorizedAxiosInstance.get(`/v1/dashboard/top-students?limit=${limit}`)
  return response.data
}

export const getRecentQuizzesAPI = async (limit = 3) => {
  const response = await authorizedAxiosInstance.get(`/v1/dashboard/recent-quizzes?limit=${limit}`)
  return response.data
}

export const getTopQuizzesAPI = async (limit = 5) => {
  const response = await authorizedAxiosInstance.get(`/v1/dashboard/top-quizzes?limit=${limit}`)
  return response.data
}


// createQuiz
export const createQuizStep1API = async (data) => {
  const response = await authorizedAxiosInstance.post('/v1/quizzes', data)
  return response.data
}

export const fetchQuizzesAPI = async (searchPath) => {
  const res = await authorizedAxiosInstance.get(`/v1/quizzes${searchPath}`)
  return res.data
}

export const fetchQuizzesByStudentAPI = async (searchPath) => {
  const res = await authorizedAxiosInstance.get(`/v1/student/quizzes${searchPath}`)
  return res.data
}

export const fetchQuizzesStatsAPI = async () => {
  const res = await authorizedAxiosInstance.get('/v1/quizzes/stats')
  return res.data
}

// get Quiz info
export async function getQuizInfo(id) {
  const res = await authorizedAxiosInstance.get(`/v1/quizzes/${id}/info`)
  return res.data
}

// update QuizInfo
export async function updateQuizInfo(id, updateData) {
  const res = await authorizedAxiosInstance.put(`/v1/quizzes/${id}/info`, updateData)
  return res.data
}

// create Quesions in batch
export const createQuestionsInBatchAPI = async (quizId, questions) => {
  const res = await authorizedAxiosInstance.post(`/v1/quizzes/${quizId}/questions/batch`, { questions })
  return res.data
}

// Create 1 question
export const createQuestionAPI = async (questionData) => {
  const res = await authorizedAxiosInstance.post('/v1/questions', questionData)
  return res.data
}

// Update 1 question
export const updateQuestionAPI = async (questionId, questionData) => {
  const res = await authorizedAxiosInstance.put(`/v1/questions/${questionId}`, questionData)
  return res.data
}
// Delete 1 question
export const deleteQuestionAPI = async (questionId) => {
  const res = await authorizedAxiosInstance.delete(`/v1/questions/${questionId}`)
  return res.data
}


export const publishQuizAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.post(`/v1/quizzes/${quizId}/publish`)
  return res.data
}

export const draftQuizAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.post(`/v1/quizzes/${quizId}/draft`)
  return res.data
}

export const deleteQuizAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.delete(`/v1/quizzes/${quizId}`)
  toast.success('Quiz deleted successfully', { theme:'colored' })
  return res.data
}

// attemptQuiz------------------------------------------

export const startAttemptQuizAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.post(`/v1/student/quizzes/${quizId}/sessions`)
  return res.data
}

export const fetchSessionQuizAPI = async (sessionId) => {
  const res = await authorizedAxiosInstance.get(`/v1/student/sessions/${sessionId}`)
  return res.data
}

export const saveQuestionAnswerAPI = async (sessionId, data) => {
  const res = await authorizedAxiosInstance.put(`/v1/student/sessions/${sessionId}/answers`, data)
  return res.data
}

export const submitQuizSessionAPI = async (sessionId) => {
  const res = await authorizedAxiosInstance.post(`/v1/student/sessions/${sessionId}/submit`)
  return res.data
}

export const getQuizResultsAPI = async (sessionId) => {
  const res = await authorizedAxiosInstance.get(`/v1/student/sessions/${sessionId}/result`)
  return res.data
}

export const getQuizAttemptsAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.get(`/v1/student/quizzes/${quizId}/attempts`)
  return res.data
}
//-----------------------------------------------------------
// Join quiz by invite token
export const joinQuizByInviteAPI = async (inviteToken) => {
  const res = await authorizedAxiosInstance.post(`/v1/quizzes/join/${inviteToken}`)
  return res.data
}


//--------------Fetch Data Dashboard - Teacher View-----------------------
export const getQuizScoreDistributionAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.get(`/v1/quizzes/${quizId}/score-distribution`)
  return res.data
}

export const getQuizMetricsAPI = async (quizId) => {
  const res = await authorizedAxiosInstance.get(`/v1/quizzes/${quizId}/metrics`)
  return res.data
}

export const getStudentsQuizAttemptsAPI = async ({ quizId, searchPath }) => {
  const res = await authorizedAxiosInstance.get(`/v1/quizzes/${quizId}/students${searchPath}`)
  return res.data
}


// Notification APIs
export const getNotificationsByTeacherAPI = async () => {
  const res = await authorizedAxiosInstance.get('/v1/notifications')
  return res.data
}

// AI Chatbot API
export const askAIQuestionAPI = async (question) => {
  const res = await authorizedAxiosInstance.post('v1/ai/ask', { question })
  return res.data
}

//------------------------------------------
export const get2FA_QRCodeAPI = async () => {
  const res = await authorizedAxiosInstance.get('v1/users/get_2fa_qr_code')
  return res.data
}

export const setup_2FA_API = async (otpToken) => {
  const res = await authorizedAxiosInstance.post('v1/users/setup_2fa', { otpToken })
  return res.data
}

export const verify_2FA_API = async (otpToken) => {
  const res = await authorizedAxiosInstance.put('v1/users/verify_2fa', { otpToken })
  return res.data
}

