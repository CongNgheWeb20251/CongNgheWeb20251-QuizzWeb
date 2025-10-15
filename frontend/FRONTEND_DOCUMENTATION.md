# 📚 QUIZZY - Frontend Documentation

> **Tài liệu tổng hợp về cấu trúc, công nghệ và kiến trúc Frontend của dự án Quiz Web Application**

---

## 📋 Mục lục

- [1. Tổng quan dự án](#1-tổng-quan-dự-án)
- [2. Tech Stack](#2-tech-stack)
- [3. Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
- [4. Kiến trúc ứng dụng](#4-kiến-trúc-ứng-dụng)
- [5. Chi tiết các thành phần](#5-chi-tiết-các-thành-phần)
- [6. Styling & Design System](#6-styling--design-system)
- [7. Routing](#7-routing)
- [8. State Management](#8-state-management)
- [9. API Integration](#9-api-integration)
- [10. Build & Deployment](#10-build--deployment)

---

## 1. Tổng quan dự án

**Quizzy** là một nền tảng quiz trực tuyến cho phép:
- Người dùng tạo và quản lý quiz
- Tham gia quiz và nhận kết quả real-time
- Theo dõi điểm số và thống kê
- Thi đấu với người dùng khác

### 🎯 Mục tiêu
- UI/UX hiện đại, responsive
- Performance cao với Vite + React 19
- Code modular, dễ maintain
- Support real-time features với Socket.IO

---

## 2. Tech Stack

### 🔧 Core Technologies

| Thành phần                               | Vai trò chính                            | Liên kết                                   |
| ---------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| **UI Layer**                             | Hiển thị và nhận tương tác từ người dùng | Gửi action hoặc form data xuống Redux/Form |
| **Redux Store**                          | Giữ toàn bộ state của ứng dụng           | Nhận dữ liệu từ API, Form, hoặc Socket     |
| **Axios**                                | Giao tiếp backend qua HTTP               | Fetch/update dữ liệu từ server             |
| **Socket.IO**                            | Kênh real-time song song với API         | Cập nhật live dữ liệu (chat, status, v.v.) |
| **Auth0 React**                          | Quản lý người dùng, token                | Giữ trạng thái đăng nhập, xác thực         |
| **Redux Persist**                        | Giữ dữ liệu Redux sau reload             | Lưu localStorage                           |
| **React Hook Form**                      | Quản lý input form                       | Kết hợp với MUI UI                         |
| **Lodash & Moment**                      | Tiện ích xử lý dữ liệu                   | Tích hợp trong logic business              |
| **Framer Motion / Toastify / Driver.js** | Cải thiện trải nghiệm                    | Animate, notify, hướng dẫn                 |
| **dotenv + cross-env**                   | Cấu hình biến môi trường                 | Config backend endpoint                    |


## 3. Cấu trúc thư mục

```
frontend/
├── 📁 public/                      # Static assets (served as-is)
│   └── favicon, images, etc.
│
├── 📁 src/                         # Source code chính
│   ├── 📄 main.jsx                # Entry point - Mount React app
│   ├── 📄 App.jsx                 # Root component - Router setup
│   ├── 📄 App.css                 # Global styles (Tailwind import)
│   ├── 📄 index.css               # Base CSS reset & global styles
│   ├── 📄 theme.js                # MUI theme configuration (chưa config)
│   ├── 📄 socketClient.js         # Socket.IO client setup (chưa config)
│   │
│   ├── 📁 pages/                  # Page components (Routes)
│   │   ├── Home/                  # Home page (Landing)
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── CreateQuizz/           # Create quiz page
│   │   │   ├── CreateQuizzStep1.jsx
│   │   │   └── CreateQuizzStep1.css
│   │   ├── Auth/                  # Authentication pages (placeholder)
│   │   │   └── example.jsx
│   │   ├── Settings/              # Settings page (placeholder)
│   │   │   └── example.jsx
│   │   └── 404/                   # Not found page (placeholder)
│   │       └── example.jsx
│   │
│   ├── 📁 apis/                   # API configuration & services
│   │   ├── index.js               # Axios instance & interceptors (empty)
│   │   └── mockdata.js            # Mock data for development
│   │
│   ├── 📁 assets/                 # Images, icons, fonts
│   │   └── (empty - for future use)
│   │
│   ├── 📁 customHooks/            # Custom React hooks
│   │   └── example.js             # Placeholder for custom hooks
│   │
│   └── 📁 customLib/              # Custom utility libraries
│       └── example.js             # Placeholder for utilities
│
├── 📁 landing_page/               # Static HTML landing page (separate)
│   ├── quizzy.html
│   └── quizzy.css
│
├── 📁 create quiz/                # Static HTML create quiz page (separate)
│   ├── index.html
│   ├── styles.css
│   ├── README.md
│   └── assets/
│       └── .gitkeep
│
├── 📄 index.html                  # Vite entry HTML
├── 📄 vite.config.js              # Vite configuration
├── 📄 jsconfig.json               # JavaScript config (path aliases)
├── 📄 eslint.config.js            # ESLint configuration
├── 📄 vercel.json                 # Vercel deployment config
├── 📄 package.json                # Dependencies & scripts
├── 📄 package-lock.json           # Lock file for npm
├── 📄 yarn.lock                   # Lock file for yarn (unused)
├── 📄 pages-launcher.html         # Dev utility - links to all pages
├── 📄 HOW_TO_RUN_PAGES.md         # Guide for running the project
└── 📄 .gitignore                  # Git ignore rules
```

---

## 4. Kiến trúc ứng dụng

### 🏗️ Architecture Pattern

Dự án sử dụng **Component-Based Architecture** với **Client-Side Routing**:

```
┌─────────────────────────────────────────────┐
│           index.html (Vite Entry)           │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│            main.jsx (Entry Point)           │
│  • StrictMode                               │
│  • BrowserRouter                            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              App.jsx (Root)                 │
│  • Routes configuration                     │
│  • Global layout                            │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌──────────────────┐
│   Home Page   │    │ CreateQuizz Page │
│   (/)         │    │ (/create/step1)  │
└───────────────┘    └──────────────────┘
```

### 📂 Separation of Concerns

```
Presentation Layer (UI)
├── pages/          → Full page components (connected to router)
├── components/     → Reusable UI components (future)
└── assets/         → Static resources

Business Logic Layer
├── customHooks/    → Custom React hooks for logic reuse
├── customLib/      → Utility functions & helpers
└── apis/           → API calls & data fetching

State Management Layer
├── Redux Store     → Global state (via Redux Toolkit)
└── Redux Persist   → Persist state to localStorage

Communication Layer
├── socketClient.js → Real-time WebSocket connection
└── apis/index.js   → HTTP client (Axios)
```

---

## 5. Chi tiết các thành phần

### 📄 Core Files

#### `main.jsx` - Entry Point
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

**Chức năng:**
- Mount React app vào DOM (`#root`)
- Wrap app trong `StrictMode` (development warnings)
- Setup `BrowserRouter` cho routing
- Enable React Router v7 future flags

---

#### `App.jsx` - Root Component
```jsx
import { Routes, Route } from 'react-router-dom'
import Home from '~/pages/Home/Home.jsx'
import CreateQuizzStep1 from '~/pages/CreateQuizz/CreateQuizzStep1.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/create/step1' element={<CreateQuizzStep1 />} />
    </Routes>
  )
}
```

**Chức năng:**
- Define all routes
- Map URL paths to page components
- Current routes:
  - `/` → Home page (Landing)
  - `/create/step1` → Create Quiz Step 1

---

#### `vite.config.js` - Build Configuration
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
```

**Chức năng:**
- **react()**: React plugin with SWC compiler (faster than Babel)
- **svgr()**: Import SVG as React components
- **tailwindcss()**: Tailwind CSS integration
- **alias**: `~` → `/src` (cleaner imports)

**Example:**
```jsx
// Instead of: import Home from '../../../pages/Home/Home'
import Home from '~/pages/Home/Home'
```

---

#### `jsconfig.json` - Path Aliases
```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

**Chức năng:**
- Configure path alias for IDE autocomplete
- Works with `vite.config.js` alias

---

#### `eslint.config.js` - Code Quality Rules
```javascript
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite
    ],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-console': 1,
      'semi': [1, 'never'],
      'quotes': ['error', 'single'],
      'indent': ['warn', 2],
      // ... more rules
    }
  }
])
```

**Quy tắc chính:**
- ✅ Single quotes
- ✅ No semicolons
- ✅ 2-space indentation
- ✅ React Hooks rules
- ⚠️ Console warnings (not errors)

---

### 📁 Pages

#### `pages/Home/` - Landing Page

**File:** `Home.jsx`, `Home.css`

**Chức năng:**
- Landing page với hero section
- Quiz categories showcase
- Call-to-action buttons
- Navigation to create quiz page

**Sections:**
```jsx
<Header />           // Navigation bar
<HeroSection />      // Main banner with CTA
<CategoriesSection /> // Quiz categories grid
<WeeklySection />    // Weekly quiz highlights
<RewardsSection />   // Rewards & achievements
<Footer />           // Footer links
```

**Key Features:**
- Responsive design with CSS Grid/Flexbox
- Gradient text effects
- Glassmorphism UI
- Animation on hover
- Navigate to `/create/step1` on "Get Started"

---

#### `pages/CreateQuizz/` - Create Quiz Wizard

**File:** `CreateQuizzStep1.jsx`, `CreateQuizzStep1.css`

**Chức năng:**
- Step 1 of multi-step quiz creation
- Form với validation
- Quiz basic information input

**Form Fields:**
```jsx
{
  quizTitle: string,         // Max 100 chars
  description: string,       // Max 500 chars
  category: select,          // Science, Math, etc.
  difficulty: select,        // Easy, Medium, Hard
  duration: number,          // Minutes
  totalQuestions: number,
  passingScore: number,      // Percentage
  randomizeQuestions: boolean,
  showCorrectAnswer: boolean,
  enableTimer: boolean,
  allowRetake: boolean
}
```

**UI Components:**
- Top bar with Back/Save Draft/Preview buttons
- Two-column layout (Details | Settings)
- Form validation
- Bottom navigation (Previous/Next buttons)

---

### 📁 Static HTML Pages (Legacy)

#### `landing_page/` - Static Landing
- **quizzy.html**: Pure HTML landing page
- **quizzy.css**: Styling
- **Purpose**: Static version before React conversion

#### `create quiz/` - Static Create Quiz
- **index.html**: Pure HTML form
- **styles.css**: Styling
- **Purpose**: Static prototype, now replaced by React version

> **Note:** These are separate from the React app and served independently.

---

### 📁 APIs

#### `apis/index.js` - Axios Configuration (Placeholder)
```javascript
// import axios from "axios";
// TODO: Setup axios instance with:
// - Base URL
// - Interceptors for auth tokens
// - Error handling
```

**Planned structure:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8017/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

#### `apis/mockdata.js` - Mock Data
**Purpose:** Dummy data for development/testing

---

### 📁 Custom Hooks (Planned)

#### `customHooks/` - Reusable Logic

**Planned hooks:**
```javascript
// useAuth.js - Authentication state
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // ...login, logout, register logic
  return { user, loading, login, logout, register };
}

// useQuiz.js - Quiz operations
export function useQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const fetchQuizzes = async () => { /* API call */ };
  return { quizzes, fetchQuizzes, createQuiz, deleteQuiz };
}

// useTimer.js - Quiz timer
export function useTimer(initialTime) {
  const [time, setTime] = useState(initialTime);
  const start = () => { /* start timer */ };
  const pause = () => { /* pause timer */ };
  return { time, start, pause, reset };
}

// useSocket.js - WebSocket connection
export function useSocket() {
  const [connected, setConnected] = useState(false);
  // Setup socket listeners
  return { socket, connected, emit };
}
```

---

### 📁 Custom Libraries (Planned)

#### `customLib/` - Utility Functions

**Planned utilities:**
```javascript
// validation.js - Form validators
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (pwd) => pwd.length >= 8;

// formatters.js - Data formatters
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// constants.js - App constants
export const QUIZ_CATEGORIES = ['Science', 'Math', 'History', 'Geography'];
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];
```

---

## 6. Styling & Design System

### 🎨 Styling Approach

Dự án sử dụng **Hybrid Styling Strategy**:

```
Tailwind CSS (Utility-first)
      ↓
Material-UI (Component library)
      ↓
CSS Modules (Component-specific)
      ↓
Emotion (CSS-in-JS for MUI)
```

---

### 🎨 Tailwind CSS

**Configuration:** `App.css`
```css
@import "tailwindcss";
```

**Usage:**
```jsx
<div className="flex items-center justify-center gap-4 p-6 bg-gray-100 rounded-lg">
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

**Benefits:**
- Rapid prototyping
- Consistent spacing/colors
- Responsive utilities
- Small bundle size (purged)

---

### 🎨 Material-UI (MUI)

**Version:** 7.2.0 (latest)

**Components available:**
- Buttons, Inputs, Cards, Modals
- DataGrid, Autocomplete
- Icons (@mui/icons-material)
- Lab components (experimental)

**Usage example:**
```jsx
import { Button, TextField, Card } from '@mui/material';
import { DeleteIcon } from '@mui/icons-material';

<Card>
  <TextField label="Quiz Title" variant="outlined" />
  <Button variant="contained" startIcon={<DeleteIcon />}>
    Delete
  </Button>
</Card>
```

---

### 🎨 CSS Modules

**Convention:** `ComponentName.module.css`

**Example:** `Home.css` (not using .module yet)
```css
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
}

.category-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
```

---

### 🎨 Design Tokens (Planned)

**Color Palette:**
```css
:root {
  /* Primary */
  --color-purple: #8b5cf6;
  --color-purple-dark: #7c3aed;
  
  /* Secondary */
  --color-orange: #f97316;
  --color-green: #10b981;
  --color-pink: #ec4899;
  --color-blue: #3b82f6;
  
  /* Neutral */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* Semantic */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

**Typography:**
```css
:root {
  --font-primary: 'Roboto', sans-serif;
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
}
```

**Spacing:**
```css
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
}
```

---

## 7. Routing

### 🛣️ React Router v6

**Setup:** `main.jsx` + `App.jsx`

**Current Routes:**

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home.jsx` | Landing page |
| `/create/step1` | `CreateQuizzStep1.jsx` | Create quiz - Step 1 |

---

**Planned Routes:**

```jsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Quiz routes */}
  <Route path="/quizzes" element={<QuizList />} />
  <Route path="/quizzes/:id" element={<QuizDetail />} />
  <Route path="/quizzes/:id/play" element={<PlayQuiz />} />
  <Route path="/quizzes/:id/result" element={<QuizResult />} />
  
  {/* Protected routes */}
  <Route element={<PrivateRoute />}>
    <Route path="/create/step1" element={<CreateQuizzStep1 />} />
    <Route path="/create/step2" element={<CreateQuizzStep2 />} />
    <Route path="/create/step3" element={<CreateQuizzStep3 />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
  
  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

### 🔒 Protected Routes (Planned)

```jsx
// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/customHooks/useAuth';

export function PrivateRoute() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
```

---

## 8. State Management

### 🗄️ Redux Toolkit

**Dependencies:**
- `@reduxjs/toolkit` - State management
- `react-redux` - React bindings
- `redux-persist` - Persist to localStorage

---

**Planned Store Structure:**

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import userReducer from './slices/userSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'] // Only persist these
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authReducer),
    quiz: quizReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export const persistor = persistStore(store);
```

---

**Example Slice:**

```javascript
// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '~/apis';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

**Usage in Components:**

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { login } from '~/store/slices/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const handleLogin = (email, password) => {
    dispatch(login({ email, password }));
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
```

---

## 9. API Integration

### 🌐 HTTP Client (Axios)

**File:** `apis/index.js` (currently empty)

**Planned structure:**

```javascript
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8017/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

**Service Layer (Planned):**

```javascript
// apis/quiz.service.js
import api from './index';

export const quizService = {
  // Get all quizzes
  getAll: () => api.get('/quizzes'),
  
  // Get quiz by ID
  getById: (id) => api.get(`/quizzes/${id}`),
  
  // Create quiz
  create: (data) => api.post('/quizzes', data),
  
  // Update quiz
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  
  // Delete quiz
  delete: (id) => api.delete(`/quizzes/${id}`),
  
  // Submit quiz
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
};
```

---

### 🔌 WebSocket (Socket.IO)

**File:** `socketClient.js` (currently empty)

**Planned implementation:**

```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8017';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Event handlers
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Quiz events
socket.on('quiz:started', (data) => {
  console.log('Quiz started:', data);
});

socket.on('quiz:answer', (data) => {
  console.log('New answer:', data);
});

socket.on('quiz:finished', (data) => {
  console.log('Quiz finished:', data);
});

export default socket;
```

---

**Usage in Components:**

```jsx
import { useEffect } from 'react';
import socket from '~/socketClient';

function QuizRoom({ quizId }) {
  useEffect(() => {
    // Connect socket
    socket.connect();
    
    // Join quiz room
    socket.emit('quiz:join', { quizId });
    
    // Listen for events
    socket.on('quiz:update', (data) => {
      console.log('Quiz updated:', data);
    });
    
    // Cleanup
    return () => {
      socket.emit('quiz:leave', { quizId });
      socket.disconnect();
    };
  }, [quizId]);
  
  return <div>Quiz Room</div>;
}
```

---

## 10. Build & Deployment

### 🛠️ Scripts

```json
{
  "scripts": {
    "dev": "cross-env BUILD_MODE=dev vite --host",
    "build": "cross-env BUILD_MODE=production vite build --base=/",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

### 📦 Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
# → http://localhost:5173

# Lint code
npm run lint
```

**Dev server features:**
- ⚡ Hot Module Replacement (HMR)
- 🔄 Fast Refresh for React
- 🌐 Network access (`--host` flag)
- 📦 On-demand compilation

---

### 🏗️ Production Build

```bash
# Build for production
npm run build

# Output: dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css
```

**Build optimizations:**
- Code splitting
- Tree shaking
- Minification
- Asset hashing
- CSS extraction

---

### 🚀 Deployment

#### Vercel (Configured)

**File:** `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/assets/(.*)",
      "destination": "/assets/$1"
    },
    {
      "source": "/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$",
      "destination": "/$1.$2"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Purpose:**
- Serve static assets correctly
- SPA fallback to `index.html`
- Enable client-side routing

**Deploy commands:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

---

#### Other Platforms

**Netlify:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**GitHub Pages:**
```bash
# Build with correct base path
npm run build -- --base=/repo-name/

# Deploy
gh-pages -d dist
```

---

### 🔐 Environment Variables

**File:** `.env` (not committed)

```bash
# API endpoints
VITE_API_URL=http://localhost:8017/api
VITE_SOCKET_URL=http://localhost:8017

# Auth0
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id

# Other configs
VITE_APP_NAME=Quizzy
VITE_APP_VERSION=1.0.0
```

**Access in code:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## 📊 Performance Metrics

### 🎯 Lighthouse Scores (Target)

| Metric | Target | Current |
|--------|--------|---------|
| Performance | 90+ | TBD |
| Accessibility | 95+ | TBD |
| Best Practices | 95+ | TBD |
| SEO | 90+ | TBD |

### ⚡ Core Web Vitals

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8s | First Contentful Paint |
| TTI | < 3.8s | Time to Interactive |

---

## 🧪 Testing (Planned)

### Unit Testing
- **Vitest** - Unit test framework
- **React Testing Library** - Component testing

### E2E Testing
- **Playwright** / **Cypress** - End-to-end testing

### Test Structure
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx
│   │   └── Button.module.css
```

---

## 📚 Best Practices

### ✅ Code Style

1. **Use functional components** with hooks
2. **Single quotes** for strings
3. **No semicolons**
4. **2-space indentation**
5. **camelCase** for variables/functions
6. **PascalCase** for components
7. **UPPER_SNAKE_CASE** for constants

### ✅ Component Guidelines

```jsx
// ❌ Bad
function MyComponent(props) {
  return <div className="container">{props.title}</div>
}

// ✅ Good
function MyComponent({ title, children }) {
  return (
    <div className="container">
      <h1>{title}</h1>
      {children}
    </div>
  )
}
```

### ✅ Import Order

```jsx
// 1. React & external libraries
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// 2. Internal utilities
import { validateEmail } from '~/customLib/validation'
import { useAuth } from '~/customHooks/useAuth'

// 3. Components
import Button from '~/components/common/Button'
import Card from '~/components/common/Card'

// 4. Assets & styles
import logo from '~/assets/logo.svg'
import './MyComponent.css'
```

### ✅ File Naming

```
✅ PascalCase for components:
   - Button.jsx
   - QuizCard.jsx
   - UserProfile.jsx

✅ camelCase for utilities:
   - useAuth.js
   - validation.js
   - formatters.js

✅ kebab-case for config files:
   - vite.config.js
   - eslint.config.js
```

---

## 🐛 Known Issues

1. **Vite 7 requires Node.js 20.19+** - May need to downgrade Vite to 5.x for Node 18
2. **yarn.lock exists but npm is used** - Should remove yarn.lock
3. **Empty placeholder files** - `theme.js`, `socketClient.js`, `apis/index.js` need implementation
4. **No error boundaries** - Should add error handling
5. **No loading states** - Need global loading component
6. **No 404 page** - Need proper NotFound component

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Setup Vite + React
- [x] Basic routing
- [x] Landing page
- [x] Create quiz form (Step 1)

### Phase 2: Core Features 🚧
- [ ] Complete quiz creation wizard (Steps 2-3)
- [ ] Quiz list & detail pages
- [ ] Quiz play interface
- [ ] Result page with statistics
- [ ] User authentication (Auth0)

### Phase 3: Advanced Features
- [ ] Real-time quiz rooms (Socket.IO)
- [ ] Leaderboard
- [ ] Rewards system
- [ ] User profile & dashboard
- [ ] Quiz analytics

### Phase 4: Polish
- [ ] Unit & E2E tests
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] PWA features
- [ ] Mobile app (React Native)

---

## 📞 Contact & Support

**Project:** Quizzy - Quiz Web Application  
**Repository:** CongNgheWeb20251-QuizzWeb  
**Frontend Location:** `/frontend`  

**Maintainer:** [Your Name]  
**Last Updated:** October 12, 2025

---

## 📄 License

[Add your license here]

---

**🎉 Happy Coding!**
