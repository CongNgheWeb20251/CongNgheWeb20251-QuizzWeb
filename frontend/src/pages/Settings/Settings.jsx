import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'

// Import tab components
import ProfileTab from './tabs/ProfileTab'
import AccountTab from './tabs/AccountTab'

// Import styles
import { StyledSettings, TabPanelContent } from './styles/Settings.styles'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    aria-labelledby={`settings-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
)

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const currUser = useSelector(selectCurrentUser)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }
  const handleBackToDashboard = () => {
    if (currUser?.role === 'teacher') {
      navigate('/teacher/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <StyledSettings>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={handleBackToDashboard}
            sx={{
              color: 'rgba(230,238,248,0.9)',
              borderColor: 'rgba(255,255,255,0.06)',
              textTransform: 'none',
              px: 2,
              py: 1,
              backgroundColor: 'transparent',
              transition: 'background-color 160ms, transform 200ms, box-shadow 160ms',
              '& .MuiButton-startIcon': {
                transition: 'transform 200ms'
              },
              '&:hover': {
                backgroundColor: 'rgba(139,92,246,0.12)',
                borderColor: 'rgba(139,92,246,0.35)',
                boxShadow: '0 6px 18px rgba(11,21,38,0.6)',
                '& .MuiButton-startIcon': {
                  transform: 'translateX(-4px)'
                }
              }
            }}
          >
            Dashboard
          </Button>
          <UserAvatar />
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: 22, md: 28 }, color: '#e6eef8' }}>
            Settings
          </Typography>
          <Typography sx={{ color: 'rgba(230,238,248,0.75)', mt: 0.5, fontSize: 14 }}>
            Manage your account settings and preferences
          </Typography>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="settings tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Profile" />
        <Tab label="Account" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <TabPanelContent>
          <ProfileTab />
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <TabPanelContent>
          <AccountTab />
        </TabPanelContent>
      </TabPanel>
    </StyledSettings>
  )
}

export default Settings