import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const ProfileTab = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    bio: '',
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle photo upload
      console.log('Photo upload:', file);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log('Profile data:', profile);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Profile Information
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-upload"
          type="file"
          onChange={handlePhotoChange}
        />
        <label htmlFor="avatar-upload">
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <StyledAvatar alt="Profile Picture" src="/path-to-avatar.jpg" />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'background.paper',
              }}
              aria-label="change photo"
              component="span"
            >
              <PhotoCameraIcon />
            </IconButton>
          </Box>
        </label>
      </Box>

      <Box sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)'
        }
      }}>
        <TextField
          required
          fullWidth
          label="First Name"
          name="firstName"
          value={profile.firstName}
          onChange={handleInputChange}
        />
        <TextField
          required
          fullWidth
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          onChange={handleInputChange}
        />
        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleInputChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Role"
            name="role"
            value={profile.role}
            onChange={handleInputChange}
          />
        </Box>
        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Box>
        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileTab;