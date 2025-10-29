import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Google, Facebook, Person, Email, Lock } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './SignIn.css'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'

function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const { register, handleSubmit, formState: { errors } } = useForm()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
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
    // console.log('Form submitted:', formData)
    const { username, email, password } = formData
    console.log('Sign In data:', { username, email, password })
    // toast.promise(
    //   dispatch(loginUserAPI({ username, email, password })),
    //   { pending: 'Logging in...' }
    // ).then((res) => {
    //   if (!res.error) {
    //     navigate('/dashboard', { replace: true })
    //   }
    // })
  }

  const handleSignUp = () => {
    navigate('/signup')
  }
  const handleSignIn = () => {
    navigate('/dashboard')
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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
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

              <button type="submit" className="signin-btn" onClick={handleSignIn}>
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