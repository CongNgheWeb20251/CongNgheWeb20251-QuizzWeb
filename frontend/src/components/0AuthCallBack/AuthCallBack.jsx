import { loginAuth0API, updateUserAPI } from '~/redux/user/userSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Zoom from '@mui/material/Zoom'
import {
  GraduationCap,
  BookOpen,
  AlertCircle,
  RefreshCw,
  UserCircle
} from 'lucide-react'

const AuthCallBack = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true)
        const result = await dispatch(loginAuth0API())
        // Redux Toolkit trả về { payload, meta, ... }
        const fetchedUser = result?.payload

        if (mounted) {
          // nếu có role => điều hướng ngay
          const role = fetchedUser?.role
          if (role === 'student') {
            navigate('/dasboard')
            return
          }
          if (role === 'teacher') {
            navigate('/teacher/dashboard')
            return
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message ?? 'Đã có lỗi khi đăng nhập')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const handleSelectRole = async (role) => {
    if (!currentUser) return
    setUpdating(true)
    setError(null)
    try {
      // Sử dụng updateUserAPI từ userSlice để cập nhật role
      await dispatch(updateUserAPI({ role }))

      // điều hướng theo role đã chọn
      if (role === 'student') navigate('/dasboard')
      else navigate('/teacher/dashboard')
    } catch (err) {
      setError(err?.message ?? 'Lỗi khi cập nhật vai trò')
    } finally {
      setUpdating(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Box sx= {{ backgroundColor: '#dfe4ea', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Fade in={loading} timeout={300}>
              <Card
                elevation={3}
                sx={{
                  width: '100%',
                  background: '#17c0eb',
                  color: 'white'
                }}
              >
                <CardContent sx={{ py: 6, textAlign: 'center' }}>
                  <CircularProgress
                    size={60}
                    sx={{ color: 'white', mb: 3 }}
                    thickness={4}
                  />
                  <Typography variant="h5" fontWeight={600}>
                    Đang xác thực...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9, mb: 4 }}>
                    Vui lòng đợi trong giây lát
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        </Container>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box sx= {{ backgroundColor: '#DFF4FF', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Zoom in={!!error}>
              <Card elevation={3} sx={{ width: '100%' }}>
                <CardContent sx={{ py: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'error.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3
                    }}
                  >
                    <AlertCircle size={40} color="#d32f2f" />
                  </Box>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshCw size={20} />}
                    onClick={() => window.location.reload()}
                    size="large"
                  >
                  Thử lại
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Box>
        </Container>
      </Box>
    )
  }

  // No user state
  if (!currentUser) {
    return (
      <Box sx= {{ backgroundColor: '#DFF4FF', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Card elevation={3} sx={{ width: '100%' }}>
              <CardContent sx={{ py: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'warning.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <UserCircle size={40} color="#ed6c02" />
                </Box>
                <Typography variant="h6" gutterBottom>
                Không tìm thấy thông tin người dùng
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshCw size={20} />}
                  onClick={() => window.location.reload()}
                  sx={{ mt: 2 }}
                  size="large"
                >
                Thử lại
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    )
  }

  // Role selection state
  if (!currentUser.role) {
    return (
      <Box sx= {{ backgroundColor: '#DFF4FF', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4
            }}
          >
            <Fade in={!currentUser.role} timeout={500}>
              <Card
                elevation={4}
                sx={{
                  width: '100%',
                  background: '#f8fafc', // single light color to contrast with dark text
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }}
                    >
                      <UserCircle size={50} color="#1976d2" />
                    </Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                    Chào mừng!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                    Vui lòng chọn vai trò của bạn để tiếp tục
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={updating}
                      onClick={() => handleSelectRole('student')}
                      startIcon={
                        updating ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <GraduationCap size={24} />
                        )
                      }
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: '#48dbfb',
                        '&:hover': {
                          background: '#0abde3',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {updating ? 'Đang cập nhật...' : 'Học sinh'}
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      disabled={updating}
                      onClick={() => handleSelectRole('teacher')}
                      startIcon={
                        updating ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <BookOpen size={24} />
                        )
                      }
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {updating ? 'Đang cập nhật...' : 'Giáo viên'}
                    </Button>
                  </Stack>

                  {error && (
                    <Fade in={!!error}>
                      <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                      </Alert>
                    </Fade>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Box>
        </Container>
      </Box>
    )
  }

  // Nếu đã có role thì component đã điều hướng ở useEffect
  return null
}

export default AuthCallBack