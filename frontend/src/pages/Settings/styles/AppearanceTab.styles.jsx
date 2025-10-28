import { styled } from '@mui/material/styles';
import { Box, Card } from '@mui/material';

export const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const ThemeCard = styled(Card)((props) => {
  const { theme } = props;
  return {
    cursor: 'pointer',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    '&.selected': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  };
});

export const ColorSwatch = styled(Box)((props) => {
  const { theme } = props;
  return {
    width: 40,
    height: 40,
    borderRadius: '50%',
    cursor: 'pointer',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&.selected': {
      borderColor: theme.palette.text.primary,
    },
  };
});