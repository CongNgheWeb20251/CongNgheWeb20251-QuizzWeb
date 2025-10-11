# QuizzWeb - Realtime Quiz Application

A real-time quiz web application built with React frontend and Node.js backend, featuring live quiz sessions and interactive gameplay.

## 🚀 Features

- **Real-time Quiz Sessions** - Live multiplayer quiz games
- **Interactive UI** - Modern React-based user interface
- **Socket.io Integration** - Real-time communication between players
- **Responsive Design** - Works on desktop and mobile devices
- **Material-UI Components** - Clean and professional interface

## 🛠️ Tech Stack

### Frontend
| Công nghệ                       | Dùng để làm gì                                             |
| ------------------------------- | ---------------------------------------------------------- |
| **HTML5**                       | Cấu trúc giao diện (câu hỏi, nút, layout cơ bản)           |
| **CSS3**                        | Làm đẹp giao diện, bố cục, responsive                      |
| **JavaScript (ES6+)**           | Logic chọn đáp án, đếm thời gian, xử lý sự kiện người dùng |
| **React**                       | Tạo UI component, quản lý giao diện phức tạp               |
| **React Router**                | Điều hướng chuyển trang trong ứng dụng React               |
| **React state / Redux Toolkit** | Quản lý dữ liệu trạng thái (đáp án, thời gian, điểm)       |
| **Axios hoặc Fetch API**        | Gọi API lấy câu hỏi hoặc gửi kết quả lên server            |
| **Vite**                        | Công cụ dev server & build project React nhanh gọn         |


### Backend
- **Node.js + Express** - Server-side framework
- **Socket.io** - Real-time WebSocket communication
- **MongoDB** - Database for storing quiz data
- **JWT** - Authentication and authorization
- **Babel** - JavaScript transpilation


## ⚙️ Installation & Setup

### Prerequisites
- Node.js (>= 18.x)
- npm or yarn
- MongoDB

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd quizzWeb
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
or 
```bash
cd backend
yarn install
yarn dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
or 
```bash
cd frontend
yarn install
yarn dev
```

## 🎮 How to Use

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   or yarn dev
   ```
   Server will run on `http://localhost:8017`

2. **Start the Frontend Development**
   ```bash
   cd frontend
   npm run dev
   or yarn dev
   ```
   Frontend will run on `http://localhost:5173`


## 🙏 Acknowledgments

- Socket.io for real-time communication
- Material-UI for beautiful components
- React and Node.js communities
