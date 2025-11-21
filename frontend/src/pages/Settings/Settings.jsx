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
import NotificationsTab from './tabs/NotificationsTab'
import AppearanceTab from './tabs/AppearanceTab'
import PrivacyTab from './tabs/PrivacyTab'
import BillingTab from './tabs/BillingTab'

// Import styles
import { StyledSettings, TabPanelContent } from './styles/Settings.styles'
import UserAvatar from '~/components/UserAvatar/UserAvatar'

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <StyledSettings>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>
            Manage your account settings and preferences
          </Typography>
        </Box>
        <UserAvatar />
      </Box> */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate('/dashboard')}
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
        <Tab label="Notifications" />
        <Tab label="Appearance" />
        <Tab label="Privacy" />
        <Tab label="Billing" />
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
      <TabPanel value={activeTab} index={2}>
        <TabPanelContent>
          <NotificationsTab />
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <TabPanelContent>
          <AppearanceTab />
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <TabPanelContent>
          <PrivacyTab />
        </TabPanelContent>
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <TabPanelContent>
          <BillingTab />
        </TabPanelContent>
      </TabPanel>
    </StyledSettings>
  )
}

export default Settings