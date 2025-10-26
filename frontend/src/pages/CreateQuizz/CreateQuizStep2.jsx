import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './CreateQuizStep2.css'

function CreateQuizStep2() {
  const navigate = useNavigate()
  const location = useLocation()
  const quizDataFromStep1 = location.state?.quizData || {}

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'Which of the following is NOT a renewable energy source?',
      points: 10,
      type: 'multiple-choice',
      options: [
        { id: 1, text: 'Solar Power', isCorrect: false },
        { id: 2, text: 'Wind Power', isCorrect: false },
        { id: 3, text: 'Natural Gas', isCorrect: true },
        { id: 4, text: 'Hydroelectric Power', isCorrect: false }
      ]
    }
  ])

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  const handleOptionChange = (questionId, optionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt => 
            opt.id === optionId ? { ...opt, [field]: value } : opt
          )
        }
      }
      return q
    }))
  }

  const handleCorrectAnswerChange = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt => ({
            ...opt,
            isCorrect: opt.id === optionId
          }))
        }
      }
      return q
    }))
  }

  const handleAddOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption = {
          id: Math.max(...q.options.map(o => o.id)) + 1,
          text: '',
          isCorrect: false
        }
        return { ...q, options: [...q.options, newOption] }
      }
      return q
    }))
  }

  const handleRemoveOption = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId)
        }
      }
      return q
    }))
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      text: '',
      points: 10,
      type: 'multiple-choice',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId))
    }
  }

  const handleBack = () => {
    navigate('/create-quiz/step1', { state: { quizData: quizDataFromStep1 } })
  }

  const handleSaveDraft = () => {
    console.log('Save draft - Step 2:', { ...quizDataFromStep1, questions })
    // TODO: Call API
  }

  const handlePreview = () => {
    console.log('Preview quiz:', { ...quizDataFromStep1, questions })
    // TODO: Show preview modal
  }

  const handlePublish = () => {
    console.log('Publish quiz:', { ...quizDataFromStep1, questions })
    // TODO: Validate, call API, navigate to success page
    alert('Quiz published successfully! (TODO: implement API)')
    navigate('/dashboard')
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
            <h1 className="cq-title">Create Quiz - 2</h1>
            <p className="cq-subtitle">Add questions, set answers and configure quiz settings.</p>
          </div>
        </div>
        <div className="cq-header-right">
          <button type="button" className="cq-btn cq-btn-secondary" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button type="button" className="cq-btn cq-btn-primary" onClick={handlePreview}>
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

          <div className="cq-form">
            {/* Section Header */}
            <div className="cq-section-header">
              <div>
                <h3 className="cq-section-title">Quiz Questions</h3>
                <p className="cq-section-desc">Create and manage your quiz questions.</p>
              </div>
            </div>

            {/* Questions List */}
            <div className="cq-questions-list">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="cq-question-card">
                  {/* Question Header */}
                  <div className="cq-question-header">
                    <h4 className="cq-question-number">Question {qIndex + 1}</h4>
                    <div className="cq-question-controls">
                      <div className="cq-question-meta">
                        <label className="cq-meta-label">Points:</label>
                        <input
                          type="number"
                          className="cq-meta-input"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <select
                        className="cq-question-type"
                        value={question.type}
                        onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="cq-btn-delete"
                          onClick={() => handleRemoveQuestion(question.id)}
                          title="Delete question"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="cq-form-group">
                    <label className="cq-label">Question Text</label>
                    <textarea
                      className="cq-textarea"
                      rows={2}
                      value={question.text}
                      onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {/* Answer Options */}
                  {question.type === 'multiple-choice' && (
                    <div className="cq-form-group">
                      <label className="cq-label">Answer Options</label>
                      <div className="cq-options-list">
                        {question.options.map((option, oIndex) => (
                          <div key={option.id} className="cq-option-row">
                            <div className="cq-option-radio">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={option.isCorrect}
                                onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                                title="Mark as correct answer"
                              />
                            </div>
                            <input
                              type="text"
                              className="cq-option-input"
                              value={option.text}
                              onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                className="cq-btn-remove-option"
                                onClick={() => handleRemoveOption(question.id, option.id)}
                                title="Remove option"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="cq-btn-add-option"
                          onClick={() => handleAddOption(question.id)}
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Question Button */}
            <button type="button" className="cq-btn-add-question" onClick={handleAddQuestion}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Question
            </button>

            {/* Footer Buttons */}
            <div className="cq-form-footer">
              <button type="button" className="cq-btn cq-btn-secondary" onClick={handleBack}>
                &lt; Prev
              </button>
              <button type="button" className="cq-btn cq-btn-primary" onClick={handlePublish}>
                Preview & Publish
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateQuizStep2
