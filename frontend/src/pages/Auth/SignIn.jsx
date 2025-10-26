import React, { useState } from 'react'
import './SignIn.css'
import { useNavigate } from 'react-router-dom'

function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement authentication logic
    console.log('Sign in with:', formData)
    // Navigate to home after successful login
    // navigate('/')
  }

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log('Sign in with Google')
  }

  const handleFacebookSignIn = () => {
    // TODO: Implement Facebook OAuth
    console.log('Sign in with Facebook')
  }

  const handleSignUpClick = () => {
    navigate('/signup')
  }

  return (
    <div className="signin-container">
      {/* Left Column - Branding */}
      <div className="signin-left">
        <div className="signin-background">
          <div className="grid-wireframe"></div>
          <div className="gradient-glow"></div>
        </div>
        <div className="signin-brand">
          <h1 className="brand-logo">Quizzy</h1>
          <p className="brand-tagline">Test Your Knowledge, Compete & Win</p>
        </div>
      </div>

      {/* Right Column - Sign In Form */}
      <div className="signin-right">
        <div className="signin-form-wrapper">
          <div className="signin-header">
            <h2 className="signin-title">Welcome back</h2>
            <p className="signin-subtitle">Enter your credentials to access your account</p>
          </div>

          {/* Social Sign In */}
          <div className="social-signin">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={handleGoogleSignIn}
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <button 
              type="button" 
              className="social-btn facebook-btn"
              onClick={handleFacebookSignIn}
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* OR Divider */}
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>

          {/* Sign In Form */}
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="signin-submit-btn">
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="signin-footer">
            <p className="signup-prompt">
              Don't have an account?{' '}
              <button 
                type="button"
                className="signup-link" 
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
