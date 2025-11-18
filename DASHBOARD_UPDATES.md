# Dashboard Updates - MongoDB Integration

## Tổng quan
Đã thay thế các giá trị tĩnh trong Dashboard bằng dữ liệu thực từ MongoDB.

## Các thay đổi

### Backend (API)

#### 1. Dashboard Controller (`backend/src/controllers/dashboardController.js`)
- `getDashboardStats`: Lấy thống kê tổng quan (tổng số quiz, sinh viên, tỷ lệ hoàn thành trung bình)
- `getTopStudents`: Lấy danh sách sinh viên có điểm cao nhất
- `getRecentQuizzes`: Lấy các quiz gần đây

#### 2. Dashboard Service (`backend/src/services/dashboardService.js`)
- Tính toán số liệu từ MongoDB:
  - **Total Quizzes**: Đếm số quiz được tạo bởi user hiện tại
  - **Total Students**: Đếm số người dùng có role là 'student'
  - **Average Completion**: Tính điểm trung bình từ tất cả kết quả quiz
  - **Top Students**: Aggregate để lấy top sinh viên theo điểm trung bình
  - **Recent Quizzes**: Lấy các quiz gần đây kèm số lượt hoàn thành và tỷ lệ

#### 3. Dashboard Routes (`backend/src/routes/v1/dashboardRoute.js`)
Các endpoint mới:
- `GET /v1/dashboard/stats` - Lấy thống kê tổng quan
- `GET /v1/dashboard/top-students?limit=5` - Lấy top sinh viên
- `GET /v1/dashboard/recent-quizzes?limit=3` - Lấy quiz gần đây

#### 4. Routes Index (`backend/src/routes/v1/index.js`)
- Đã thêm `dashboardRoute` vào router chính

### Frontend

#### 1. API Functions (`frontend/src/apis/index.js`)
Thêm 3 hàm API mới:
- `getDashboardStatsAPI()`: Gọi API lấy thống kê
- `getTopStudentsAPI(limit)`: Gọi API lấy top sinh viên
- `getRecentQuizzesAPI(limit)`: Gọi API lấy quiz gần đây

#### 2. Dashboard Component (`frontend/src/pages/Dashboard/Dashboard.jsx`)
Các thay đổi:
- Thêm `useEffect` để fetch data khi component mount
- Thêm state `loading`, `stats`, `topStudents`, `recentQuizzes`
- Hiển thị loading spinner khi đang tải dữ liệu
- Hiển thị dữ liệu thực từ MongoDB thay vì hardcoded data
- Xử lý trường hợp không có dữ liệu (empty state)

## Cách hoạt động

1. **Khi Dashboard load:**
   - Component gọi 3 API đồng thời (parallel) để lấy dữ liệu
   - Hiển thị loading spinner trong lúc chờ

2. **Dữ liệu được lấy từ MongoDB:**
   - Stats: Query từ collections `quizzes`, `users`, `quizResults`
   - Top Students: Aggregate query để tính điểm trung bình mỗi student
   - Recent Quizzes: Query quiz mới nhất của user, kèm stats

3. **Hiển thị:**
   - Nếu có dữ liệu: Hiển thị như bình thường
   - Nếu không có dữ liệu: Hiển thị empty state/message

## Lưu ý

- Tất cả API đều yêu cầu authentication (có middleware `authMiddleware.isAuthorized`)
- Dữ liệu thống kê được tính dựa trên quiz của user hiện đang đăng nhập
- Top students được tính dựa trên điểm trung bình của tất cả quiz results
- Recent quizzes chỉ hiển thị quiz của user hiện tại (createdBy)

## Testing

Để test các chức năng mới:
1. Đảm bảo backend đang chạy và kết nối MongoDB
2. Đăng nhập vào hệ thống
3. Truy cập Dashboard
4. Kiểm tra dữ liệu hiển thị có đúng với database không

## Các bước tiếp theo (tùy chọn)

- [ ] Thêm real-time updates với WebSocket
- [ ] Cache dữ liệu để giảm số lần query
- [ ] Thêm filter/search cho top students
- [ ] Thêm date range picker cho stats
- [ ] Export dashboard data
