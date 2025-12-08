import React from 'react'

/**
 * BeautifulLoader
 * - Single-file Tailwind-based loading component for light backgrounds
 * - Props: size ('sm'|'md'|'lg'), variant ('spinner'|'skeleton'|'progress'),
 *   message, fullScreen, progress (0-100), skeletonCount, className
 *
 * Usage:
 * <BeautifulLoader />
 * <BeautifulLoader variant="skeleton" skeletonCount={4} />
 * <BeautifulLoader variant="progress" progress={45} message="Uploading..." />
 */
const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-16 h-16 border-4'
}

export default function PageLoader({
  size = 'md',
  variant = 'spinner',
  message = 'Loading',
  fullScreen = false,
  progress = null,
  skeletonCount = 3,
  className = ''
}) {
  const spinnerClass = `${sizeClasses[size] || sizeClasses.md} rounded-full border-gray-200 border-t-green-500 animate-spin`

  const containerBase = 'rounded-lg shadow-lg bg-white text-gray-800 flex items-center gap-4 p-4'
  const wrapper = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50/80 z-50 p-4'
    : 'inline-block'

  return (
    <div className={wrapper} aria-busy="true" aria-live="polite">
      <div className={`${containerBase} ${className}`}>
        {variant === 'spinner' && (
          <>
            <div className={spinnerClass} role="status" aria-hidden="true" />
            <div className="flex flex-col">
              <div className="font-medium text-sm sm:text-base">{message}<span className="sr-only"> loading</span></div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <span className="inline-block w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <span className="inline-block w-1 h-1 bg-green-400 rounded-full animate-pulse delay-75" />
                <span className="inline-block w-1 h-1 bg-green-400 rounded-full animate-pulse delay-150" />
                <span className="ml-2">Please wait</span>
              </div>
            </div>
          </>
        )}

        {variant === 'skeleton' && (
          <div className="w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-gray-100 shrink-0 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded animate-pulse w-full" />
              ))}
            </div>
          </div>
        )}

        {variant === 'progress' && (
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{message}</div>
              <div className="text-xs text-gray-500">{progress ?? 0}%</div>
            </div>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${Math.max(0, Math.min(100, progress ?? 0))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
