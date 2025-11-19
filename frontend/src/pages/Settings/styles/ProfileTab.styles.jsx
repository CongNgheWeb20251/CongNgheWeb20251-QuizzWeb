import { styled } from '@mui/material/styles'
import { Box, Avatar } from '@mui/material';

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}))