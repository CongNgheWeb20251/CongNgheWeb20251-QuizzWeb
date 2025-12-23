import React from 'react'

export default function Logo({ className = '', alt = 'Quizz logo', width = 32, height = 32 }) {
  return (
    <img
      src="/quiz-dev-icon.png"
      alt={alt}
      width={width}
      height={height}
      className={`rounded-md object-contain ${className}`}
    />
  )
}
