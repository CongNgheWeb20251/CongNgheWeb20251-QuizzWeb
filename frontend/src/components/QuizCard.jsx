import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { draftQuizAPI, publishQuizAPI } from '~/apis'
import './QuizCard.css'
import { Book, BookKey, BookLock, Check } from 'lucide-react'

const QuizCard = ({ quiz, onStatusChange }) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const menuRef = useRef(null)

  const handleViewClick = () => {
    navigate(`/teacher/quizzes/${quiz._id}`)
  }

  const handleMoreClick = () => {
    setMenuOpen((prev) => !prev)
  }

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleStatusUpdate = async (nextStatus) => {
    if (quiz.status === nextStatus) {
      setMenuOpen(false)
      return
    }
    try {
      setSubmitting(true)
      if (nextStatus === 'published') {
        await publishQuizAPI(quiz._id)
      } else {
        await draftQuizAPI(quiz._id)
      }
      onStatusChange?.(quiz._id, nextStatus)
      toast.success(`Quiz is now ${nextStatus}`)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      //
    } finally {
      setSubmitting(false)
      setMenuOpen(false)
    }
  }

  return (
    <div className="qc-card">
      <div className="qc-left">
        <div className="qc-icon">
          {quiz.status === 'published' ? <BookKey /> : <BookLock />}
        </div>
        <div className="qc-info">
          <h4 className="qc-title">{quiz.title}</h4>
          <p className="qc-subtitle">{quiz.subtitle}</p>
          <div className="qc-meta">
            <span className="qc-meta-item">{quiz?.questionOrderIds?.length} questions</span>
            <span className="qc-meta-item">•</span>
            <span className="qc-meta-item">{quiz.timeLimit} min</span>
            <span className="qc-meta-item">•</span>
            <span className="qc-meta-item">{quiz?.completedCount} completions</span>
          </div>
        </div>
      </div>
      <div className="qc-actions">
        <button className="qc-btn qc-btn-view" onClick={handleViewClick}>
          View
        </button>
        <div className="qc-more-wrapper" ref={menuRef}>
          <button
            className="qc-btn-more"
            onClick={handleMoreClick}
            title="More options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="qc-more-menu">
              <button
                className={`qc-menu-item ${quiz.status === 'draft' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('draft')}
                disabled={submitting}
              >
                {quiz.status === 'draft' ? <div className="flex items-center justify-center gap-2"> Draft <Check /></div> : 'Draft'}
              </button>
              <button
                className={`qc-menu-item ${quiz.status === 'published' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('published')}
                disabled={submitting}
              >
                {quiz.status === 'published' ? <div className="flex items-center justify-center gap-2"> Published <Check /></div> : 'Published'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizCard
