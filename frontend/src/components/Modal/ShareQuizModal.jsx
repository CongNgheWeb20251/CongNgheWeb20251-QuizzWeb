import React, { useState, useEffect, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react'
import QRCode from 'qrcode'
import {
  X,
  Copy,
  Check,
  Maximize,
  Download,
  QrCode as QrCodeIcon
} from 'lucide-react'
import ExpandedQRModal from './ExpandedQRModal'

// ShareQuizModal: hiển thị modal chia sẻ quiz (link + QR)
// Props: isOpen, onClose, quizTitle, joinUrl


export default function ShareQuizModal({
  isOpen,
  onClose,
  quizTitle,
  joinUrl
}) {
  // Trạng thái & refs
  const [qrCodeUrl, setQrCodeUrl] = useState('') // Data URL QR preview (kích thước nhỏ)
  const [highResQrCodeUrl, setHighResQrCodeUrl] = useState('') // Data URL QR độ phân giải cao (download / phóng to)
  const [isCopied, setIsCopied] = useState(false) // hiển thị trạng thái đã copy
  const [isQrHovered, setIsQrHovered] = useState(false) // hiển thị overlay khi hover QR
  const [isExpandedQrOpen, setIsExpandedQrOpen] = useState(false) // mở modal QR phóng to
  const modalRef = useRef(null) // tham chiếu tới container modal (dùng cho focus trap)
  const copyTimeoutRef = useRef() // lưu ID của timeout để reset isCopied an toàn
  const inputRef = useRef(null) // ref tới input chứa joinUrl (dùng cho fallback copy)

  // Tạo mã QR (hai kích thước: preview + high-res)
  useEffect(() => {
    if (joinUrl) {
      // Kích thước chuẩn cho preview
      QRCode.toDataURL(joinUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      })
        .then((url) => setQrCodeUrl(url))
        .catch(() => {})

      // Kích thước lớn cho view phóng to và download
      QRCode.toDataURL(joinUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      })
        .then((url) => setHighResQrCodeUrl(url))
        .catch(() => {})
    }
  }, [joinUrl])

  // Xử lý phím ESC: đóng modal phóng to trước, nếu không có thì đóng modal chính
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isExpandedQrOpen) {
          setIsExpandedQrOpen(false)
        } else {
          onClose()
        }
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
  }, [isOpen, isExpandedQrOpen, onClose])

  // Focus trap: khóa tab focus trong modal
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
      firstElement?.focus()

      return () => {
        document.removeEventListener('keydown', handleTab)
      }
    }
  }, [isOpen])

  const handleCopyLink = async () => {
    // Copy link: thử Clipboard API hiện đại, nếu thất bại dùng fallback execCommand
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(joinUrl)
      setIsCopied(true)

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false)
      }, 5000)
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // Nếu Clipboard API không thành công (ví dụ do permission), dùng fallback
      try {
        if (inputRef.current) {
          // Chọn toàn bộ text trong input (hỗ trợ mobile bằng setSelectionRange)
          inputRef.current.select()
          inputRef.current.setSelectionRange(0, 99999)

          const successful = document.execCommand('copy') // legacy method

          if (successful) {
            setIsCopied(true)

            if (copyTimeoutRef.current) {
              clearTimeout(copyTimeoutRef.current)
            }

            copyTimeoutRef.current = setTimeout(() => {
              setIsCopied(false)
            }, 5000)
          } else {
            // Nếu execCommand thất bại, giữ selection để user copy thủ công
          }

          // Bỏ chọn sau một lúc để tránh highlight còn tồn tại
          setTimeout(() => {
            window.getSelection()?.removeAllRanges()
          }, 100)
        }
      } catch {
        // Nếu fallback cũng thất bại, không làm gì thêm; người dùng sẽ copy thủ công
      }
    }
  }

  const handleDownloadQR = () => {
    // Tải ảnh QR base64 (Data URL) xuống máy client mà không cần server
    const link = document.createElement('a')
    link.download = `${quizTitle.replace(/\s+/g, '_')}_QR.png`
    link.href = highResQrCodeUrl
    link.click()
  }

  const handleBackdropClick = (e) => {
    // Click vào backdrop (vùng ngoài modal) sẽ đóng modal
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tiêu đề */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2
                      id="modal-title"
                      className="text-2xl text-gray-900 mb-1"
                    >
                      Share this Quiz
                    </h2>
                    <p
                      id="modal-description"
                      className="text-sm text-gray-600"
                    >
                      Invite students using the link or QR code below.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Nội dung chính */}
              <div className="px-6 py-6 space-y-6 flex-1 overflow-y-auto">
                {/* Tiêu đề Quiz */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Quiz Title</p>
                  <p className="text-lg text-gray-900">{quizTitle}</p>
                </div>

                {/* Phần chia sẻ link */}
                <div>
                  <label
                    htmlFor="join-link"
                    className="block text-sm text-gray-700 mb-2"
                  >
                    Join Link
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        id="join-link"
                        type="text"
                        value={joinUrl}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Quiz join URL"
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-3 bg-[#1e90ff] text-white rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Copy link to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copy Link</span>
                          </>
                        )}
                      </button>

                      {/* Tooltip (hiện khi vừa copy) */}
                      <AnimatePresence>
                        {isCopied && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: -5 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap pointer-events-none"
                          >
                            Copied to clipboard!
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Phần QR Code */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-700">
                      QR Code
                    </label>
                    <button
                      onClick={handleDownloadQR}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                      aria-label="Download QR code"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center border border-gray-200">
                    <div
                      className="relative cursor-pointer group"
                      onMouseEnter={() => setIsQrHovered(true)}
                      onMouseLeave={() => setIsQrHovered(false)}
                      onClick={() => setIsExpandedQrOpen(true)}
                      role="button"
                      tabIndex={0}
                      aria-label="Click to view enlarged QR code"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setIsExpandedQrOpen(true)
                        }
                      }}
                    >
                      {qrCodeUrl ? (
                        <>
                          <div className="bg-white p-4 rounded-xl shadow-md w-64 h-64 flex items-center justify-center">
                            <img
                              src={qrCodeUrl}
                              alt="QR Code for quiz join link"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Overlay khi hover QR (icon phóng to) */}
                          <AnimatePresence>
                            {isQrHovered && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-sm"
                              >
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-white/90 p-3 rounded-full shadow-lg"
                                >
                                  <Maximize className="w-8 h-8 text-gray-900" />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <div className="bg-white p-4 rounded-xl shadow-md w-64 h-64 flex items-center justify-center">
                          <div className="animate-pulse">
                            <QrCodeIcon className="w-16 h-16 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-4 text-center">
                      Students can scan this code to join the quiz
                    </p>
                  </div>
                </div>

                {/* Hướng dẫn ngắn */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <QrCodeIcon className="w-4 h-4" />
                    How to share
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Copy and share the link via email or messaging apps</li>
                    <li>Display the QR code for students to scan</li>
                    <li>Download the QR code to print or include in materials</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal phóng to QR */}
      <ExpandedQRModal
        isOpen={isExpandedQrOpen}
        onClose={() => setIsExpandedQrOpen(false)}
        qrCodeUrl={highResQrCodeUrl}
        quizTitle={quizTitle}
        onDownload={handleDownloadQR}
      />
    </>
  )
}
