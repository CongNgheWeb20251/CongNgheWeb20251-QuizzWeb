import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'


export const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: '#1E293B',
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
}))

export const DangerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.main
  }
}))

export const StyledSectionTitle = styled(Typography)(() => ({
  color: '#FFFFFF',
  fontWeight: 600,
  marginBottom: '16px',
  fontSize: '1.25rem'
}))

export const StyledList = styled(List)(() => ({
  backgroundColor: 'transparent',
  '& .MuiListItem-root': {
    backgroundColor: '#0F172A',
    marginBottom: '8px',
    borderRadius: '8px',
    border: '1px solid #334155',
    '&:hover': {
      backgroundColor: '#1E293B',
      borderColor: '#475569'
    }
  },
  '& .MuiListItemText-primary': {
    color: '#FFFFFF',
    fontWeight: 500
  },
  '& .MuiListItemText-secondary': {
    color: '#94A3B8'
  }
}))

export const StyledSwitch = styled(Switch)(() => ({
  '& .MuiSwitch-switchBase': {
    color: '#64748B',
    padding: '8px',
    '&.Mui-checked': {
      color: '#FFFFFF',
      transform: 'translateX(16px)',
      '& + .MuiSwitch-track': {
        backgroundColor: '#8B5CF6',
        opacity: 1,
        border: 'none',
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 15px rgba(139, 92, 246, 0.4)',
        border: '2px solid #8B5CF6'
      }
    },
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.1)'
    }
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#475569',
    opacity: 1,
    borderRadius: '20px',
    border: '1px solid #334155',
    transition: 'all 0.3s ease-in-out'
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#94A3B8',
    width: '22px',
    height: '22px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease-in-out',
    '&:before': {
      content: '\'\'',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  }
}))

