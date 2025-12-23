import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Lock from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import '~/pages/SignIn/SignIn.css'
import { resetPasswordAPI } from '~/apis'

function ResetPassword() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || 'preview-token' // Default token for preview
  const email = searchParams.get('email')

  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const handleResetPassword = async (data) => {
    const { password } = data
    try {
      toast.promise(
        resetPasswordAPI({ email, token, password }),
        {
          pending: 'Resetting password...',
          success: 'Password reset successfully!'
        }
      ).then(() => {
        navigate('/signin')
      })
    } catch (error) {
      toast.error(error.message || 'Failed to reset password')
    }
  }

  // Comment out token check for preview
  /*
  if (!token) {
    return (
      <div className="signin-layout">
        <div className="left-column">
          <div className="grid-overlay"></div>
          <div className="logo">
            <span className="logo-qui">Qui</span>
            <span className="logo-zzy">zzy</span>
          </div>
        </div>
        <div className="right-column">
          <div className="signin-form-container">
            <div className="signin-form-wrapper">
              <Alert severity="error">Invalid or missing reset token</Alert>
              <div className="signup-link" style={{ marginTop: '1rem' }}>
                <Link to="/forgot-password">Request a new reset link</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  */

  return (
    <div className="signin-layout">
      <div className="left-column">
        <div className="grid-overlay"></div>
        <div className="logo">
          <span className="logo-qui">Qui</span>
          <span className="logo-zzy">zzy</span>
        </div>
      </div>

      <div className="right-column">
        <div className="signin-form-container">
          <div className="signin-form-wrapper">
            <h1 className="welcome-text">Reset Password</h1>
            <p className="subtitle">Enter your new password</p>

            <form onSubmit={handleSubmit(handleResetPassword)}>
              <div className="form-group">
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  variant="outlined"
                  error={!!errors['password']}
                  {...register('password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FieldErrorAlert errors={errors} fieldName="password" />
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  variant="outlined"
                  error={!!errors['confirmPassword']}
                  {...register('confirmPassword', {
                    required: FIELD_REQUIRED_MESSAGE,
                    validate: (value) => value === watch('password') || 'Passwords do not match'
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle confirm password visibility"
                          edge="end"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <FieldErrorAlert errors={errors} fieldName="confirmPassword" />
              </div>

              <button type="submit" className="signin-btn">
                Reset Password
              </button>
            </form>

            <div className="signup-link">
              Remember your password? <Link to="/signin">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
