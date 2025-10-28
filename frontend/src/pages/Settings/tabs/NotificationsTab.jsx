import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  RadioGroup,
  Radio,
  Button,
  FormControl,
  FormLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const NotificationsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    quizCompletions: true,
    eventReminders: true,
    newStudentJoins: true,
    marketingUpdates: false,
  });

  const [appNotifications, setAppNotifications] = useState({
    quizCompletions: true,
    eventReminders: true,
    newStudentJoins: true,
  });

  const [frequency, setFrequency] = useState('immediately');

  const handleEmailToggle = (name) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAppToggle = (name) => {
    setAppNotifications((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handleSave = () => {
    // Handle saving notification preferences
    console.log({
      emailNotifications,
      appNotifications,
      frequency,
    });
  };

  return (
    <Box>
      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Email Notifications
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={emailNotifications.quizCompletions}
              onChange={() => handleEmailToggle('quizCompletions')}
            />
          }
          label="Quiz Completions"
        />
        <FormControlLabel
          control={
            <Switch
              checked={emailNotifications.eventReminders}
              onChange={() => handleEmailToggle('eventReminders')}
            />
          }
          label="Event Reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={emailNotifications.newStudentJoins}
              onChange={() => handleEmailToggle('newStudentJoins')}
            />
          }
          label="New Student Joins"
        />
        <FormControlLabel
          control={
            <Switch
              checked={emailNotifications.marketingUpdates}
              onChange={() => handleEmailToggle('marketingUpdates')}
            />
          }
          label="Marketing & Updates"
        />
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          In-App Notifications
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={appNotifications.quizCompletions}
              onChange={() => handleAppToggle('quizCompletions')}
            />
          }
          label="Quiz Completions"
        />
        <FormControlLabel
          control={
            <Switch
              checked={appNotifications.eventReminders}
              onChange={() => handleAppToggle('eventReminders')}
            />
          }
          label="Event Reminders"
        />
        <FormControlLabel
          control={
            <Switch
              checked={appNotifications.newStudentJoins}
              onChange={() => handleAppToggle('newStudentJoins')}
            />
          }
          label="New Student Joins"
        />
      </StyledSection>

      <StyledSection>
        <FormControl component="fieldset">
          <FormLabel component="legend">Notification Frequency</FormLabel>
          <RadioGroup
            aria-label="notification frequency"
            name="frequency"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <FormControlLabel
              value="immediately"
              control={<Radio />}
              label="Immediately"
            />
            <FormControlLabel
              value="daily"
              control={<Radio />}
              label="Daily Digest"
            />
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label="Weekly Digest"
            />
          </RadioGroup>
        </FormControl>
      </StyledSection>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        size="large"
      >
        Save Preferences
      </Button>
    </Box>
  );
};

export default NotificationsTab;