import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import { styled } from '@mui/material/styles'
import LogoutIcon from '@mui/icons-material/Logout'


import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateUserAPI, logoutUserAPI } from '~/redux/user/userSlice'

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}))

const DangerButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.main
  }
}))

const AccountTab = () => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const confirmChangePassword = useConfirm()

  const submitChangePassword = async (data) => {
    const { confirmed } = await confirmChangePassword({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
      </Box>,
      description: 'You have to login again after successfully changing your password. Continue?',
      confirmationText: 'Confirm',
      confirmationButtonProps: { color:'success', variant: 'contained' },
      cancellationText: 'Cancel'
    })
    if (confirmed) {
      const { current_password, new_password } = data

      // Gọi API...
      toast.promise(
        dispatch(updateUserAPI({ current_password, new_password })),
        {
          pending: 'Updating...'
        }
      ).then(res => {
        // console.log('res: ', res)
        if (!res.error) {
          toast.success('Change password successfully!', { theme: 'colored' })
          dispatch(logoutUserAPI(false)) // Logout user after changing password
        }
      })
    } else {
      // Handle cancellation
      () => {}
    }
  }

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
  }

  const handleDeleteAccount = () => {
    // Handle account deletion
    // console.log('Account deletion requested')
    setDeleteDialogOpen(false)
  }

  return (
    <Box>
      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Account Security
        </Typography>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Current Password"
              name="current_password"
              {...register('current_password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={!!errors['current_password']}
            />
            <FieldErrorAlert errors={errors} fieldName={'current_password'} />
          </Box>
          <Box>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="New Password"
              name="new_password"
              {...register('new_password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={!!errors['new_password']}
            />
            <FieldErrorAlert errors={errors} fieldName={'new_password'} />
          </Box>
          <Box>
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Confirm New Password"
              name="new_password_confirmation"
              {...register('new_password_confirmation', {
                validate: (value) => {
                  if (value === watch('new_password')) return true
                  return 'Password confirmation does not match.'
                }
              })}
              error={!!errors['new_password_confirmation']}
            />
            <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Update Password
          </Button>
        </form>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Two-Factor Authentication
        </Typography>
        <ListItem>
          <ListItemText
            primary="Enable Two-Factor Authentication"
            secondary="Add an extra layer of security to your account"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom>
          Connected Accounts
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Google" secondary="Connected" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Disconnect
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Facebook" secondary="Not connected" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Connect
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="X" secondary="Not connected" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Connect
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </StyledSection>

      <StyledSection>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <DangerButton
          variant="outlined"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Account
        </DangerButton>
      </StyledSection>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AccountTab