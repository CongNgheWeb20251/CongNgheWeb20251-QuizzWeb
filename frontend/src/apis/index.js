import { toast } from 'react-toastify'
// import { API_ROOT } from '../utils/constants' // Không cần nữa vì đã set baseURL trong axios instance
import authorizedAxiosInstance from '~/utils/authorizeAxios'

// Mock API functions - replace with real API calls when backend is ready
// Example: import axios from 'axios'
// const api = axios.create({ baseURL: 'http://localhost:8017/api' })

/**
 * Get all quizzes
 * @returns {Promise<Array>} Array of quiz objects
 */
export async function getQuizzes() {
  // TODO: Replace with real API call
  // const { data } = await api.get('/quizzes')
  // return data
  
  // Mock data
  return [
    {
      id: 'q1',
      title: 'Introduction to Environmental Science',
      subtitle: 'Basic concepts and principles',
      questionsCount: 15,
      duration: 20,
      completions: 28,
      status: 'published',
      avgScore: 78.5,
      topScore: 95,
      avgTime: '12:45',
      recent: [
        { student: 'Alex Johnson', score: 85, time: '15:24', when: '2 hours ago' },
        { student: 'Emma Wilson', score: 92, time: '18:24', when: '2 hours ago' },
        { student: 'Michael Brown', score: 78, time: '14:32', when: '4 hours ago' }
      ],
      questionPerf: [
        { text: 'What is the basic definition of ecology?', pct: 92 },
        { text: 'Which factor is NOT part of the ecosystem?', pct: 88 },
        { text: 'How do organisms adapt to their environment?', pct: 75 }
      ]
    },
    {
      id: 'q2',
      title: 'Advanced Mathematics: Algebra & Calculus',
      subtitle: 'Complex equations and derivatives',
      questionsCount: 12,
      duration: 30,
      completions: 12,
      status: 'published',
      avgScore: 72.3,
      topScore: 89,
      avgTime: '28:15',
      recent: [
        { student: 'Sarah Lee', score: 88, time: '29:45', when: '1 day ago' },
        { student: 'David Smith', score: 75, time: '31:20', when: '1 day ago' }
      ],
      questionPerf: [
        { text: 'Solve for x: 2x² + 5x - 3 = 0', pct: 83 },
        { text: 'Find the derivative of f(x) = 3x³ - 2x', pct: 69 }
      ]
    },
    {
      id: 'q3',
      title: 'Chemistry Fundamentals',
      subtitle: 'Atoms, molecules, and reactions',
      questionsCount: 10,
      duration: 15,
      completions: 5,
      status: 'published',
      avgScore: 81.2,
      topScore: 100,
      avgTime: '14:32',
      recent: [
        { student: 'Lisa Chen', score: 95, time: '13:45', when: '3 days ago' }
      ],
      questionPerf: [
        { text: 'What is the atomic number of Carbon?', pct: 100 },
        { text: 'Balance the equation: H₂ + O₂ → H₂O', pct: 80 }
      ]
    },
    {
      id: 'q4',
      title: 'World History: The Renaissance',
      subtitle: 'Art, science, and culture rebirth',
      questionsCount: 8,
      duration: 12,
      completions: 0,
      status: 'draft',
      avgScore: 0,
      topScore: 0,
      avgTime: '-',
      recent: [],
      questionPerf: []
    },
    {
      id: 'q5',
      title: 'Physics: Motion and Forces',
      subtitle: 'Newton\'s laws and kinematics',
      questionsCount: 14,
      duration: 25,
      completions: 18,
      status: 'published',
      avgScore: 76.8,
      topScore: 92,
      avgTime: '22:10',
      recent: [
        { student: 'John Doe', score: 90, time: '21:30', when: '5 hours ago' },
        { student: 'Jane Doe', score: 88, time: '23:15', when: '6 hours ago' },
        { student: 'Robert Wilson', score: 72, time: '20:45', when: '1 day ago' }
      ],
      questionPerf: [
        { text: 'What is Newtons first law of motion?', pct: 95 },
        { text: 'Calculate the acceleration: F=50N, m=10kg', pct: 82 },
        { text: 'Define velocity and speed', pct: 88 }
      ]
    }
  ]
}

/**
 * Get a single quiz by ID
 * @param {string} id - Quiz ID
 * @returns {Promise<Object>} Quiz object
 */
export async function getQuiz(id) {
  // TODO: Replace with real API call
  // const { data } = await api.get(`/quizzes/${id}`)
  // return data
  
  // Mock data - find quiz or return default
  const allQuizzes = await getQuizzes()
  const quiz = allQuizzes.find(q => q.id === id)
  
  if (quiz) {
    return quiz
  }
  
  // Default if not found
  return {
    id,
    title: 'Sample Quiz',
    subtitle: 'Default quiz for demo',
    questionsCount: 5,
    duration: 10,
    completions: 0,
    status: 'draft',
    avgScore: 0,
    topScore: 0,
    avgTime: '-',
    recent: [],
    questionPerf: []
  }
}

/**
 * Create a new quiz
 * @param {Object} quizData - Quiz data (title, description, questions, etc)
 * @returns {Promise<Object>} Created quiz object
 */
export async function createQuiz(quizData) {
  // TODO: Replace with real API call
  // const { data } = await api.post('/quizzes', quizData)
  // return data

  console.log('Creating quiz:', quizData)
  return {
    id: `q${Date.now()}`,
    ...quizData,
    completions: 0,
    status: 'draft',
    avgScore: 0,
    topScore: 0,
    avgTime: '-',
    recent: [],
    questionPerf: []
  }
}

/**
 * Update quiz
 * @param {string} id - Quiz ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated quiz object
 */
export async function updateQuiz(id, updateData) {
  // TODO: Replace with real API call
  // const { data } = await api.put(`/quizzes/${id}`, updateData)
  // return data
  
  console.log('Updating quiz:', id, updateData)
  return { id, ...updateData }
}

/**
 * Delete a quiz
 * @param {string} id - Quiz ID
 * @returns {Promise<Object>} Response object
 */
export async function deleteQuiz(id) {
  // TODO: Replace with real API call
  // const { data } = await api.delete(`/quizzes/${id}`)
  // return data
  
  console.log('Deleting quiz:', id)
  return { success: true, message: 'Quiz deleted' }
}

/**
 * Publish a quiz (change status from draft to published)
 * @param {string} id - Quiz ID
 * @returns {Promise<Object>} Updated quiz object
 */
export async function publishQuiz(id) {
  // TODO: Replace with real API call
  // const { data } = await api.post(`/quizzes/${id}/publish`)
  // return data
  
  console.log('Publishing quiz:', id)
  return { id, status: 'published' }
}

/**
 * Get quiz responses/completions
 * @param {string} quizId - Quiz ID
 * @returns {Promise<Array>} Array of student responses
 */
export async function getQuizResponses(quizId) {
  // TODO: Replace with real API call
  // const { data } = await api.get(`/quizzes/${quizId}/responses`)
  // return data
  
  console.log('Fetching responses for quiz:', quizId)
  return []
}

/**
 * Export quiz (download as PDF, CSV, etc)
 * @param {string} id - Quiz ID
 * @param {string} format - Export format (pdf, csv, etc)
 * @returns {Promise<Blob>} File blob
 */
export async function exportQuiz(id, format = 'pdf') {
  // TODO: Replace with real API call
  // const { data } = await api.get(`/quizzes/${id}/export?format=${format}`, {
  //   responseType: 'blob'
  // })
  // return data
  
  console.log('Exporting quiz:', id, 'format:', format)
  return new Blob(['Quiz export content'], { type: 'application/octet-stream' })
}

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


