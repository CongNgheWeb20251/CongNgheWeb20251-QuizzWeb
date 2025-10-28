import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const DangerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.main,
  },
}));