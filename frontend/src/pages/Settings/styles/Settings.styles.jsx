import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const StyledSettings = styled(Box)(() => ({
  padding: '24px',
  maxWidth: '1200px',
  margin: '0 auto',
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
  '& .MuiTabs-root': {
    backgroundColor: 'transparent',
    marginBottom: '24px',
    '& .MuiTab-root': {
      color: '#94A3B8',
      textTransform: 'none',
      '&.Mui-selected': {
        color: '#8B5CF6',
      }
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#8B5CF6'
    }
  },
  '& .MuiTypography-h4': {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '8px'
  },
  '& .MuiTypography-subtitle1': {
    color: '#94A3B8',
    fontSize: '14px',
    marginBottom: '32px'
  }
}));

export const TabPanelContent = styled(Box)(() => ({
  backgroundColor: '#1E293B',
  borderRadius: '12px',
  padding: '24px',
  color: '#FFFFFF',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  
  '& .MuiTextField-root': {
    backgroundColor: '#0F172A',
    borderRadius: '8px',
    width: '100%',
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF',
      '& fieldset': {
        borderColor: '#334155'
      },
      '&:hover fieldset': {
        borderColor: '#475569'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#8B5CF6'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#94A3B8'
    }
  },

  '& .MuiButton-root': {
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    textTransform: 'none',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#7C3AED'
    }
  },

  '& .MuiAvatar-root': {
    width: '80px',
    height: '80px',
    marginBottom: '16px',
    border: '3px solid #334155'
  }
}));