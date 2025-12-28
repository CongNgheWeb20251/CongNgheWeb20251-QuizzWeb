import React, { Fragment, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Logout from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI, updateCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm'
import Require2FA from '~/components/2FA/Require2FA'

function UserAvatar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSettings = () => {
    handleClose()
    navigate('/settings')
  }

  const handleLogout = async () => {
    handleClose()
    const { confirmed } = await confirm({
      title: 'Are you sure you want to log out?',
      confirmationText: 'Log out',
      cancellationText: 'Cancel'
      // confirmationButtonProps: { color:"error", variant: "contained" },
      // cancellationButtonProps: { color: "inherit", variant: "outlined" },
      // allowClose: false,

    })
    if (confirmed) {
      // Call the API to log out the user
      dispatch(logoutUserAPI(false))
      // toast.success("Logged out successfully!");
      return
    }
    else {
      () => {}
    }
  }

  // Get user's initials for avatar
  const getInitials = (name) => {
    if (!name) return '?'
    const names = name.trim().split(' ')
    if (names.length === 1) return names[0][0].toUpperCase()
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }

  if (!currentUser) return null

  const updateSuccessVerify2FA = (updatedUser) => {
    dispatch(updateCurrentUser(updatedUser))
  }

  return (
    <Fragment>
      {currentUser.require_2fa && !currentUser.is_2fa_verified &&
      <Require2FA updateSuccessVerify2FA={updateSuccessVerify2FA} />
      }
      <Box>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
            alt={currentUser.displayName || currentUser.email}
            src={currentUser.avatar}
          >
            {getInitials(currentUser.displayName || currentUser.email)}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 200,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="600">
              {currentUser.displayName || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {currentUser.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">Logout</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Fragment>
  )
}

export default UserAvatar
