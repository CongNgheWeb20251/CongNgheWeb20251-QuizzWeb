import React from 'react'
import { useNavigate } from 'react-router-dom'
import './QuizCard.css'

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate()

  const handleViewClick = () => {
    navigate(`/quizzes/${quiz.id}`)
  }

  const handleMoreClick = () => {
    console.log('More options for quiz:', quiz.id)
    // TODO: Implement more options menu (edit, delete, share, etc)
  }

  return (
    <div className="qc-card">
      <div className="qc-left">
        <div className="qc-icon">📘</div>
        <div className="qc-info">
          <h4 className="qc-title">{quiz.title}</h4>
          <p className="qc-subtitle">{quiz.subtitle}</p>
          <div className="qc-meta">
            <span className="qc-meta-item">{quiz.questionsCount} questions</span>
            <span className="qc-meta-item">•</span>
            <span className="qc-meta-item">{quiz.duration} min</span>
            <span className="qc-meta-item">•</span>
            <span className="qc-meta-item">{quiz.completions} completions</span>
          </div>
        </div>
      </div>
      <div className="qc-actions">
        <button className="qc-btn qc-btn-view" onClick={handleViewClick}>
          View
        </button>
        <button className="qc-btn-more" onClick={handleMoreClick} title="More options">
          ⋮
        </button>
      </div>
    </div>
  )
}

export default QuizCard
