import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const DangerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.main,
  },
}));

const AccountTab = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordUpdate = (event) => {
    event.preventDefault();
    // Handle password update
    console.log('Password update:', passwords);
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log('Account deletion requested');
    setDeleteDialogOpen(false);
  };

  return (
    <Box>
      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Account Security
        </Typography>
        <Box component="form" onSubmit={handlePasswordUpdate} noValidate>
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Current Password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="New Password"
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Confirm New Password"
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Update Password
          </Button>
        </Box>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Two-Factor Authentication
        </Typography>
        <ListItem>
          <ListItemText
            primary="Enable Two-Factor Authentication"
            secondary="Add an extra layer of security to your account"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Connected Accounts
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Google" secondary="Connected" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Disconnect
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Facebook" secondary="Not connected" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Connect
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="X" secondary="Not connected" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Connect
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <DangerButton
          variant="outlined"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Account
        </DangerButton>
      </StyledSection>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountTab;