import React, { useEffect, useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import {
  X,
  Download,
  QrCode as QrCodeIcon
} from 'lucide-react'


const ExpandedQRModal = ({
  isOpen,
  onClose,
  qrCodeUrl,
  quizTitle,
  onDownload
}) => {
  // Modal độc lập để hiển thị QR lớn và cho phép tải về
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const closeButton = modalRef.current.querySelector('button')
      closeButton?.focus()
    }
  }, [isOpen])

  const handleBackdropClick = (e) => {
    // Click vào backdrop để đóng modal phóng to
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby="expanded-qr-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tiêu đề (phía trên ảnh, gồm Download + Close) */}
            <div className="flex items-center justify-end sm:justify-between text-white mb-4">
              <h3 id="expanded-qr-title" className="text-xl hidden sm:block">
                QR Code - {quizTitle}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={onDownload}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                  aria-label="Download QR code"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close expanded view"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ảnh QR (phóng to) */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
              {qrCodeUrl ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={qrCodeUrl}
                  alt="Enlarged QR Code for quiz join link"
                  className="w-full h-full max-w-md max-h-md object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="animate-pulse">
                    <QrCodeIcon className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
              )}
              <p className="text-gray-600 mt-6 text-center">
                Scan this QR code to join the quiz
              </p>
            </div>

            {/* Gợi ý đóng */}
            <div className="mt-4 text-center">
              <p className="text-white/80 text-sm">
                Press ESC or click outside to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpandedQRModal