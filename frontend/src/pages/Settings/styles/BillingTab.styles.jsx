import { styled } from '@mui/material/styles';
import { Box, Card } from '@mui/material';

export const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const PlanCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

export const PlanFeatureList = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& > *': {
    marginBottom: theme.spacing(1),
  },
}));