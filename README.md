# QuizzWeb - Ứng Dụng Quiz Thời Gian Thực

Ứng dụng web quiz thời gian thực được xây dựng với React (frontend) và Node.js (backend), hỗ trợ phiên quiz trực tiếp và trải nghiệm chơi tương tác.

## Tính Năng

- **Phiên Quiz Thời Gian Thực** - Trò chơi quiz nhiều người chơi trực tuyến
- **Giao Diện Tương Tác** - Giao diện người dùng hiện đại dựa trên React
- **Tích Hợp Socket.io** - Giao tiếp thời gian thực giữa người chơi
- **Thiết Kế Responsive** - Hoạt động trên cả desktop và mobile
- **Material-UI Components** - Giao diện chuyên nghiệp và đẹp mắt
- **Landing Page** - Trang giới thiệu sản phẩm với thiết kế dark theme hiện đại

## 🛠️ Công Nghệ Sử Dụng

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
- **Node.js + Express** - Framework server-side
- **Socket.io** - Giao tiếp WebSocket thời gian thực
- **MongoDB** - Cơ sở dữ liệu lưu trữ dữ liệu quiz
- **JWT** - Xác thực và phân quyền
- **Babel** - Biên dịch JavaScript


## 📁 Cấu Trúc Thư Mục

```
CongNgheWeb20251-QuizzWeb/
├── frontend/
│   ├── landing_page/          # Trang giới thiệu sản phẩm (HTML/CSS)
│   │   ├── quizzy.html
│   │   └── quizzy.css
│   ├── src/                   # Source code React chính
│   │   ├── apis/              # Các API calls
│   │   ├── assets/            # Hình ảnh, icons
│   │   ├── components/        # React components
│   │   └── ...
│   └── public/
└── backend/
    ├── src/
    │   ├── routes/            # API routes
    │   ├── controllers/       # Business logic
    │   ├── models/            # Database models
    │   └── server.js          # Entry point
    └── ...
```
