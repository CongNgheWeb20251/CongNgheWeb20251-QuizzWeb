import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import Search from '@mui/icons-material/Search'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Quiz from '@mui/icons-material/Quiz'
import People from '@mui/icons-material/People'
import Settings from '@mui/icons-material/Settings'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import './MainLayout.css'

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMenu, setSelectedMenu] = useState('dashboard')
  const [selectedManage, setSelectedManage] = useState('')

  useEffect(() => {
    const path = location.pathname
    if (path.includes('/dashboard')) {
      setSelectedMenu('dashboard')
      setSelectedManage('')
    } else if (path.includes('/quizzes')) {
      setSelectedMenu('quizzes')
      setSelectedManage('')
    } else if (path.includes('/settings')) {
      setSelectedMenu('')
      setSelectedManage('settings')
    } else {
      setSelectedMenu('')
      setSelectedManage('')
    }
  }, [location])

  const handleMenuClick = (menuId) => {
    if (menuId === 'dashboard') navigate('/dashboard')
    if (menuId === 'quizzes') navigate('/quizzes')
    if (menuId === 'students') navigate('/students')
  }

  const handleManageClick = (manageId) => {
    if (manageId === 'settings') navigate('/settings')
  }

  const menuItems = [
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'quizzes', icon: <Quiz />, label: 'Quizzes' },
    { id: 'students', icon: <People />, label: 'Students' }
  ]

  const manageItems = [
    { id: 'settings', icon: <Settings />, label: 'Settings' }
  ]

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-qui">Qui</span>
            <span className="logo-zzy">zzy</span>
          </div>
          <div className="search-box">
            <TextField
              fullWidth
              placeholder="Search..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${selectedMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Manage</div>
            {manageItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${selectedManage === item.id ? 'active' : ''}`}
                onClick={() => handleManageClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
