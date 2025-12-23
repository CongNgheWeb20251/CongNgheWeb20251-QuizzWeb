import { Link } from 'react-router-dom'
import Email from '@mui/icons-material/Email'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import '~/pages/SignIn/SignIn.css'

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false)
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()

  const handleSendEmail = async (data) => {
    const { email } = data
    try {
      // TODO: Replace with your actual API call
      // await sendPasswordResetEmail(email)
      console.log('Sending reset email to:', email)

      toast.promise(
        // Simulated API call - replace with actual
        new Promise((resolve) => setTimeout(resolve, 1000)),
        {
          pending: 'Sending email...',
          success: 'Reset link sent to your email!',
          error: 'Failed to send email'
        }
      ).then(() => {
        setEmailSent(true)
      })
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email')
    }
  }

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
            <Link to="/signin" style={{ display: 'flex', alignItems: 'center', color: '#6366f1', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <ArrowBack style={{ marginRight: '4px', fontSize: '1rem' }} />
              Back to Sign In
            </Link>

            <h1 className="welcome-text">Forgot Password?</h1>
            <p className="subtitle">Enter your email address and we'll send you a link to reset your password</p>

            {emailSent && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Password reset link has been sent to <strong>{getValues('email')}</strong>. Please check your inbox.
              </Alert>
            )}

            <form onSubmit={handleSubmit(handleSendEmail)}>
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

              <button type="submit" className="signin-btn">
                Send Reset Link
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

export default ForgotPassword
