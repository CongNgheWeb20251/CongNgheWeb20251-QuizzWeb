import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuizzes } from '~/apis'
import QuizCard from '~/components/QuizCard'
import './Quizzes.css'

function Quizzes() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, published, drafts

  useEffect(() => {
    let mounted = true
    
    async function loadQuizzes() {
      setLoading(true)
      try {
        const data = await getQuizzes()
        if (mounted) {
          setQuizzes(data)
        }
      } catch (error) {
        console.error('Error loading quizzes:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadQuizzes()
    return () => { mounted = false }
  }, [])

  const handleCreateNew = () => {
    navigate('/create-quiz/step1')
  }

  const filteredQuizzes = quizzes.filter(q => {
    if (filter === 'published') return q.status === 'published'
    if (filter === 'drafts') return q.status === 'draft'
    return true
  })

  return (
    <div className="quizzes-page">
      <div className="quizzes-header">
        <div className="quizzes-title-section">
          <h2 className="quizzes-title">Quizzes</h2>
          <p className="quizzes-subtitle">Manage and create your quizzes</p>
        </div>
        <button className="cq-btn cq-btn-primary" onClick={handleCreateNew}>
          + Create New Quiz
        </button>
      </div>

      <div className="quizzes-container">
        <div className="quizzes-main">
          <div className="quizzes-filter">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Quizzes
            </button>
            <button 
              className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
              onClick={() => setFilter('published')}
            >
              Published
            </button>
            <button 
              className={`filter-btn ${filter === 'drafts' ? 'active' : ''}`}
              onClick={() => setFilter('drafts')}
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
            ) : filteredQuizzes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No quizzes found</h3>
                <p>Create your first quiz to get started</p>
                <button className="cq-btn cq-btn-primary" onClick={handleCreateNew}>
                  Create Quiz
                </button>
              </div>
            ) : (
              filteredQuizzes.map(quiz => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))
            )}
          </div>
        </div>

        <aside className="quizzes-sidebar">
          <div className="side-card">
            <h4 className="side-card-title">Quick Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Total Quizzes</span>
              <div className="stat-value">{quizzes.length}</div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Published</span>
              <div className="stat-value">{quizzes.filter(q => q.status === 'published').length}</div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Drafts</span>
              <div className="stat-value">{quizzes.filter(q => q.status === 'draft').length}</div>
            </div>
          </div>

          <div className="side-card">
            <h4 className="side-card-title">Quick Actions</h4>
            <button className="side-btn" onClick={handleCreateNew}>
              ➕ Create New
            </button>
            <button className="side-btn">
              🔍 Browse Templates
            </button>
            <button className="side-btn">
              ⚙️ Settings
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Quizzes
