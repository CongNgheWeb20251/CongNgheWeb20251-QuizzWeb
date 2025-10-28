import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const PrivacyTab = () => {
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    onlineStatus: true,
    activityHistory: true,
  });

  const [dataUsage, setDataUsage] = useState({
    analytics: true,
    personalization: true,
    cookies: true,
  });

  const [exportDialog, setExportDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleDataUsageToggle = (setting) => {
    setDataUsage((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleExportData = () => {
    // Handle data export
    console.log('Exporting data...');
    setExportDialog(false);
  };

  const handleDeleteData = () => {
    // Handle data deletion
    console.log('Deleting data...');
    setDeleteDialog(false);
  };

  return (
    <Box>
      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Privacy Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Public Profile"
              secondary="Allow others to see your profile"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.publicProfile}
                onChange={() => handlePrivacyToggle('publicProfile')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Show Online Status"
              secondary="Display when you're active"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.onlineStatus}
                onChange={() => handlePrivacyToggle('onlineStatus')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Activity History"
              secondary="Show your activity history to others"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.activityHistory}
                onChange={() => handlePrivacyToggle('activityHistory')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Data Usage
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Analytics & Improvements"
              secondary="Help improve our services"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={dataUsage.analytics}
                onChange={() => handleDataUsageToggle('analytics')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Personalization"
              secondary="Customize your experience"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={dataUsage.personalization}
                onChange={() => handleDataUsageToggle('personalization')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Cookies"
              secondary="Website cookies preferences"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={dataUsage.cookies}
                onChange={() => handleDataUsageToggle('cookies')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Data Export & Deletion
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setExportDialog(true)}
          >
            Export Your Data
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialog(true)}
          >
            Delete Your Data
          </Button>
        </Box>
      </StyledSection>

      {/* Export Data Dialog */}
      <Dialog
        open={exportDialog}
        onClose={() => setExportDialog(false)}
      >
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can download a copy of your personal data. The export process may
            take a few minutes to complete.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportData} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Data Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      >
        <DialogTitle>Delete Your Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will permanently delete all your personal data. This cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteData} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrivacyTab;