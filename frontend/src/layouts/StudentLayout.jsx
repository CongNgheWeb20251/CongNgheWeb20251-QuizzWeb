import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { logoutUserAPI } from '~/redux/user/userSlice'

function StudentLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa', // Light background
      fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'fixed',
      height: '100vh',
      top: 0,
      left: 0,
    },
    logo: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#4f46e5',
      marginBottom: '40px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: 1,
    },
    navItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      cursor: 'pointer',
      color: isActive ? '#4f46e5' : '#64748b',
      backgroundColor: isActive ? '#eef2ff' : 'transparent',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s ease',
    }),
    main: {
      marginLeft: '260px',
      flex: 1,
      padding: '32px',
    },
    logoutBtn: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      cursor: 'pointer',
      color: '#ef4444',
      fontWeight: '500',
      border: 'none',
      background: 'transparent',
    }
  }

  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/student/history', label: 'My History', icon: <HistoryIcon /> },
    { path: '/student/profile', label: 'Profile', icon: <PersonIcon /> },
  ]

  const handleLogout = () => {
    dispatch(logoutUserAPI())
    navigate('/signin')
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span>QuizWeb</span>
          <span style={{ fontSize: '12px', backgroundColor: '#e0e7ff', padding: '2px 8px', borderRadius: '10px' }}>Student</span>
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              style={styles.navItem(location.pathname === item.path)}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default StudentLayout
