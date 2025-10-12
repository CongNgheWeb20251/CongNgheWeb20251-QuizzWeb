# 🚀 Hướng Dẫn Chạy Các Trang Frontend

## 📋 Tổng Quan

Dự án có **3 phần frontend**:
1. **Landing Page** (Trang giới thiệu) - HTML/CSS tĩnh
2. **Create Quiz Page** (Trang tạo quiz) - HTML/CSS tĩnh  
3. **React App** (Ứng dụng chính) - React + Vite

---

## ✨ **Cách 1: Dùng Page Launcher (Đơn Giản Nhất)**

### Mở file launcher:

**Windows:**
```powershell
cd frontend
start pages-launcher.html
```

**Mac/Linux:**
```bash
cd frontend
open pages-launcher.html      # Mac
xdg-open pages-launcher.html  # Linux
```

Hoặc double-click file `pages-launcher.html` trong thư mục `frontend`

➡️ Màn hình sẽ hiện 3 nút, click vào nút nào để mở trang đó!

---

## 🌐 **Cách 2: Chạy Local Server (Khuyến Nghị)**

### **Bước 1: Mở terminal và vào thư mục frontend**

**Windows:**
```powershell
cd frontend
```

**Mac/Linux:**
```bash
cd frontend
```

### **Bước 2: Chạy server**

**Dùng Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2 (nếu cần)
python -m SimpleHTTPServer 8000
```

**Hoặc dùng Node.js:**
```bash
npx http-server -p 8000
```

### **Bước 3: Mở trình duyệt**
- **Page Launcher:** http://localhost:8000/pages-launcher.html
- **Landing Page:** http://localhost:8000/landing_page/quizzy.html
- **Create Quiz:** http://localhost:8000/create%20quiz/index.html

---

## 💻 **Cách 3: Chạy Từng Trang Riêng**

### **Landing Page (Quizzy)**

**Windows:**
```powershell
cd frontend\landing_page
start quizzy.html
```

**Mac:**
```bash
cd frontend/landing_page
open quizzy.html
```

**Linux:**
```bash
cd frontend/landing_page
xdg-open quizzy.html
```

**Hoặc dùng VS Code Live Server:**
- Right-click vào `quizzy.html` → "Open with Live Server"

### **Create Quiz Page**

**Windows:**
```powershell
cd "frontend\create quiz"
start index.html
```

**Mac:**
```bash
cd "frontend/create quiz"
open index.html
```

**Linux:**
```bash
cd "frontend/create quiz"
xdg-open index.html
```

**Hoặc dùng VS Code Live Server:**
- Right-click vào `index.html` → "Open with Live Server"

### **React App (Cần Node.js)**
```bash
cd frontend
npm install        # Chạy lần đầu tiên
npm run dev        # Khởi động dev server

# Mở http://localhost:5173
```

---

## 🔄 **Chạy Tất Cả Cùng Lúc**

Nếu muốn chạy tất cả (static pages + React app + backend):

### **Terminal 1: Backend**
```bash
cd backend
npm install
npm run dev
# Backend chạy tại: http://localhost:8017
```

### **Terminal 2: React Frontend**
```bash
cd frontend
npm install
npm run dev
# React app chạy tại: http://localhost:5173
```

### **Terminal 3: Static Pages Server**
```bash
cd frontend
python -m http.server 8000
# Static pages tại: http://localhost:8000
```

Sau đó mở:
- **Page Launcher:** http://localhost:8000/pages-launcher.html
- **Landing Page:** http://localhost:8000/landing_page/quizzy.html
- **Create Quiz:** http://localhost:8000/create%20quiz/index.html
- **React App:** http://localhost:5173

---

## 📱 **Cách 4: VS Code Live Server (Cho Dev)**

1. **Cài Extension Live Server** (nếu chưa có):
   - Mở VS Code
   - Nhấn `Ctrl+Shift+X`
   - Tìm "Live Server" (by Ritwick Dey)
   - Click Install

2. **Chạy từng page**:
   - Right-click vào file HTML bất kỳ
   - Chọn "Open with Live Server"
   - Page sẽ tự động mở trong browser

---

## 📊 **So Sánh Các Cách**

| Phương Pháp | Ưu Điểm | Nhược Điểm |
|-------------|---------|------------|
| **Page Launcher** | Đơn giản, 1 click | Cần mở file HTML trước |
| **Local Server** | Chuyên nghiệp, giống production | Cần cài Python/Node |
| **Mở Trực Tiếp** | Nhanh nhất | Không có URL localhost |
| **Live Server** | Auto-reload, dev-friendly | Cần VS Code |

---

## 🎯 **Khuyến Nghị**

### **Cho người mới:**
➡️ Dùng **Page Launcher** (Cách 1)

### **Cho developer:**
➡️ Dùng **VS Code Live Server** (Cách 4) cho static pages  
➡️ Dùng **npm run dev** cho React app

### **Cho demo/testing:**
➡️ Dùng **Local Server** (Cách 2) để chạy tất cả cùng lúc

---

## ⚠️ **Lưu Ý**

1. **React App** cần Node.js và phải chạy `npm install` trước lần đầu
2. **Static pages** (Landing & Create Quiz) không cần cài gì cả
3. Nếu dùng local server, nhớ folder name có dấu cách: `"create quiz"`
4. Port mặc định:
   - Backend: `8017`
   - React (Vite): `5173`
   - Python server: `8000`
   - Live Server: `5500`

---

## 🆘 **Troubleshooting**

### **Lỗi: Port đã được sử dụng**
```powershell
# Đổi sang port khác
python -m http.server 8001  # Thay vì 8000
```

### **Lỗi: Python không tìm thấy**
➡️ Cài Python từ: https://www.python.org/downloads/  
➡️ Hoặc dùng Node.js: `npx http-server`

### **Lỗi: npm command not found**
➡️ Cài Node.js từ: https://nodejs.org/

### **React app không chạy**
```bash
cd frontend
npm install           # Cài dependencies
npm run dev           # Chạy lại
```

### **Path không đúng trên Mac/Linux**
➡️ Mac/Linux dùng `/` thay vì `\`
```bash
# Đúng trên Mac/Linux
cd frontend/landing_page

# Sai (Windows style)
cd frontend\landing_page
```

---

## 📝 **File Summary**

```
frontend/
├── pages-launcher.html          ← Launcher để chọn page
├── landing_page/
│   ├── quizzy.html              ← Trang giới thiệu
│   └── quizzy.css
├── create quiz/
│   ├── index.html               ← Trang tạo quiz
│   ├── styles.css
│   └── README.md
├── src/                         ← React app
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
└── index.html                   ← React app entry (Vite)
```

---

**Chúc bạn code vui vẻ! 🎉**
