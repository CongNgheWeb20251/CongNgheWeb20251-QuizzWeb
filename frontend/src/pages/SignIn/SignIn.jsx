import { Link, useSearchParams } from 'react-router-dom'
import Google from '@mui/icons-material/Google'
import Facebook from '@mui/icons-material/Facebook'
import Person from '@mui/icons-material/Person'
import Email from '@mui/icons-material/Email'
import Lock from '@mui/icons-material/Lock'

import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import { useNavigate } from 'react-router-dom'
import './SignIn.css'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleLogin = (data) => {
    const { email, password } = data
    // console.log('Sign In data:', { email, password })
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then((res) => {
      if (!res.error) {
        if (res.payload?.role === 'teacher') {
          navigate('/teacher/dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    })
  }


  return (
    <div className="signin-layout">
      {/* Cột trái với lưới 3D và logo */}
      <div className="left-column">
        <div className="grid-overlay"></div>
        <div className="logo">
          <span className="logo-qui">Qui</span>
          <span className="logo-zzy">zzy</span>
        </div>
      </div>

      {/* Cột phải với form đăng nhập */}
      <div className="right-column">
        <div className="signin-form-container">
          <div className="signin-form-wrapper">
            <h1 className="welcome-text">Welcome back</h1>
            <p className="subtitle">Enter your credentials to access your account</p>
            {verifiedEmail && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Your email <strong>{verifiedEmail}</strong> has been verified!
              </Alert>
            )}
            {registeredEmail && (
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Please check <strong>{registeredEmail}</strong> to verify your account!
              </Alert>
            )}

            {/* Nút đăng nhập mạng xã hội */}
            <div className="social-buttons">
              <button className="social-btn">
                <Google className="social-icon" />
                Google
              </button>
              <button className="social-btn">
                <Facebook className="social-icon" />
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

            {/* Form đăng nhập */}
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  variant="outlined"
                  error={!!errors['email']}
                  {...register('email', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                  })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    )
                  }}
                />
                <FieldErrorAlert errors={errors} fieldName="email" />
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
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
                    )
                  }}
                />
                <FieldErrorAlert errors={errors} fieldName="password" />
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      color: '#6366f1', 
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button type="submit" className="signin-btn">
                Sign In
              </button>
            </form>

            <div className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn