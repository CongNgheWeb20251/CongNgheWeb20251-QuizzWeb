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
import Students from '~/pages/Students/Students.jsx'
import MainLayout from '~/layouts/MainLayout.jsx'
import StudentLayout from '~/layouts/StudentLayout.jsx'
import StudentDashboard from '~/pages/Student/Dashboard/StudentDashboard.jsx'
import StudentHistory from '~/pages/Student/History/StudentHistory.jsx'
import StudentProfile from '~/pages/Student/Profile/StudentProfile.jsx'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/" replace={true} />
  }
  else return <Outlet /> // nếu có user trong storage thì chuyển xuống các route con trong route cha
}

const LoginedRedirect = ({ user }) => {
  if (user) {
    return <Navigate to="/dashboard" replace={true} />
  }
  else return <Outlet />
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
      </Route>
      <Route element={<ProtectedRoute user={currUser} />}>
        {/* Teacher Routes */}
        {(!currUser?.role || currUser?.role === 'teacher') && (
          <>
            <Route path='/create/step1' element={<CreateQuizStep1 />} />
            <Route path='/create-quiz/step1' element={<CreateQuizStep1 />} />
            <Route path='/create-quiz/step2' element={<CreateQuizStep2 />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/quizzes/:id" element={<QuizDetail />} />
              <Route path="/students" element={<Students />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </>
        )}

        {/* Student Routes */}
        {currUser?.role === 'student' && (
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/history" element={<StudentHistory />} />
            <Route path="/profile" element={<StudentProfile />} />
          </Route>
        )}
      </Route>
    </Routes>
  )
}

export default App