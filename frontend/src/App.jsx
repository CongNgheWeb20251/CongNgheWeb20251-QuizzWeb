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

export default App