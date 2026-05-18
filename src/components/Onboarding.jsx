import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ONBOARDING_SLIDES } from '../constants/content'
import RippleButton from './ui/RippleButton'

export default function Onboarding() {
  const [visited, setVisited] = useLocalStorage('ww_visited', false)
  const [slide, setSlide] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!visited) {
      const t = setTimeout(() => setShow(true), 600)
      return () => clearTimeout(t)
    }
  }, [visited])

  if (visited || !show) return null

  const current = ONBOARDING_SLIDES[slide]
  const isLast = slide === ONBOARDING_SLIDES.length - 1

  const dismiss = () => {
    setExiting(true)
    setTimeout(() => {
      setVisited(true)
      setShow(false)
    }, 500)
  }

  const next = () => {
    if (isLast) {
      dismiss()
    } else {
      setSlide((s) => s + 1)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{
        background: 'rgba(253, 248, 240, 0.85)',
        backdropFilter: 'blur(20px)',
        animation: exiting
          ? 'zoneFloodOut 0.5s ease-in forwards'
          : 'zoneFlood 0.5s ease-out forwards',
      }}
    >
      <div
        className="glass border border-white/60 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl"
        style={{ animation: 'expandIn 0.5s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
      >
        {/* Emoji */}
        <div
          className="text-6xl mb-4"
          key={slide}
          style={{ animation: 'expandIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
        >
          {current.emoji}
        </div>

        {/* Title */}
        <h2
          className="font-display font-black text-2xl text-gray-800 mb-3"
          key={`t${slide}`}
          style={{ animation: 'fadeSlideUp 0.35s 0.05s ease-out both' }}
        >
          {current.title}
        </h2>

        {/* Text */}
        <p
          className="text-gray-500 leading-relaxed mb-8"
          key={`p${slide}`}
          style={{ animation: 'fadeSlideUp 0.35s 0.1s ease-out both' }}
        >
          {current.text}
        </p>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                background: i === slide
                  ? 'linear-gradient(90deg, #4ECDC4, #88D8B0)'
                  : '#E5E7EB',
              }}
            />
          ))}
        </div>

        {/* Button */}
        <RippleButton
          onClick={next}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md"
          style={{
            background: 'linear-gradient(135deg, #4ECDC4, #88D8B0)',
          }}
        >
          {isLast ? "Let's go! 🚀" : 'Next →'}
        </RippleButton>

        {/* Skip */}
        <button
          onClick={dismiss}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip intro
        </button>
      </div>
    </div>
  )
}
