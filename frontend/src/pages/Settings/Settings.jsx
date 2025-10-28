import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';

// Import tab components
import ProfileTab from './tabs/ProfileTab';
import AccountTab from './tabs/AccountTab';
import NotificationsTab from './tabs/NotificationsTab';
import AppearanceTab from './tabs/AppearanceTab';
import PrivacyTab from './tabs/PrivacyTab';
import BillingTab from './tabs/BillingTab';

// Import styles
import { StyledSettings, TabPanelContent } from './styles/Settings.styles';

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
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <StyledSettings>
      <Typography variant="h4" component="h1">
        Settings
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>
        Manage your account settings and preferences
      </Typography>

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
  );
};

export default Settings;