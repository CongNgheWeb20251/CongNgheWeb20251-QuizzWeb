/* eslint-disable no-console */
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateQuizStep1.css'
import { createQuizStep1API } from '~/apis'
import Button from '@mui/material/Button'

function CreateQuizStep1() {
  const navigate = useNavigate()

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'science',
    difficulty: 'medium',
    timeLimit: 15,
    passingScore: 70,
    randomizeQuestions: true,
    immediateResults: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setQuizData({
      ...quizData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleNext = async (e) => {
    e.preventDefault()
    // TODO: Validate and save to context/localStorage
    console.log('Step 1 data:', quizData)
    const result = await createQuizStep1API({ ...quizData, status: 'draft' })
    console.log('Step 1 API result:', result)
    navigate(`/teacher/edit/${result.insertedId}/step2`)
  }

  const handleBack = () => {
    navigate('/teacher/dashboard')
  }

  const formRef = useRef(null)

  const handleSaveDraft = async (e) => {
    // Prevent default if called from a button
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    // Use HTML5 constraint validation — reportValidity shows messages and returns false if invalid
    if (formRef.current && !formRef.current.reportValidity()) {
      return
    }

    try {
      const result = await createQuizStep1API({ ...quizData, status: 'draft' })
      console.log('Saved draft:', result)
      // Navigate to edit step2 (same as Next) so user can continue editing the quiz
      navigate(`/teacher/edit/${result.insertedId}/step1`)
    } catch (err) {
      console.error('Failed to save draft', err)
    }
  }

  const handlePreview = () => {
    console.log('Preview quiz:', quizData)
    // TODO: Show preview modal or navigate to preview page
  }

  return (
    <div className="create-quiz-container">
      {/* Header */}
      <header className="cq-header">
        <div className="cq-header-left">
          <button type="button" className="cq-btn-back" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="cq-title">Create Quiz - 1</h1>
            <p className="cq-subtitle">Add questions, set answers and configure quiz settings.</p>
          </div>
        </div>
        <div className="cq-header-right">
          <Button
            variant="outlined"
            sx={{
              color: '#64748b',
              borderColor: '#cbd5e1',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc'
              }
            }}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <button type="button" className="cq-btn-1 cq-btn-primary" onClick={handlePreview}>
            Preview
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="cq-main">
        <div className="cq-card">
          <div className="cq-card-header">
            <h2 className="cq-card-title">Create New Quiz</h2>
          </div>

          <form className="cq-form" onSubmit={handleNext} ref={formRef}>
            <div className="cq-form-grid">
              {/* Left Column - Quiz Details */}
              <div className="cq-form-section">
                <h3 className="cq-section-title">Quiz Details</h3>
                <p className="cq-section-desc">Basic information about your quiz.</p>

                <div className="cq-form-group">
                  <label htmlFor="title" className="cq-label">
                    Quiz Title <span className="cq-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="cq-input"
                    value={quizData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="cq-form-group">
                  <label htmlFor="description" className="cq-label">
                    Description <span className="cq-required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="cq-textarea"
                    rows={4}
                    value={quizData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="cq-form-group">
                  <label htmlFor="category" className="cq-label">
                    Category <span className="cq-required">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="cq-select"
                    value={quizData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="literature">Literature</option>
                    <option value="technology">Technology</option>
                  </select>
                </div>

                <div className="cq-form-group">
                  <label htmlFor="difficulty" className="cq-label">
                    Difficulty Level <span className="cq-required">*</span>
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    className="cq-select"
                    value={quizData.difficulty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Quiz Settings */}
              <div className="cq-form-section">
                <h3 className="cq-section-title">Quiz Settings</h3>
                <p className="cq-section-desc">Configure how your quiz works.</p>

                <div className="cq-form-group">
                  <label htmlFor="timeLimit" className="cq-label">
                    Time Limit <span className="cq-required">*</span>
                  </label>
                  <div className="cq-input-group">
                    <input
                      type="number"
                      id="timeLimit"
                      name="timeLimit"
                      className="cq-input"
                      value={quizData.timeLimit}
                      onChange={handleChange}
                      min="1"
                      max="180"
                      required
                    />
                    <span className="cq-input-suffix">minutes</span>
                  </div>
                </div>

                <div className="cq-form-group">
                  <label htmlFor="passingScore" className="cq-label">
                    Passing Score <span className="cq-required">*</span>
                  </label>
                  <div className="cq-input-group">
                    <input
                      type="number"
                      id="passingScore"
                      name="passingScore"
                      className="cq-input"
                      value={quizData.passingScore}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      required
                    />
                    <span className="cq-input-suffix">%</span>
                  </div>
                </div>

                <div className="cq-form-group">
                  <div className="cq-toggle-wrapper">
                    <div className="cq-toggle-label-wrapper">
                      <label htmlFor="randomizeQuestions" className="cq-label">
                        Randomize Questions
                      </label>
                      <p className="cq-toggle-desc">Show questions in random order.</p>
                    </div>
                    <label className="cq-toggle">
                      <input
                        type="checkbox"
                        id="randomizeQuestions"
                        name="randomizeQuestions"
                        checked={quizData.randomizeQuestions}
                        onChange={handleChange}
                      />
                      <span className="cq-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="cq-form-group">
                  <div className="cq-toggle-wrapper">
                    <div className="cq-toggle-label-wrapper">
                      <label htmlFor="immediateResults" className="cq-label">
                        Immediate Results
                      </label>
                      <p className="cq-toggle-desc">Show results for each question.</p>
                    </div>
                    <label className="cq-toggle">
                      <input
                        type="checkbox"
                        id="immediateResults"
                        name="immediateResults"
                        checked={quizData.immediateResults}
                        onChange={handleChange}
                      />
                      <span className="cq-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="cq-form-footer">
              <button type="button" className="cq-btn-1 cq-btn-primary" onClick={handleBack}>
                Prev
              </button>
              <button type="submit" className="cq-btn-1 cq-btn-primary">
                Next
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateQuizStep1
