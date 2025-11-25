import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from "axios";
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sort'

// Khởi tạo giá trị của một cái slice ban đầu trong Redux
const initialState = {
  currentActiveQuizz: null
}

// Các hành động gọi api bất đồng bộ và cập nhật dữ liệu vào redux dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchQuizzDetailsAPI = createAsyncThunk(
  'activeQuizz/fetchQuizzDetails',
  async (quizzId) => {
    const response = await authorizedAxiosInstance.get(`/v1/quizzes/${quizzId}`)
    return response.data
  }
)

// Khởi tạo một slice trong kho lưu trữ Redux Store
export const activeQuizzSlice = createSlice({
  name: 'activeQuizz',
  initialState,
  // reducers là nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveQuizz: (state, action) => {

      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, đặt tên biến fullQuizz cho rõ nghĩa
      const fullQuizz = action.payload

      // Xử lí dữ liệu
      // ...
      // update lại dữ liệu currentActiveQuizz trong state
      // state.currentActiveQuizz = action.payload
      state.currentActiveQuizz = fullQuizz
    }
  },
  // extraReducers là nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchQuizzDetailsAPI.fulfilled, (state, action) => {
      let quizz = action.payload
      // Xử lí dữ liệu
      // Sắp xếp thứ tự column theo columnOrderIds từ trên root cao nhất
      quizz.questions = mapOrder(
        quizz?.questions,
        quizz?.questionOrderIds,
        '_id'
      )
      quizz.questions.forEach((question) => {
        question.options = mapOrder(question?.options, question?.optionOrderIds, '_id')

      })
      // action.payload là dữ liệu trả về từ API (response.data)
      state.currentActiveQuizz = quizz
    })
  }
})

// Actions: là nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật dữ liệu thông qua reducer chạy đồng bộ
// actions là các hàm được tạo ra từ reducers bên trên, mỗi hàm tương ứng với một action
export const { updateCurrentActiveQuizz } = activeQuizzSlice.actions

//Selectors: là nơi dành cho các component bên dưới gọi bằng hook userSelector để lấy dữ liệu từ state (trong kho Redux Store) về
export const selectCurrentActiveQuizz = (state) => {
  return state.activeQuizz.currentActiveQuizz
}

// Export default reducer để kho lưu trữ Redux Store có thể sử dụng
export const activeQuizzReducer = activeQuizzSlice.reducer