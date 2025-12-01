import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import './StudentLayout.css'

function StudentLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/history', label: 'My History', icon: '📜' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <div className="student-layout">
      <header className="student-header">
        <div className="student-logo">
          <span className="logo-qui">Qui</span>
          <span className="logo-zzy">zzy</span>
          <span className="student-badge">Student</span>
        </div>
        
        <nav className="student-nav">
          {navItems.map(item => (
            <div 
              key={item.path}
              className={`student-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="student-user">
          <div className="notification-bell">🔔</div>
          <UserAvatar />
        </div>
      </header>

      <main className="student-content">
        <Outlet />
      </main>
    </div>
  )
}

export default StudentLayout
