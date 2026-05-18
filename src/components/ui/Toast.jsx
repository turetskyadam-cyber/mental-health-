import { useEffect, useState } from 'react'

export default function Toast({ message, show, duration = 2000, onHide }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (show) {
      setExiting(false)
      setVisible(true)
      const hideTimer = setTimeout(() => {
        setExiting(true)
        setTimeout(() => {
          setVisible(false)
          onHide?.()
        }, 400)
      }, duration)
      return () => clearTimeout(hideTimer)
    }
  }, [show, duration])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl glass border border-white/60 text-sm font-semibold text-gray-800 flex items-center gap-2"
      style={{
        animation: exiting
          ? 'toastOut 0.4s ease-in-out forwards'
          : 'toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      {message}
    </div>
  )
}
