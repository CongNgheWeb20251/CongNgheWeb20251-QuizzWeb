import { Routes, Route } from 'react-router-dom'
import Home from '~/pages/Home/Home.jsx'
import CreateQuizStep1 from '~/pages/CreateQuizz/CreateQuizStep1.jsx'
import CreateQuizStep2 from '~/pages/CreateQuizz/CreateQuizStep2.jsx'
import SignIn from '~/pages/SignIn/SignIn.jsx'
import Register from '~/pages/Register/Register.jsx'
import Dashboard from '~/pages/Dashboard/Dashboard.jsx'
import Quizzes from '~/pages/Quizzes/Quizzes.jsx'
import QuizDetail from '~/pages/Quizzes/QuizDetail.jsx'
import Settings from '~/pages/Settings/Settings.jsx'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Navigate, Outlet } from 'react-router-dom'
import EditQuizInfo from '~/pages/EditQuizz/EditQuizInfo.jsx'
import QuizResult from './pages/StudentQuiz/QuizResult'
import StudentQuizPage from './pages/StudentQuiz/StudentQuizPage'
import PreviewQuiz from './pages/PreviewQuiz/PreviewQuiz'
import AuthCallBack from './components/0AuthCallBack/AuthCallBack'
import NotFound from './pages/404/NotFound'
import ForgotPassword from '~/pages/ForgotPassword/ForgotPassword.jsx'
import ResetPassword from '~/pages/ForgotPassword/ResetPassword.jsx'
import StudentDashboard from './pages/Student/StudentDashboard'
import { usePermission } from '~/customHooks/usePermission'
import { roles } from '~/config/rbacConfig'
import { permissions } from './config/rbacConfig'
import AccessDenied from './pages/AccessDenied/AccessDenied'
import QuizAttemptsList from './pages/Student/QuizHistory/QuizAttemptsList'
import JoinQuiz from './pages/Student/JoinQuiz/JoinQuiz'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/" replace={true} />
  }
  else return <Outlet /> // nếu có user trong storage thì chuyển xuống các route con trong route cha
}

const LoginedRedirect = ({ user }) => {
  if (user?.role === 'student') {
    return <Navigate to="/dashboard" replace={true} />
  }
  else if (user?.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace={true} />
  }
  else return <Outlet />
}

const RoleRoute = ({ user, requiredPermission, redirectTo = '/access-denied' }) => {
  const userRole = user?.role || roles.STUDENT
  const { hasPermission } = usePermission(userRole)

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />
  }

  return <Outlet />
}

function App() {
  const currUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route element= {<LoginedRedirect user={currUser} />} >
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Register />} />
        <Route path='/account/verification' element={<AccountVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Route>
      <Route element={<ProtectedRoute user={currUser} />}>
        {/* Teacher permissions */}
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_CREATE_QUIZ} />}>
          <Route path='teacher/create-quiz' element={<CreateQuizStep1 />} />
        </Route>
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_EDIT_QUIZ} />}>
          <Route path='teacher/edit/:id/step1' element={<EditQuizInfo />} />
          <Route path='teacher/edit/:id/step2' element={<CreateQuizStep2 />} />
        </Route>
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_TEACHER_DASHBOARD} />}>
          <Route path="/teacher/dashboard" element={<Dashboard />} />
          <Route path="/teacher/quizzes" element={<Quizzes />} />
          <Route path="/teacher/quizzes/:id" element={<QuizDetail />} />
        </Route>
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_PREVIEW_QUIZ} />}>
          <Route path="/teacher/quizzes/:id/preview" element={<PreviewQuiz />} />
        </Route>

        {/* Student permissions */}
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_STUDENT_DASHBOARD} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quizzes/:quizId/attempts" element={<QuizAttemptsList />} />
          <Route path="/quizzes/:quizId/session/:sessionId" element={<StudentQuizPage />} />
          <Route path="/quizzes/:quizId/session/:sessionId/result" element={<QuizResult />} />
        </Route>

        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_SETTINGS} />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="/join/:inviteToken" element={<JoinQuiz />} />
      <Route path="/auth-successful" element={<AuthCallBack />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/access-denied" element={<AccessDenied />} />
    </Routes>
  )
}

export default App