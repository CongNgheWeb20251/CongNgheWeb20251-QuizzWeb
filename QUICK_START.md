# 🚀 Quick Start Guide

This guide works on **Windows, Mac, and Linux**.

## 📦 Prerequisites

- **Node.js** (>= 18.x) - [Download here](https://nodejs.org/)
- **MongoDB** - For backend database
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tuanvdtd/CongNgheWeb20251-QuizzWeb.git
cd CongNgheWeb20251-QuizzWeb
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

## ▶️ Running the Application

### Option 1: Run Everything (Full Stack)

Open **3 separate terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on: http://localhost:8017
```

**Terminal 2 - React Frontend:**
```bash
cd frontend
npm run dev
# Runs on: http://localhost:5173
```

**Terminal 3 - Static Pages (Optional):**
```bash
cd frontend
python -m http.server 8000
# Or use: npx http-server -p 8000
# Runs on: http://localhost:8000
```

### Option 2: Static Pages Only (No Installation Needed)

**Easiest way - Use the launcher:**
```bash
cd frontend
```

Then double-click `pages-launcher.html` or:

**Windows:**
```powershell
start pages-launcher.html
```

**Mac:**
```bash
open pages-launcher.html
```

**Linux:**
```bash
xdg-open pages-launcher.html
```

## 🌐 Access URLs

After running the servers:

| Page | URL | Description |
|------|-----|-------------|
| **React App** | http://localhost:5173 | Main quiz application |
| **Backend API** | http://localhost:8017 | REST API server |
| **Page Launcher** | `frontend/pages-launcher.html` | Access to static pages |
| **Landing Page** | `frontend/landing_page/quizzy.html` | Product showcase |
| **Create Quiz** | `frontend/create quiz/index.html` | Quiz creation form |

## 📖 Detailed Guides

- **Frontend Pages Guide:** [`frontend/HOW_TO_RUN_PAGES.md`](./frontend/HOW_TO_RUN_PAGES.md)
- **Create Quiz README:** [`frontend/create quiz/README.md`](./frontend/create%20quiz/README.md)
- **Project Rules:** See main [`README.md`](./README.md)

## 🆘 Troubleshooting

### Port Already in Use

**Change the port:**
```bash
# Backend - edit backend/src/server.js
# Frontend - Vite will auto-assign new port
# Static server:
python -m http.server 8001  # Use different port
```

### npm command not found

➡️ Install Node.js from: https://nodejs.org/

### Python not found

**Option 1:** Install Python from https://www.python.org/

**Option 2:** Use Node.js instead:
```bash
npx http-server -p 8000
```

### MongoDB Connection Error

Make sure MongoDB is running:

**Windows:**
```powershell
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

## 🎯 Quick Test

To verify everything works:

1. **Backend test:**
   ```bash
   cd backend
   npm run dev
   # Should see: "Server running on port 8017"
   ```

2. **Frontend test:**
   ```bash
   cd frontend
   npm run dev
   # Should see: "Local: http://localhost:5173"
   ```

3. **Static pages test:**
   - Open `frontend/pages-launcher.html` in browser
   - Click each button to test

## 📝 Environment Variables

If needed, create `.env` files:

**backend/.env:**
```env
PORT=8017
MONGODB_URI=mongodb://localhost:27017/quizzweb
JWT_SECRET=your_secret_key_here
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:8017
```

## 🔐 Git Workflow

Before committing, follow these rules:

```bash
# Check what changed
git status
git diff

# Add files
git add <specific-files>

# Commit with clear message
git commit -m "feat: add user authentication feature

- Implement JWT token generation
- Add login/logout endpoints
- Create auth middleware"

# Push to GitHub
git push origin main
```

See full commit rules in main README.md

## 📚 Project Structure

```
CongNgheWeb20251-QuizzWeb/
├── frontend/
│   ├── pages-launcher.html      # Easy access to all pages
│   ├── landing_page/            # Static promotional site
│   ├── create quiz/             # Quiz creation form
│   ├── src/                     # React app source
│   └── HOW_TO_RUN_PAGES.md     # Detailed frontend guide
├── backend/
│   └── src/                     # Backend source
├── README.md                    # Main documentation
└── QUICK_START.md              # This file
```

## 🎉 You're Ready!

Now you can:
- ✅ Run the full application
- ✅ View static pages
- ✅ Develop new features
- ✅ Contribute to the project

For detailed information, check the main [README.md](./README.md)

---

**Happy Coding! 🚀**
