import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Quiz from '@mui/icons-material/Quiz'
import Settings from '@mui/icons-material/Settings'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import './TeacherLayout.css'

function TeacherLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active menu based on current path
  const getActiveMenu = () => {
    const path = location.pathname
    if (path.includes('/teacher/dashboard')) return 'dashboard'
    if (path.includes('/teacher/quizzes')) return 'quizzes'
    if (path.includes('/settings')) return 'settings'
    return 'dashboard'
  }

  const [selectedMenu, setSelectedMenu] = useState(getActiveMenu())

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId)
    if (menuId === 'quizzes') {
      navigate('/teacher/quizzes')
    } else if (menuId === 'dashboard') {
      navigate('/teacher/dashboard')
    }
  }

  const handleManageClick = (manageId) => {
    if (manageId === 'settings') {
      navigate('/settings')
    }
  }

  const menuItems = [
    { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { id: 'quizzes', icon: <Quiz />, label: 'Quizzes' }
    // Removed Students item as requested
  ]

  const manageItems = [
    { id: 'settings', icon: <Settings />, label: 'Settings' }
  ]

  return (
    <div className="teacher-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-qui">Qui</span>
            <span className="logo-zzy">zzy</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${getActiveMenu() === item.id ? 'active' : ''}`}
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
                className={`nav-item ${getActiveMenu() === item.id ? 'active' : ''}`}
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
        {/* Top Bar */}
        <div className="top-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem' }}>
          <UserAvatar />
        </div>
        
        <div className="content-wrapper">
            <Outlet />
        </div>
      </main>
    </div>
  )
}

export default TeacherLayout
