import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import QuizCard from '~/components/QuizCard'
import UserAvatar from '~/components/UserAvatar/UserAvatar'
import './Quizzes.css'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { Link, useLocation } from 'react-router-dom'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Box from '@mui/material/Box'
import { fetchQuizzesAPI, fetchQuizzesStatsAPI } from '~/apis'


function Quizzes() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [totalQuizzes, setTotalQuizzes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  const [quizzesStats, setQuizzesStats] = useState({
    totalQuizzes: 0,
    publishedQuizzes: 0,
    draftQuizzes: 0
  })

  // khởi tạo filter từ query param
  const initialFilter = query.get('filter') || 'all'
  const [filter, setFilter] = useState(initialFilter) // all, published, drafts

  // từ filter và page xây dựng URL chuẩn
  const buildUrl = (pageParam, filterParam) => {
    const params = new URLSearchParams()
    if (pageParam && Number(pageParam) !== DEFAULT_PAGE) params.set('page', pageParam)
    if (filterParam && filterParam !== 'all') params.set('filter', filterParam)
    const qs = params.toString()
    return `/teacher/quizzes${qs ? `?${qs}` : ''}`
  }

  // fetch Quick Stats chỉ một lần khi component mount
  useEffect(() => {
    fetchQuizzesStatsAPI().then(res => {
      setQuizzesStats(res)
    }).catch(() => {
      // handle error
    })
  }, [])

  // fetch quizzes khi filter hoặc page thay đổi
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    const urlFilter = q.get('filter') || 'all'
    setFilter(urlFilter)
    // console.log('Location search :', location.search)
    setLoading(true)
    fetchQuizzesAPI(location.search).then(res => {
      setQuizzes(res.quizzes || [])
      setTotalQuizzes(res.totalQuizzes || 0)
      setLoading(false)
    })
  }, [location.search])

  // useEffect(() => {
  //   let mounted = true

  //   async function loadQuizzes() {
  //     setLoading(true)
  //     try {
  //       const data = await getQuizzes()
  //       if (mounted) {
  //         setQuizzes(data)
  //       }
  //     } catch (error) {
  //       // eslint-disable-next-line no-console
  //       console.error('Error loading quizzes:', error)
  //     } finally {
  //       if (mounted) setLoading(false)
  //     }
  //   }

  //   loadQuizzes()
  //   return () => { mounted = false }
  // }, [])

  const handleCreateNew = () => {
    navigate('/teacher/create-quiz')
  }

  const filteredQuizzes = quizzes.filter(q => {
    if (filter === 'published') return q.status === 'published'
    if (filter === 'drafts') return q.status === 'draft'
    return true
  })

  const searchedQuizzes = filteredQuizzes.filter(q => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch = term
      ? (q.title?.toLowerCase().includes(term) || q.description?.toLowerCase().includes(term))
      : true
    const matchesCategory = categoryFilter === 'all' ? true : q.category === categoryFilter
    const matchesLevel = levelFilter === 'all' ? true : q.level === levelFilter
    return matchesSearch && matchesCategory && matchesLevel
  })

  const categoryOptions = Array.from(new Set(quizzes.map(q => q.category).filter(Boolean)))
  const levelOptions = Array.from(new Set(quizzes.map(q => q.level).filter(Boolean)))

  const handleStatusChange = (quizId, nextStatus) => {
    setQuizzes(prev => prev.map(q => (q._id === quizId ? { ...q, status: nextStatus } : q)))
  }

  return (
    <div className="quizzes-page">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate('/teacher/dashboard')}
          sx={{
            color: 'rgba(255,255,255,0.9)',
            borderColor: 'rgba(255,255,255,0.06)',
            textTransform: 'none',
            px: 2,
            py: 1,
            backgroundColor: 'transparent',
            transition: 'background-color 160ms, transform 200ms, box-shadow 160ms',
            '& .MuiButton-startIcon': { transition: 'transform 200ms' },
            '&:hover': {
              backgroundColor: 'rgba(139,92,246,0.12)',
              borderColor: 'rgba(139,92,246,0.35)',
              boxShadow: '0 6px 18px rgba(2,6,23,0.6)',
              '& .MuiButton-startIcon': { transform: 'translateX(-6px)' }
            }
          }}
        >
            Dashboard
        </Button>
        <UserAvatar />
      </Box>
      <div className="quizzes-header">
        <div className="quizzes-title-section">
          <h2 className="quizzes-title">Quizzes</h2>
          <p className="quizzes-subtitle">Manage and create your quizzes</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="cq-btn cq-btn-primary" onClick={handleCreateNew}>
            + Create New Quiz
          </button>
        </div>
      </div>

      <div className="quizzes-container">
        <div className="quizzes-main">
          <div className="quizzes-filter">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => {
                // Mỗi khi chuyển filter thì reset về page = 1
                setFilter('all')
                navigate(buildUrl(1, 'all'))
              }}
            >
              All Quizzes
            </button>
            <button
              className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
              onClick={() => {
                setFilter('published')
                navigate(buildUrl(1, 'published'))
              }}
            >
              Published
            </button>
            <button
              className={`filter-btn ${filter === 'drafts' ? 'active' : ''}`}
              onClick={() => {
                setFilter('drafts')
                navigate(buildUrl(1, 'drafts'))
              }}
            >
              Drafts
            </button>
          </div>

          <div className="quizzes-list">
            {loading ? (
              <div className="loader-container">
                <div className="loader"></div>
                <p>Loading quizzes...</p>
              </div>
            ) : searchedQuizzes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No quizzes found</h3>
                <p>Create your first quiz to get started</p>
                <button className="cq-btn cq-btn-primary" onClick={handleCreateNew}>
                  Create Quiz
                </button>
              </div>
            ) : (
              searchedQuizzes.map(quiz => (
                <QuizCard key={quiz._id} quiz={quiz} onStatusChange={handleStatusChange} />
              ))
            )}
          </div>
          {(totalQuizzes > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalQuizzes / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'rgba(255,255,255,0.9)',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.06)',
                      width: 44,
                      height: 44,
                      minWidth: 'auto',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 150ms, box-shadow 150ms, transform 120ms',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        transform: 'translateY(-2px)'
                      }
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      backgroundColor: 'rgba(25,118,210,0.95) !important',
                      color: '#fff !important',
                      boxShadow: '0 8px 24px rgba(2,6,23,0.65)',
                      transform: 'scale(1.05)'
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: 'rgba(255,255,255,0.6)',
                      border: 'none',
                      backgroundColor: 'transparent'
                    },
                    '& .MuiPaginationItem-text': {
                      color: 'rgba(255,255,255,0.9)'
                    }
                  }}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={buildUrl(item.page, filter)}
                      {...item}
                      // đảm bảo từng item duy trì kích thước tròn
                      sx={{ width: 44, height: 44, minWidth: 'auto' }}
                    />
                  )}
                />
              </Box>
          }
        </div>

        <aside className="quizzes-sidebar">
          <div className="side-card">
            <h4 className="side-card-title">Quick Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Total Quizzes</span>
              <div className="stat-value">{quizzesStats.totalQuizzes}</div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Published</span>
              <div className="stat-value">{quizzesStats.publishedQuizzes}</div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Drafts</span>
              <div className="stat-value">{quizzesStats.draftQuizzes}</div>
            </div>
          </div>

          <div className="side-card">
            <h4 className="side-card-title">Quick Actions</h4>
            <button className="side-btn" onClick={handleCreateNew}>
              ➕ Create New
            </button>
            <input
              className="side-input"
              placeholder="🔍 Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="side-select-row">
              <select
                className="side-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All categories</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="side-select"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">All levels</option>
                {levelOptions.map(lv => (
                  <option key={lv} value={lv}>{lv}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Quizzes
