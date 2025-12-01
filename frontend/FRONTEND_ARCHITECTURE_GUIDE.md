# 🏗️ HƯỚNG DẪN KIẾN TRÚC FRONTEND - QUIZZ WEB APPLICATION

> **Mục đích**: Document này giải thích toàn bộ cấu trúc frontend, các folder, hooks, thuật ngữ, và cách chúng liên kết với nhau để giúp bạn hiểu rõ codebase.

---

## 📚 MỤC LỤC

1. [Tổng quan công nghệ](#1-tổng-quan-công-nghệ)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Luồng hoạt động của ứng dụng](#3-luồng-hoạt-động-của-ứng-dụng)
4. [Chi tiết các thành phần](#4-chi-tiết-các-thành-phần)
5. [Các thuật ngữ quan trọng](#5-các-thuật-ngữ-quan-trọng)
6. [Các pattern và best practices](#6-các-pattern-và-best-practices)
7. [Build và Deploy](#7-build-và-deploy)

---

## 1. TỔNG QUAN CÔNG NGHỆ

### 🎯 Core Technologies

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **React** | 19.1.0 | Framework chính để xây dựng UI |
| **Vite** | Latest | Build tool nhanh, thay thế Create React App |
| **Material-UI (MUI)** | 7.2.0 | Component library cho UI đẹp và responsive |
| **Redux Toolkit** | 2.0.1 | Quản lý state toàn cục (global state) |
| **React Router** | 6.21.3 | Điều hướng giữa các trang (routing) |
| **Axios** | 1.5.1 | HTTP client để gọi API |
| **Tailwind CSS** | 4.1.13 | Utility-first CSS framework |

### 🔧 Supporting Libraries

- **redux-persist**: Lưu Redux state vào localStorage (giữ user login sau khi F5)
- **react-toastify**: Hiển thị thông báo (toast notifications)
- **material-ui-confirm**: Dialog xác nhận hành động
- **react-hook-form**: Xử lý form validation
- **socket.io-client**: WebSocket để real-time communication
- **framer-motion**: Animation library
- **moment**: Xử lý date/time

---

## 2. CẤU TRÚC THƯ MỤC

```
frontend/
├── public/                    # Static files (images, icons)
├── src/                       # Source code chính
│   ├── main.jsx              # Entry point của ứng dụng
│   ├── App.jsx               # Component gốc, định nghĩa routes
│   ├── index.css             # Global CSS
│   ├── theme.js              # MUI theme configuration
│   │
│   ├── apis/                 # 🌐 API calls
│   │   ├── index.js          # Các hàm gọi API (getQuizzes, createQuiz...)
│   │   └── mockdata.js       # Mock data cho development
│   │
│   ├── assets/               # 🖼️ Images, icons, fonts
│   │
│   ├── components/           # 🧩 Reusable components
│   │   ├── QuizCard.jsx      # Card hiển thị quiz
│   │   ├── Form/             # Form-related components
│   │   │   ├── FieldErrorAlert.jsx
│   │   │   ├── ToggleFocusInput.jsx
│   │   │   └── VisuallyHiddenInput.jsx
│   │   ├── Loading/
│   │   │   └── PageLoadingSpinner.jsx
│   │   └── UserAvatar/
│   │       └── UserAvatar.jsx
│   │
│   ├── customHooks/          # 🪝 Custom React Hooks
│   │   └── example.js
│   │
│   ├── customLib/            # 📚 Custom utility libraries
│   │   └── example.js
│   │
│   ├── pages/                # 📄 Các trang chính
│   │   ├── Home/             # Trang landing
│   │   ├── SignIn/           # Trang đăng nhập
│   │   ├── Register/         # Trang đăng ký
│   │   ├── Dashboard/        # Trang dashboard (sau khi login)
│   │   ├── Quizzes/          # Trang danh sách & chi tiết quiz
│   │   ├── CreateQuizz/      # Trang tạo quiz (2 steps)
│   │   ├── Settings/         # Trang cài đặt user
│   │   └── Auth/             # Auth-related pages (verification)
│   │
│   ├── redux/                # 🏪 Redux state management
│   │   ├── store.js          # Redux store configuration
│   │   └── user/
│   │       └── userSlice.js  # User state & actions
│   │
│   ├── utils/                # 🛠️ Utility functions
│   │   ├── authorizeAxios.js # Axios instance với interceptors
│   │   ├── constants.js      # Hằng số (API_ROOT, routes...)
│   │   ├── formatter.js      # Format data functions
│   │   └── validators.js     # Validation functions
│   │
│   └── socketClient.js       # WebSocket client setup
│
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint rules
├── jsconfig.json             # JavaScript config (path alias)
└── vercel.json               # Vercel deployment config
```

---

## 3. LUỒNG HOẠT ĐỘNG CỦA ỨNG DỤNG

### 🚀 3.1. Khởi động ứng dụng

```
1. User truy cập website
   ↓
2. Vite serve file index.html
   ↓
3. index.html load main.jsx
   ↓
4. main.jsx setup:
   - Redux Store (với redux-persist)
   - React Router
   - Toast Container
   - Confirm Provider
   ↓
5. Render <App /> component
   ↓
6. App.jsx kiểm tra user authentication
   - Nếu có user → redirect vào /dashboard
   - Nếu chưa login → hiển thị trang Home
```

### 🔐 3.2. Flow Authentication

```
User chưa login:
├── Truy cập / → Home page
├── Click "Sign In" → /signin
├── Nhập email/password
├── Submit form
├── Call API: POST /v1/users/login
├── Server trả về: { accessToken, refreshToken, ...userInfo }
├── Redux: Lưu userInfo vào store
├── redux-persist: Lưu vào localStorage
├── Axios: Lưu tokens vào httpOnly cookies
└── Redirect → /dashboard ✅

User đã login (có data trong localStorage):
├── Truy cập website
├── redux-persist: Load user từ localStorage
├── ProtectedRoute: Kiểm tra có user?
│   ├── ✅ Có → Cho phép truy cập protected routes
│   └── ❌ Không → Redirect về /
└── User có thể access: /dashboard, /quizzes, /settings...
```

### 🔄 3.3. Flow làm việc với API

```
1. Component gọi API function (từ src/apis/index.js)
   ↓
2. API function sử dụng authorizedAxiosInstance
   ↓
3. Axios Interceptor (Request):
   - Tự động thêm credentials (cookies)
   - Hiển thị loading state
   ↓
4. Gửi request đến Backend
   ↓
5. Axios Interceptor (Response):
   - ✅ Success (2xx): Tắt loading, return data
   - ❌ 410 (Token expired): Tự động refresh token → retry request
   - ❌ 401 (Unauthorized): Logout user
   - ❌ Other errors: Hiển thị toast error
   ↓
6. Component nhận data và update UI
```

---

## 4. CHI TIẾT CÁC THÀNH PHẦN

### 📂 4.1. `src/main.jsx` - Entry Point

**Vai trò**: File đầu tiên được chạy, setup toàn bộ ứng dụng.

```jsx
// Các bước setup:
1. Tạo Redux Store
2. Setup redux-persist (lưu state vào localStorage)
3. Inject store vào axios (để axios có thể dispatch logout)
4. Wrap App với:
   - Provider (Redux)
   - PersistGate (chờ load state từ localStorage)
   - BrowserRouter (routing)
   - ConfirmProvider (confirm dialogs)
5. Render App component
```

**Liên kết**:
- → `App.jsx`: Component chính
- → `redux/store.js`: Redux store
- → `utils/authorizeAxios.js`: Inject store để logout

---

### 📂 4.2. `src/App.jsx` - Root Component

**Vai trò**: Định nghĩa routing và bảo vệ routes.

```jsx
// Routes structure:
- Public routes (LoginedRedirect):
  / → Home
  /signin → SignIn
  /signup → Register
  /account/verification → Account Verification
  
- Protected routes (ProtectedRoute):
  /dashboard → Dashboard (chỉ truy cập khi đã login)
  /quizzes → Quizzes list
  /quizzes/:id → Quiz detail
  /create-quiz/step1 → Create quiz step 1
  /create-quiz/step2 → Create quiz step 2
  /settings → User settings
```

**Components đặc biệt**:
- `ProtectedRoute`: Kiểm tra user, chưa login → redirect về `/`
- `LoginedRedirect`: Đã login → redirect về `/dashboard`

**Liên kết**:
- → Tất cả pages trong `src/pages/`
- → `redux/user/userSlice.js`: Lấy `currentUser`

---

### 📂 4.3. `src/redux/` - State Management

#### **4.3.1. Tại sao cần Redux?**

Trong React, mỗi component có state riêng (local state). Khi app lớn, việc truyền data giữa components (prop drilling) rất phức tạp.

**Redux giải quyết bằng cách**:
- Tạo một **global store** chứa state của cả app
- Mọi component có thể **read/write** vào store này
- Khi state thay đổi, các component liên quan tự động re-render

#### **4.3.2. Redux Flow**

```
Component → dispatch(action) → reducer → update store → component re-render
```

#### **4.3.3. File `store.js`**

```javascript
// Setup:
- Combine reducers: { user: userReducer }
- Config redux-persist: Lưu state 'user' vào localStorage
- Export store để wrap App

// Tại sao cần redux-persist?
// Khi F5 page, Redux state bị reset về initial
// redux-persist giúp lưu state vào localStorage và restore lại
```

#### **4.3.4. File `user/userSlice.js`**

```javascript
// State:
currentUser: null | { email, displayName, avatar, ... }

// Sync Actions (reducers):
updateCurrentUser(state, action) - Update user thủ công

// Async Actions (extraReducers):
loginUserAPI() - Login và lưu user
loginAuth0API() - Login với Google
updateUserAPI() - Update thông tin user
logoutUserAPI() - Logout và clear user

// Selectors:
selectCurrentUser(state) - Lấy currentUser từ store
```

**Cách sử dụng trong component**:

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, loginUserAPI } from '~/redux/user/userSlice'

function MyComponent() {
  // Đọc data từ store
  const user = useSelector(selectCurrentUser)
  
  // Dispatch action để update store
  const dispatch = useDispatch()
  
  const handleLogin = (credentials) => {
    dispatch(loginUserAPI(credentials))
  }
  
  return <div>{user?.email}</div>
}
```

---

### 📂 4.4. `src/utils/authorizeAxios.js` - HTTP Client

**Vai trò**: Tạo axios instance với interceptors để tự động xử lý authentication.

#### **Tính năng**:

1. **BaseURL**: Tự động thêm `API_ROOT` vào mọi request
2. **Credentials**: Gửi cookies (chứa JWT tokens) trong mọi request
3. **Request Interceptor**:
   - Hiển thị loading indicator
4. **Response Interceptor**:
   - ✅ Success: Tắt loading
   - ❌ 410 (Token expired): Tự động gọi `refreshTokenAPI()` → retry request
   - ❌ 401 (Unauthorized): Logout user
   - ❌ Other errors: Hiển thị toast notification

#### **Tại sao cần Interceptor?**

Thay vì mỗi API call phải:
```javascript
try {
  const response = await axios.get('/api/data')
  // Handle success
} catch (error) {
  if (error.status === 401) logout()
  if (error.status === 410) refreshToken()
  // Handle error
}
```

Interceptor tự động làm tất cả ở 1 nơi!

---

### 📂 4.5. `src/apis/index.js` - API Functions

**Vai trò**: Tập trung tất cả API calls vào một file.

```javascript
// Quiz APIs (đang dùng mock data)
getQuizzes() - Lấy danh sách quizzes
getQuiz(id) - Lấy chi tiết quiz
createQuiz(data) - Tạo quiz mới
updateQuiz(id, data) - Update quiz
deleteQuiz(id) - Xóa quiz
publishQuiz(id) - Publish quiz
getQuizResponses(id) - Lấy responses của quiz
exportQuiz(id) - Export quiz

// User APIs (đã connect backend)
registerUserAPI(data) - Đăng ký
verifyUserAPI(data) - Verify email
forgotPassAPI(data) - Quên mật khẩu
resetPasswordAPI(data) - Reset mật khẩu
refreshTokenAPI() - Refresh access token

// Dashboard APIs
getDashboardStatsAPI() - Thống kê dashboard
getTopStudentsAPI(limit) - Top students
getRecentQuizzesAPI(limit) - Recent quizzes
```

**Pattern**:
```javascript
// Mock (development)
export async function getQuizzes() {
  // TODO: Real API call (commented)
  // const response = await authorizedAxiosInstance.get('/v1/quizzes')
  // return response.data
  
  // Mock data
  return [ /* mock quizzes */ ]
}
```

---

### 📂 4.6. `src/components/` - Reusable Components

#### **4.6.1. QuizCard**
- Hiển thị thông tin một quiz (card)
- Props: `{ id, title, subtitle, questionsCount, duration, completions }`
- Actions: View (navigate to detail), More (menu options)

#### **4.6.2. Form Components**

**FieldErrorAlert**: Hiển thị error message cho form field
```jsx
<FieldErrorAlert errors={errors} fieldName="email" />
// Hiển thị: errors.email.message
```

**ToggleFocusInput**: Input chuyển đổi giữa text và input khi focus
```jsx
<ToggleFocusInput 
  value={title} 
  onChangedValue={(newValue) => setTitle(newValue)} 
/>
// Khi blur: trim value và callback nếu có thay đổi
```

**VisuallyHiddenInput**: Input file ẩn để custom upload button
```jsx
<Button component="label">
  Upload
  <VisuallyHiddenInput type="file" onChange={handleUpload} />
</Button>
```

#### **4.6.3. Loading Components**

**PageLoadingSpinner**: Full-screen loading indicator
```jsx
<PageLoadingSpinner caption="Loading..." />
```

#### **4.6.4. UserAvatar**
- Hiển thị avatar + dropdown menu
- Menu: Settings, Logout (với confirm dialog)
- Lấy user từ Redux store

---

### 📂 4.7. `src/pages/` - Pages

Mỗi page là một component đại diện cho một route.

#### **Structure của một page**:
```
PageFolder/
├── PageName.jsx      # Component chính
└── PageName.css      # Styles riêng
```

#### **Các pages chính**:

| Page | Route | Mô tả |
|------|-------|-------|
| Home | `/` | Landing page |
| SignIn | `/signin` | Form đăng nhập |
| Register | `/signup` | Form đăng ký |
| Dashboard | `/dashboard` | Tổng quan (stats, recent quizzes) |
| Quizzes | `/quizzes` | Danh sách quizzes |
| QuizDetail | `/quizzes/:id` | Chi tiết quiz với stats |
| CreateQuizStep1 | `/create-quiz/step1` | Tạo quiz: Thông tin cơ bản |
| CreateQuizStep2 | `/create-quiz/step2` | Tạo quiz: Thêm câu hỏi |
| Settings | `/settings` | Cài đặt user (profile, password) |

---

### 📂 4.8. `src/customHooks/` - Custom Hooks

**Tại sao cần Custom Hooks?**

Custom hooks giúp tái sử dụng logic giữa các components.

**Ví dụ**: Hook để fetch data
```javascript
// src/customHooks/useFetchQuizzes.js
import { useState, useEffect } from 'react'
import { getQuizzes } from '~/apis'

export function useFetchQuizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    getQuizzes().then(data => {
      setQuizzes(data)
      setLoading(false)
    })
  }, [])
  
  return { quizzes, loading }
}

// Sử dụng trong component:
function QuizzesPage() {
  const { quizzes, loading } = useFetchQuizzes()
  if (loading) return <Loading />
  return <QuizList quizzes={quizzes} />
}
```

---

### 📂 4.9. `src/utils/` - Utilities

#### **constants.js**
```javascript
export const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:8017/api'
// Các hằng số khác: routes, regex patterns, config values
```

#### **validators.js**
```javascript
// Validation functions
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const isStrongPassword = (pwd) => pwd.length >= 8
```

#### **formatter.js**
```javascript
// Format functions
export const formatDate = (date) => moment(date).format('DD/MM/YYYY')
export const formatCurrency = (amount) => `$${amount.toFixed(2)}`
```

---

## 5. CÁC THUẬT NGỮ QUAN TRỌNG

### 🎯 5.1. React Concepts

| Thuật ngữ | Giải thích | Ví dụ |
|-----------|------------|-------|
| **Component** | Khối UI độc lập, tái sử dụng được | `<QuizCard />` |
| **Props** | Dữ liệu truyền từ parent → child | `<QuizCard quiz={data} />` |
| **State** | Dữ liệu thay đổi trong component | `const [count, setCount] = useState(0)` |
| **Hook** | Function đặc biệt để sử dụng React features | `useState`, `useEffect`, `useSelector` |
| **JSX** | Syntax mở rộng của JS, viết HTML trong JS | `return <div>Hello</div>` |

### 🎯 5.2. Redux Concepts

| Thuật ngữ | Giải thích |
|-----------|------------|
| **Store** | Nơi lưu trữ state toàn cục |
| **Action** | Object mô tả "điều gì xảy ra" (type + payload) |
| **Reducer** | Function xử lý action và update state |
| **Dispatch** | Gửi action đến reducer |
| **Selector** | Function lấy data từ store |
| **Slice** | Tập hợp reducer, actions cho một feature |

### 🎯 5.3. Routing Concepts

| Thuật ngữ | Giải thích |
|-----------|------------|
| **Route** | Ánh xạ URL → Component |
| **Navigate** | Điều hướng đến route khác (programmatically) |
| **Link** | Component điều hướng (như thẻ `<a>`) |
| **Params** | Tham số động trong URL (`/quiz/:id`) |
| **Protected Route** | Route chỉ truy cập khi authenticated |

### 🎯 5.4. HTTP & API Concepts

| Thuật ngữ | Giải thích |
|-----------|------------|
| **Axios** | Library để gọi HTTP requests |
| **Interceptor** | Middleware can thiệp vào request/response |
| **Bearer Token** | Token đính kèm trong header để authenticate |
| **httpOnly Cookie** | Cookie chỉ server đọc được (bảo mật hơn localStorage) |
| **CORS** | Cross-Origin Resource Sharing (cho phép frontend gọi backend khác domain) |

---

## 6. CÁC PATTERN VÀ BEST PRACTICES

### 🔥 6.1. Component Organization

```
Feature-based structure:
pages/
  Dashboard/
    Dashboard.jsx      # Main component
    Dashboard.css      # Styles
    components/        # Components chỉ dùng cho Dashboard
      StatsCard.jsx
      RecentActivity.jsx
```

### 🔥 6.2. State Management Strategy

```
Local State (useState):
- UI state: modal open/close, form input values
- Component-specific data không cần share

Global State (Redux):
- User authentication
- Shared data: theme, language
- Data cần persist sau F5
```

### 🔥 6.3. API Call Pattern

```javascript
// ❌ Bad: Gọi axios trực tiếp trong component
function MyComponent() {
  useEffect(() => {
    axios.get('http://backend.com/api/quizzes').then(...)
  }, [])
}

// ✅ Good: Tạo API function trong apis/index.js
function MyComponent() {
  useEffect(() => {
    getQuizzes().then(setQuizzes)
  }, [])
}
```

### 🔥 6.4. Import Alias

```javascript
// ❌ Bad: Relative imports
import QuizCard from '../../../components/QuizCard'

// ✅ Good: Alias với ~
import QuizCard from '~/components/QuizCard'

// Config trong vite.config.js:
resolve: {
  alias: [{ find: '~', replacement: '/src' }]
}
```

### 🔥 6.5. Environment Variables

```javascript
// .env.development
VITE_API_ROOT=http://localhost:8017/api

// .env.production
VITE_API_ROOT=https://api.production.com

// Sử dụng:
const API_ROOT = import.meta.env.VITE_API_ROOT
```

---

## 7. BUILD VÀ DEPLOY

### 🛠️ 7.1. Development

```bash
# Cài đặt dependencies
npm install

# Chạy dev server (hot reload)
npm run dev
# → http://localhost:5173

# Lint code
npm run lint
```

**Dev server features**:
- Hot Module Replacement (HMR): Tự động reload khi sửa code
- Fast Refresh: Giữ state khi reload
- Vite: Build cực nhanh (~100-500ms)

### 🛠️ 7.2. Production Build

```bash
# Build cho production
npm run build
# → Output: dist/ folder

# Preview production build
npm run preview
```

**Build process**:
1. Vite bundle tất cả JS/CSS
2. Minify code (loại bỏ whitespace, shorten variables)
3. Code splitting (tách thành nhiều chunks)
4. Tree shaking (loại bỏ code không dùng)
5. Output: `dist/` folder

### 🛠️ 7.3. Deployment (Vercel)

**Cấu hình trong `vercel.json`**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
→ Đảm bảo React Router hoạt động (mọi route đều serve `index.html`)

**Deploy steps**:
1. Push code lên GitHub
2. Connect GitHub repo với Vercel
3. Vercel tự động:
   - Detect Vite project
   - Run `npm run build`
   - Deploy `dist/` folder
   - Tạo domain: `https://your-app.vercel.app`

---

## 8. WORKFLOW LÀM VIỆC

### 📝 8.1. Thêm một trang mới

```
1. Tạo component trong src/pages/
   NewPage/
   ├── NewPage.jsx
   └── NewPage.css

2. Thêm route trong App.jsx:
   <Route path="/new-page" element={<NewPage />} />

3. (Optional) Thêm navigation:
   <Link to="/new-page">Go to New Page</Link>
```

### 📝 8.2. Thêm API mới

```
1. Thêm function trong src/apis/index.js:
   export async function getNewData() {
     const response = await authorizedAxiosInstance.get('/v1/new-data')
     return response.data
   }

2. Sử dụng trong component:
   import { getNewData } from '~/apis'
   
   useEffect(() => {
     getNewData().then(setData)
   }, [])
```

### 📝 8.3. Thêm Redux slice mới

```
1. Tạo file src/redux/feature/featureSlice.js:
   - initialState
   - reducers
   - extraReducers (async)
   - selectors

2. Thêm vào store.js:
   const reducers = combineReducers({
     user: userReducer,
     feature: featureReducer  // ← new
   })

3. Sử dụng:
   const data = useSelector(selectFeatureData)
   dispatch(updateFeature(newData))
```

---

## 9. DEBUGGING TIPS

### 🐛 9.1. Redux DevTools

Install extension: **Redux DevTools**
- Xem state hiện tại
- Xem history của actions
- Time-travel debugging

### 🐛 9.2. React DevTools

Install extension: **React Developer Tools**
- Inspect component tree
- Xem props/state của từng component
- Profile performance

### 🐛 9.3. Network Tab

F12 → Network tab:
- Xem tất cả API requests
- Kiểm tra request/response headers
- Debug CORS, authentication issues

### 🐛 9.4. Console Logging

```javascript
// Log state
console.log('Current user:', currentUser)

// Log API response
getQuizzes().then(data => console.log('Quizzes:', data))

// Log Redux actions
dispatch(loginUserAPI(credentials))
console.log('Login action dispatched')
```

---

## 10. ROADMAP HỌC TẬP

### 📚 Level 1: Cơ bản
1. ✅ Hiểu React components, props, state
2. ✅ Hiểu JSX syntax
3. ✅ Sử dụng hooks: useState, useEffect
4. ✅ Hiểu routing với React Router

### 📚 Level 2: Trung cấp
1. ✅ Hiểu Redux flow: action → reducer → store
2. ✅ Sử dụng useSelector, useDispatch
3. ✅ Hiểu async actions với createAsyncThunk
4. ✅ Gọi API với axios

### 📚 Level 3: Nâng cao
1. ✅ Tạo custom hooks
2. ✅ Hiểu axios interceptors
3. ✅ Optimize performance (React.memo, useMemo)
4. ✅ Error boundaries
5. ✅ Code splitting & lazy loading

---

## 11. TÀI LIỆU THAM KHẢO

### 📖 Official Docs
- React: https://react.dev
- Redux Toolkit: https://redux-toolkit.js.org
- React Router: https://reactrouter.com
- Material-UI: https://mui.com
- Vite: https://vitejs.dev
- Axios: https://axios-http.com

### 📖 Learning Resources
- React Tutorial: https://react.dev/learn
- Redux Tutorial: https://redux.js.org/tutorials/essentials/part-1-overview-concepts
- JavaScript ES6+: https://javascript.info

---

## 12. CHECKLIST KHI LÀM VIỆC

### ✅ Trước khi code
- [ ] Đọc requirement kỹ
- [ ] Xác định component/page nào cần tạo/sửa
- [ ] Xác định state management (local vs global)
- [ ] Xác định API endpoints cần gọi

### ✅ Khi code
- [ ] Tên component/function rõ ràng
- [ ] Extract reusable logic thành custom hooks
- [ ] Handle loading & error states
- [ ] Validate input (form validation)
- [ ] Console.log để debug

### ✅ Sau khi code
- [ ] Test trên browser (UI, interactions)
- [ ] Check Redux DevTools (state updates)
- [ ] Check Network tab (API calls)
- [ ] Check responsive (mobile, tablet)
- [ ] Run `npm run lint` để check lỗi
- [ ] Commit code với message rõ ràng

---

## 13. CONTACT & SUPPORT

Nếu có thắc mắc:
1. Đọc lại document này
2. Search trong codebase (Ctrl+Shift+F)
3. Check official docs
4. Hỏi team members

---

**🎉 Chúc bạn học tập và coding vui vẻ!**

*Document version: 1.0*  
*Last updated: November 30, 2025*
