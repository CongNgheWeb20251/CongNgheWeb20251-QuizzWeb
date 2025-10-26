import { Routes, Route } from 'react-router-dom'
import Home from '~/pages/Home/Home.jsx'
import CreateQuizStep1 from '~/pages/CreateQuizz/CreateQuizStep1.jsx'
import CreateQuizStep2 from '~/pages/CreateQuizz/CreateQuizStep2.jsx'
import SignIn from '~/pages/SignIn/SignIn.jsx'
import Register from '~/pages/Register/Register.jsx'
import Dashboard from '~/pages/Dashboard/Dashboard.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/create/step1' element={<CreateQuizStep1 />} />
      <Route path='/create-quiz/step1' element={<CreateQuizStep1 />} />
      <Route path='/create-quiz/step2' element={<CreateQuizStep2 />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App