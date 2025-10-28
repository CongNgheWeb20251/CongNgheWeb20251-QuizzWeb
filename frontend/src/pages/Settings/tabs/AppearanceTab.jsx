import React, { useState } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { StyledSection, ThemeCard, ColorSwatch } from '../styles/AppearanceTab.styles';

const AppearanceTab = () => {
  const [theme, setTheme] = useState('system');
  const [accentColor, setAccentColor] = useState('purple');

  const themes = [
    { id: 'dark', label: 'Dark', icon: <Brightness4Icon /> },
    { id: 'light', label: 'Light', icon: <Brightness7Icon /> },
    { id: 'system', label: 'System', icon: <SettingsBrightnessIcon /> },
  ];

  const colors = [
    { id: 'purple', color: '#9C27B0' },
    { id: 'blue', color: '#2196F3' },
    { id: 'green', color: '#4CAF50' },
    { id: 'red', color: '#F44336' },
    { id: 'amber', color: '#FFC107' },
    { id: 'pink', color: '#E91E63' },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleColorChange = (newColor) => {
    setAccentColor(newColor);
  };

  const handleSave = () => {
    // Handle saving appearance preferences
    console.log({
      theme,
      accentColor,
    });
  };

  return (
    <Box>
      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Theme
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)'
            },
            gap: 2
          }}
        >
          {themes.map((themeOption) => (
            <ThemeCard
              key={themeOption.id}
              className={theme === themeOption.id ? 'selected' : ''}
              onClick={() => handleThemeChange(themeOption.id)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <IconButton
                  color={theme === themeOption.id ? 'primary' : 'default'}
                  sx={{ mb: 1 }}
                >
                  {themeOption.icon}
                </IconButton>
                <Typography variant="subtitle1">{themeOption.label}</Typography>
              </CardContent>
            </ThemeCard>
          ))}
        </Box>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Accent Color
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {colors.map((colorOption) => (
            <ColorSwatch
              key={colorOption.id}
              className={accentColor === colorOption.id ? 'selected' : ''}
              onClick={() => handleColorChange(colorOption.id)}
              sx={{
                backgroundColor: colorOption.color,
              }}
            />
          ))}
        </Box>
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

export default AppearanceTab;