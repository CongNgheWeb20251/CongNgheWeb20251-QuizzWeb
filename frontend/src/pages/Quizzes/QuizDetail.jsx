/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuizInfo, deleteQuizAPI } from '~/apis'
import { FRONTEND_URL } from '~/utils/constants'
import './QuizDetail.css'
import ShareQuizModal from '~/components/Modal/ShareQuizModal'
import { useConfirm } from 'material-ui-confirm'
import { CircleAlert, X } from 'lucide-react'

function QuizDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const confirm = useConfirm()

  useEffect(() => {
    let mounted = true

    async function loadQuiz() {
      setLoading(true)
      try {
        const data = await getQuizInfo(id)
        if (mounted) {
          setQuiz(data)
        }
      } catch (error) {
        console.error('Error loading quiz:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadQuiz()
    return () => { mounted = false }
  }, [id])

  const handleEdit = () => {
    // console.log('Edit quiz:', id)
    // TODO: Implement edit redirect to /create-quiz/step1?id=...
    navigate(`/teacher/edit/${id}/step1`)
  }

  const handleDelete = async () => {
    const { confirmed } = await confirm({
      title: (
        <div className='flex  flex-row items-center gap-2 justify-between'>
          <div className='flex gap-2 items-center'>
            <CircleAlert color="red" />
            <span>Are you sure you want to delete this quiz?</span>
          </div>
          {/* <X color="red" /> */}
        </div>
      ),
      description: (
        <div className="mt-4 space-y-2 mb-2">
          <p className="text-sm text-gray-600">
            This action will permanently delete
            <span className="mx-1 font-semibold text-gray-900">
              {quiz.title}
            </span>
            and all related data.
          </p>
          <div className="pt-1 text-sm text-gray-600">
            Type
            <span className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-gray-900">
              {quiz.title}
            </span>
            to confirm.
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          ⚠ This action cannot be undone.
          </div>
        </div>
      ),
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
      confirmationKeyword: `${quiz.title}`,
      allowClose: true

    })
    if (confirmed) {
      // Call the API to delete the quiz
      await deleteQuizAPI(id)
      navigate('/teacher/quizzes')
      return
    }
    else {
      () => {}
    }
  }

  const handleShare = () => {
    setShareModalOpen(true)
  }

  if (loading) {
    return (
      <div className="qd-page">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="qd-page">
        <div className="error-container">
          <h2>Quiz not found</h2>
          <button className="cq-btn cq-btn-primary" onClick={() => navigate('/teacher/quizzes')}>
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="qd-page">
      <div className="qd-header">
        <div className="qd-header-left">
          <button className="back-link" onClick={() => navigate('/teacher/quizzes')}>
            ← Quizzes
          </button>
          <div className="qd-header-title">
            <h1>{quiz.title}</h1>
            <p className="qd-subtitle">{quiz.subtitle}</p>
          </div>
        </div>
        <div className="qd-header-actions">
          <button className="cq-btn" onClick={handleEdit}>Edit</button>
          <button className="cq-btn" onClick={handleShare}>Share</button>
          <button className="cq-btn cq-btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="qd-stats-grid">
        <div className="qd-stat">
          <span className="qd-stat-label">Total Completions</span>
          <div className="qd-stat-value">{quiz.completions}</div>
        </div>
        <div className="qd-stat">
          <span className="qd-stat-label">Avg. Completion Time</span>
          <div className="qd-stat-value">{quiz.avgTime}</div>
        </div>
        <div className="qd-stat">
          <span className="qd-stat-label">Average Score</span>
          <div className="qd-stat-value">{quiz.avgScore}%</div>
        </div>
        <div className="qd-stat">
          <span className="qd-stat-label">Top Score</span>
          <div className="qd-stat-value">{quiz.topScore}%</div>
        </div>
      </div>

      <div className="qd-content">
        <div className="qd-main">
          <div className="qd-section">
            <h3 className="qd-section-title">Recent Completions</h3>
            {quiz.recent && quiz.recent.length > 0 ? (
              <div className="qd-table-wrapper">
                <table className="qd-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Time</th>
                      <th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quiz.recent.map((record, idx) => (
                      <tr key={idx}>
                        <td>{record.student}</td>
                        <td className="qd-score">{record.score}%</td>
                        <td>{record.time}</td>
                        <td className="qd-when">{record.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="qd-empty">No completions yet</p>
            )}
          </div>
        </div>

        <div className="qd-side">
          <div className="qd-section">
            <h3 className="qd-section-title">Question Performance</h3>
            {quiz.questionPerf && quiz.questionPerf.length > 0 ? (
              <ol className="qd-perf-list">
                {quiz.questionPerf.map((q, idx) => (
                  <li key={idx} className="qd-perf-item">
                    <span className="qd-perf-text">{q.text}</span>
                    <span className="qd-perf-pct">{q.pct}%</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="qd-empty">No performance data</p>
            )}
          </div>
        </div>
      </div>

      <div className="qd-footer">
        <button className="cq-btn cq-btn-primary" onClick={handleShare}>
          Share Quiz with Students
        </button>
      </div>
      <ShareQuizModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        quizTitle={quiz.title}
        joinUrl={quiz.inviteToken ? `${FRONTEND_URL}/join/${quiz.inviteToken}` : ''}
      />
    </div>
  )
}

export default QuizDetail
