# QuizzWeb – MongoDB Schema Design

## Overview
Hệ thống quản lý thi trắc nghiệm trực tuyến **QuizzWeb** gồm các nhóm chính:
- **User Management** – quản lý người dùng, phân quyền, đăng nhập.
- **Exam Management** – quản lý kỳ thi, câu hỏi, thí sinh.
- **Attempt & Result Management** – lưu bài làm, chấm điểm tự động, lưu kết quả.

[//]: # (- **Logging & Monitoring** – ghi log sự kiện.)

---
![ERD QuizzWeb](quizzweb_erd.png)
## Database Schema (MongoDB)

#### users
```js
{
    _id: ObjectId, // PK
    username: String, // not null
    email: String, // unique, not null
    passwordHash: String, // not null
    fullName: String, // not null
    avatar: String, // optional
    role: "admin" | "teacher" | "student",
    isActive: Boolean, // default: false
    verifyToken: String, // optional
    authProvider: String, // default: "local"
    createdAt: Date,
    updatedAt: Date,
    _destroy: Boolean, // default: false (soft-delete)
    require_2fa: Boolean // default: false
}
```

#### answerOptions
```js
{
    _id: ObjectId, // PK
    questionId: ObjectId, // ref → questions, not null
    quizId: ObjectId, // ref → quizzes, not null
    content: String, // not null
    isCorrect: Boolean, // default: false
    order: Number, // thứ tự hiển thị
    createdAt: Date,
    updatedAt: Date
}
```

#### questions
```js
{
    _id: ObjectId, // PK
    content: String, // not null
    options: [ // embedded options (hoặc ref đến answerOptions nếu tách riêng)
    { id: String, text: String }
    ],
    correctAnswer: String, // e.g., "A" hoặc ID của answerOptions
    level: "easy" | "medium" | "hard", // not null
    examId: ObjectId, // ref → quizzes (gọi là quiz thay vì exam), not null
    answerIds: [ObjectId], // ref → answerOptions, default: []
    createdBy: ObjectId, // ref → users, optional
    createdAt: Date,
    updatedAt: Date
}
```

#### quizzes
```js
{
    _id: ObjectId, // PK
    title: String, // not null
    description: String, // optional
    category: String, // not null
    level: "easy" | "medium" | "hard", // not null
    duration: Number, // phút, not null
    questionIds: [ObjectId], // ref → questions, default: []
    status: "draft" | "published" | "upcoming" | "ongoing" | "finished", // default: "draft"
    createdBy: ObjectId, // ref → users, not null
    totalQuestions: Number, // default: 0
    totalPoints: Number, // default: 0
    createdAt: Date,
    updatedAt: Date
}
```

#### quizResults
```js
{
    _id: ObjectId,
    examId: ObjectId,      // ref → exams
    candidateId: ObjectId, // ref → users
    startTime: Date,
    endTime: Date,
    remainingTime: Number, // seconds
    status: "in_progress" | "submitted" | "time_up",
    score: Number,
    createdAt: Date,
    updatedAt: Date
}
```

#### userAnswers
```js
{
    _id: ObjectId, // PK
    userId: ObjectId, // ref → users, not null
    quizId: ObjectId, // ref → quizzes, not null
    questionId: ObjectId, // ref → questions, not null
    selectedAnswerId: ObjectId, // ref → answerOptions, not null
    isCorrect: Boolean, // not null
    timeSpent: Number, // giây, optional
    
    createdAt: Date,
    updatedAt: Date
}
```