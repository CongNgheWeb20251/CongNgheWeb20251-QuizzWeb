import { useState } from 'react'
import { Link } from 'react-router-dom'
import Google from '@mui/icons-material/Google'
import Facebook from '@mui/icons-material/Facebook'
import Person from '@mui/icons-material/Person'
import Email from '@mui/icons-material/Email'
import Lock from '@mui/icons-material/Lock'
import School from '@mui/icons-material/School'
import PersonOutline from '@mui/icons-material/PersonOutline'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import './Register.css'
import { registerUserAPI } from '~/apis/index'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators'
import { API_ROOT } from '~/utils/constants'

function Register() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('student')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleRegister = (data) => {
    const { fullName, username, email, password } = data
    // console.log('Register data:', { fullName, username, email, password, accountType })
    toast.promise(
      registerUserAPI({ fullName, username, email, password, accountType }),
      { pending: 'Registering...' }
    ).then((user) => {
      navigate(`/signin?registeredEmail=${user.email}`)
    })
  }

  const loginWithGoogle = () => {
    window.location.href = `${API_ROOT}/v1/users/google`
  }

  return (
    <div className="register-layout">
      {/* Cột trái với lưới 3D và logo */}
      <div className="left-column">
        <div className="grid-overlay"></div>
        <div className="logo">
          <span className="logo-qui">Qui</span>
          <span className="logo-zzy">zzy</span>
        </div>
      </div>

      {/* Cột phải với form đăng ký */}
      <div className="right-column">
        <div className="register-form-container">
          <div className="register-form-wrapper">
            <h1 className="welcome-text">Create Account</h1>
            <p className="subtitle">Choose your account type and start your journey with us</p>

            {/* Account Type Selection */}
            <div className="account-types">
              <div
                className={`account-type ${accountType === 'student' ? 'active' : ''}`}
                onClick={() => setAccountType('student')}
              >
                <School className="account-type-icon" />
                <div className="account-type-info">
                  <h3>Student</h3>
                  <p>Take quizzes and track your progress</p>
                </div>
              </div>
              <div
                className={`account-type ${accountType === 'teacher' ? 'active' : ''}`}
                onClick={() => setAccountType('teacher')}
              >
                <PersonOutline className="account-type-icon" />
                <div className="account-type-info">
                  <h3>Teacher</h3>
                  <p>Create quizzes and manage students</p>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="social-buttons">
              <button className="social-btn" onClick={loginWithGoogle}>
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

            {/* Form đăng ký */}
            <form onSubmit={handleSubmit(handleRegister)}>
              <div className="form-row">
                <div className="form-group half">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    placeholder="John Doe"
                    variant="outlined"
                    error={!!errors['fullName']}
                    {...register('fullName', {
                      required: FIELD_REQUIRED_MESSAGE
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      )
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName="fullName" />
                </div>
                <div className="form-group half">
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    placeholder="johndoe"
                    variant="outlined"
                    error={!!errors['username']}
                    {...register('username', {
                      required: FIELD_REQUIRED_MESSAGE
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      )
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName="username" />
                </div>
              </div>

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
                    pattern: {
                      value: EMAIL_RULE,
                      message: EMAIL_RULE_MESSAGE
                    }
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
              </div>

              <button type="submit" className="signup-btn">
                Sign up
              </button>
            </form>

            <div className="signin-link">
              Already have an account? <Link to="/signin">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register