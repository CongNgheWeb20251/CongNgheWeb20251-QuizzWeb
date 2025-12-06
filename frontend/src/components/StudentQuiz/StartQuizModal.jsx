import React, { useEffect, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  Clock,
  FileQuestion,
  BarChart3,
  Play,
  RotateCcw,
  AlertCircle
} from 'lucide-react'

export default function StartQuizModal({
  isOpen,
  onClose,
  onStart,
  quiz,
  isRetake = false
}) {
  const modalRef = useRef(null)

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleTab = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus()
              e.preventDefault()
            }
          } else if (document.activeElement === lastElement) {
            firstElement?.focus()
            e.preventDefault()
          }
        }
      }

      document.addEventListener('keydown', handleTab)

      // Focus the primary action button on open
      const primaryButton = modalRef.current.querySelector('[data-primary]')
      primaryButton?.focus()

      return () => {
        document.removeEventListener('keydown', handleTab)
      }
    }
  }, [isOpen])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getDifficultyColor = (level) => {
    switch (level) {
    case 'easy':
      return 'text-emerald-700 bg-emerald-100'
    case 'medium':
      return 'text-amber-700 bg-amber-100'
    case 'hard':
      return 'text-rose-700 bg-rose-100'
    default:
      return 'text-blue-700 bg-blue-100'
    }
  }

  const getDifficultyLabel = (level) => {
    if (!level) return null
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gradient-to-br from-blue-50/40 via-white/40 to-purple-50/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby="quiz-modal-title"
          aria-describedby="quiz-modal-description"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2
                    id="quiz-modal-title"
                    className="text-2xl text-gray-900 leading-tight"
                  >
                    {quiz?.title || 'Start Quiz'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Description */}
              <p
                id="quiz-modal-description"
                className="text-gray-700 mb-6 leading-relaxed"
              >
                {quiz?.description || 'You are about to start this quiz. Make sure you are ready before proceeding.'}
              </p>

              {/* Metadata Row */}
              <div className="flex flex-wrap gap-4 lg:gap-6 mb-6">
                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time limit</p>
                    <p className="text-gray-900">{quiz?.timeLimit} minutes</p>
                  </div>
                </div>

                {/* Question Count */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileQuestion className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="text-gray-900">{quiz?.questionOrderIds?.length} questions</p>
                  </div>
                </div>

                {/* level or Attempt Number */}
                {quiz.level && !isRetake && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className={`p-2 rounded-lg ${getDifficultyColor(quiz.level)}`}>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">level</p>
                      <p className="text-gray-900">{getDifficultyLabel(quiz.level)}</p>
                    </div>
                  </div>
                )}

                {quiz?.attemptNumber && isRetake && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <RotateCcw className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Attempt</p>
                      <p className="text-gray-900">#{quiz?.attemptNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Cancel and close modal"
                >
                  Cancel
                </button>
                <button
                  onClick={onStart}
                  data-primary
                  className="px-5 py-2.5 cursor-pointer bg-[#17c0eb] text-white rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={isRetake ? 'Start quiz retake' : 'Start quiz'}
                >
                  {isRetake ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Quiz</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
