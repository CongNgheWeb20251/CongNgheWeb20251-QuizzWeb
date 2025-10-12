import React from 'react'
import './CreateQuizzStep1.css'

function CreateQuizzStep1() {
  return (
    <div className="create-quiz-page">
      <nav className="cq-topbar" role="navigation" aria-label="Quiz creation navigation">
        <div className="cq-topbar-left">
          <button
            className="cq-btn cq-btn-icon"
            aria-label="Go back to previous page"
            data-action="navigate-back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="cq-topbar-right">
          <button
            className="cq-btn cq-btn-secondary"
            data-action="save-draft"
            type="button"
          >
            Save Draft
          </button>
          <button
            className="cq-btn cq-btn-primary"
            data-action="preview-quiz"
            type="button"
          >
            Preview
          </button>
        </div>
      </nav>

      <main className="cq-main-container" role="main">
        <div className="cq-quiz-card">
          <h1 className="cq-heading-1 cq-quiz-title">Create New Quiz</h1>
          <p className="cq-quiz-subtitle">Step 1 of 3: Basic Information</p>

          <form className="cq-quiz-form" id="quizForm" data-form="quiz-creation">
            <div className="cq-form-columns">

              <div className="cq-quiz-left">
                <h2 className="cq-heading-2 cq-section-title">Quiz Details</h2>

                <div className="cq-field">
                  <label htmlFor="quizTitle" className="cq-field-label">
                    Quiz Title <span className="cq-text-required" aria-label="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="quizTitle"
                    name="quizTitle"
                    className="cq-field-control"
                    defaultValue="Introduction to Environmental Science"
                    required
                    maxLength="100"
                    data-field="quiz-title"
                    aria-describedby="quizTitleHint"
                  />
                  <small id="quizTitleHint" className="cq-field-hint">
                    Enter a clear, descriptive title for your quiz (max 100 characters)
                  </small>
                </div>

                <div className="cq-field">
                  <label htmlFor="quizDescription" className="cq-field-label">
                    Description <span className="cq-text-required" aria-label="required">*</span>
                  </label>
                  <textarea
                    id="quizDescription"
                    name="quizDescription"
                    className="cq-field-control cq-field-textarea"
                    rows="4"
                    required
                    maxLength="500"
                    data-field="quiz-description"
                    aria-describedby="quizDescriptionHint"
                    defaultValue="Test your knowledge about environmental science basics, including renewable energy, ecosystems, and sustainability."
                  />
                  <small id="quizDescriptionHint" className="cq-field-hint">
                    Provide a brief overview of what this quiz covers (max 500 characters)
                  </small>
                </div>

                <div className="cq-field">
                  <label htmlFor="quizCategory" className="cq-field-label">
                    Category <span className="cq-text-required" aria-label="required">*</span>
                  </label>
                  <select
                    id="quizCategory"
                    name="quizCategory"
                    className="cq-field-control cq-field-select"
                    required
                    data-field="quiz-category"
                    aria-describedby="quizCategoryHint"
                    defaultValue="science"
                  >
                    <option value="">Select a category</option>
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="literature">Literature</option>
                    <option value="technology">Technology</option>
                    <option value="arts">Arts</option>
                    <option value="general">General Knowledge</option>
                  </select>
                  <small id="quizCategoryHint" className="cq-field-hint">
                    Choose the subject area that best fits your quiz
                  </small>
                </div>

                <div className="cq-field">
                  <label htmlFor="difficultyLevel" className="cq-field-label">
                    Difficulty Level <span className="cq-text-required" aria-label="required">*</span>
                  </label>
                  <select
                    id="difficultyLevel"
                    name="difficultyLevel"
                    className="cq-field-control cq-field-select"
                    required
                    data-field="difficulty-level"
                    aria-describedby="difficultyLevelHint"
                    defaultValue="medium"
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                  <small id="difficultyLevelHint" className="cq-field-hint">
                    Set the complexity level appropriate for your target audience
                  </small>
                </div>
              </div>

              <div className="cq-quiz-right">
                <h2 className="cq-heading-2 cq-section-title">Quiz Settings</h2>

                <div className="cq-field">
                  <label htmlFor="timeLimit" className="cq-field-label">
                    Time Limit <span className="cq-text-required" aria-label="required">*</span>
                  </label>
                  <div className="cq-field-group">
                    <input
                      type="number"
                      id="timeLimit"
                      name="timeLimit"
                      className="cq-field-control cq-field-number"
                      defaultValue="15"
                      min="1"
                      max="180"
                      required
                      data-field="time-limit"
                      aria-describedby="timeLimitHint"
                    />
                    <span className="cq-field-unit" aria-label="minutes">minutes</span>
                  </div>
                  <small id="timeLimitHint" className="cq-field-hint">
                    Total time allowed to complete the quiz (1-180 minutes)
                  </small>
                </div>

                <div className="cq-field">
                  <label htmlFor="passingScore" className="cq-field-label">
                    Passing Score <span className="cq-text-required" aria-label="required">*</span>
                  </label>
                  <div className="cq-field-group">
                    <input
                      type="number"
                      id="passingScore"
                      name="passingScore"
                      className="cq-field-control cq-field-number"
                      defaultValue="70"
                      min="0"
                      max="100"
                      required
                      data-field="passing-score"
                      aria-describedby="passingScoreHint"
                    />
                    <span className="cq-field-unit" aria-label="percent">%</span>
                  </div>
                  <small id="passingScoreHint" className="cq-field-hint">
                    Minimum score required to pass (0-100%)
                  </small>
                </div>

                <div className="cq-field">
                  <div className="cq-toggle-wrapper">
                    <label htmlFor="randomizeQuestions" className="cq-field-label cq-field-label-toggle">
                      Randomize Questions
                    </label>
                    <div className="cq-toggle">
                      <input
                        type="checkbox"
                        id="randomizeQuestions"
                        name="randomizeQuestions"
                        className="cq-toggle-input"
                        defaultChecked
                        data-field="randomize-questions"
                        aria-describedby="randomizeQuestionsHint"
                      />
                      <span className="cq-toggle-slider" aria-hidden="true"></span>
                      <span className="cq-toggle-label" aria-live="polite">
                        <span className="cq-toggle-label-on">ON</span>
                        <span className="cq-toggle-label-off">OFF</span>
                      </span>
                    </div>
                  </div>
                  <small id="randomizeQuestionsHint" className="cq-field-hint">
                    Shuffle question order for each quiz attempt
                  </small>
                </div>

                <div className="cq-field">
                  <div className="cq-toggle-wrapper">
                    <label htmlFor="immediateResults" className="cq-field-label cq-field-label-toggle">
                      Immediate Results
                    </label>
                    <div className="cq-toggle">
                      <input
                        type="checkbox"
                        id="immediateResults"
                        name="immediateResults"
                        className="cq-toggle-input"
                        defaultChecked
                        data-field="immediate-results"
                        aria-describedby="immediateResultsHint"
                      />
                      <span className="cq-toggle-slider" aria-hidden="true"></span>
                      <span className="cq-toggle-label" aria-live="polite">
                        <span className="cq-toggle-label-on">ON</span>
                        <span className="cq-toggle-label-off">OFF</span>
                      </span>
                    </div>
                  </div>
                  <small id="immediateResultsHint" className="cq-field-hint">
                    Show results and correct answers immediately after submission
                  </small>
                </div>
              </div>
            </div>

            <div className="cq-form-footer">
              <button
                type="button"
                className="cq-btn cq-btn-secondary cq-btn-footer"
                data-action="navigate-prev"
                disabled
              >
                Prev
              </button>
              <button
                type="button"
                className="cq-btn cq-btn-primary cq-btn-footer"
                data-action="navigate-next"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateQuizzStep1