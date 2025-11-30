import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'

import { StyledAvatar } from '../styles/ProfileTab.styles'

const ProfileTab = () => {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  // Những thông tin của user để init vào form (key tương ứng với register phía dưới Field)
  const initialGeneralForm = {
    username: currentUser?.username,
    fullName: currentUser?.fullName
  }
  // Sử dụng defaultValues để set giá trị mặc định cho các field cần thiết
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = (data) => {
    const { username, fullName, bio } = data
    // console.log('data: ', data)

    // Nếu không có sự thay đổi gì về displayname thì không làm gì cả
    if (username === currentUser?.username && fullName === currentUser?.fullName && bio === currentUser?.bio) return

    // Gọi API...
    toast.promise(
      dispatch(updateUserAPI({ username, fullName })),
      {
        pending: 'Updating...'
      }
    ).then(res => {
      if (!res.error) {
        toast.success('Update successfully!', { theme: 'colored' })
      }
    })
  }

  const uploadAvatar = (e) => {
    // Lấy file thông qua e.target?.files[0] và validate nó trước khi xử lý
    // console.log('e.target?.files[0]: ', e.target?.files[0])
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])
    // Cách để log được dữ liệu thông qua FormData
    // console.log('reqData: ', reqData)
    // for (const value of reqData.values()) {
    //   console.log('reqData Value: ', value)
    // }

    // Gọi API...
    toast.promise(
      dispatch(updateUserAPI(reqData)),
      {
        pending: 'Uploading...'
      }
    ).then(res => {
      if (!res.error) {
        toast.success('Avatar updated successfully!', { theme: 'colored' })
      }
      // cần clear giá trị fileInput, nếu không thì nếu gọi api lỗi mà upload lại thì kh có value nữa
      e.target.value = ''
    })

  }

  return (
    <Box >
      <Typography variant="h6" gutterBottom>
        Profile Information
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-upload"
          type="file"
          onChange={uploadAvatar}
        />
        <label htmlFor="avatar-upload">
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <StyledAvatar alt="User Avatar"
              src={currentUser?.avatar} />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'background.paper',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
              aria-label="change photo"
              component="span"
              disableRipple
            >
              <PhotoCameraIcon />
            </IconButton>
          </Box>
        </label>
      </Box>
      <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
        <Box sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)'
          }
        }}>
          <Box>
            <TextField
              fullWidth
              label="Username"
              defaultValue={currentUser?.username}
              {...register('username', {
                required: FIELD_REQUIRED_MESSAGE
              })}
              error={!!errors['username']}
            />
            <FieldErrorAlert errors={errors} fieldName={'username'} />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Full Name"
              defaultValue={currentUser?.fullName}
              {...register('fullName', {
                required: FIELD_REQUIRED_MESSAGE
              })}
              error={!!errors['fullName']}
            />
            <FieldErrorAlert errors={errors} fieldName={'fullName'} />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <TextField
              fullWidth
              label="Email"
              defaultValue={currentUser?.email}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <TextField
              fullWidth
              label="Role"
              defaultValue={currentUser?.role}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <TextField
              fullWidth
              label="Bio"
              defaultValue={currentUser?.bio}
              multiline
              rows={4}
              {...register('bio')}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default ProfileTab