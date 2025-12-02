import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { activeQuizzReducer } from './activeQuizz/activeQuizzSlice'

// https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
// https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
// https://www.npmjs.com/package/redux-persist

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// dùng redux-persist để cấu hình lưu trữ Redux state để khi f5 state sẽ không bị set trở về mặc định
// Lưu trữ Redux state vào local storage
const rootPersistConfig = {
  key: 'root',
  storage : storage,
  whitelist: ['user', 'activeQuizz'] // choose which reducers to persist (user)
}

const reducers = combineReducers({
  user: userReducer,
  activeQuizz: activeQuizzReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }) // Cấu hình middleware đảm bảo tính tương thích giữa persist và redux-toolkit
})