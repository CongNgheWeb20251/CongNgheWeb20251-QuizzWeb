import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Google, 
  Facebook, 
  Person, 
  Email, 
  Lock,
  School,
  PersonOutline 
} from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import './Register.css'
import { registerUserAPI } from '~/apis/index'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('student')
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    accountType: accountType
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { fullName, username, email, password, accountType } = formData
    // console.log('Register data:', { fullName, username, email, password, accountType })
    toast.promise(
      registerUserAPI({ fullName, username, email, password, accountType }),
      { pending: 'Registering...' }
    ).then((user) => {
      navigate(`/signin?registeredEmail=${user.email}`)
    })
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

            {/* Form đăng ký */}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group half">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="form-group half">
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
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