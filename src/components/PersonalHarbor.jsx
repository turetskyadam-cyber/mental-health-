import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { HARBOR_PLACEHOLDERS } from '../constants/content'
import Toast from './ui/Toast'

function SparkleIcon({ filled }) {
  return (
    <span
      className="text-xl transition-all duration-400"
      style={{
        filter: filled ? 'none' : 'grayscale(1)',
        transform: filled ? 'scale(1.15)' : 'scale(1)',
        animation: filled ? 'starGlow 0.5s ease-out' : undefined,
      }}
    >
      ✨
    </span>
  )
}

export default function PersonalHarbor() {
  const [whispers, setWhispers] = useLocalStorage('ww_whispers', '')
  const [anchor1, setAnchor1] = useLocalStorage('ww_anchor1', '')
  const [anchor2, setAnchor2] = useLocalStorage('ww_anchor2', '')
  const [showToast, setShowToast] = useState(false)
  const [toastCount, setToastCount] = useState(0)
  const [focused, setFocused] = useState(null)
  const [placeholder, setPlaceholder] = useState(HARBOR_PLACEHOLDERS[0])
  const [phIdx, setPhIdx] = useState(0)
  const [phOpacity, setPhOpacity] = useState(1)

  const saveDebounce = useCallback(
    (() => {
      let t
      return () => {
        clearTimeout(t)
        t = setTimeout(() => {
          setToastCount((c) => c + 1)
          setShowToast(true)
        }, 800)
      }
    })(),
    []
  )

  const handleWhispers = (v) => {
    setWhispers(v)
    saveDebounce()
  }
  const handleAnchor1 = (v) => {
    setAnchor1(v)
    saveDebounce()
  }
  const handleAnchor2 = (v) => {
    setAnchor2(v)
    saveDebounce()
  }

  // Cycle placeholder text
  useEffect(() => {
    const cycle = setInterval(() => {
      setPhOpacity(0)
      setTimeout(() => {
        setPhIdx((i) => {
          const next = (i + 1) % HARBOR_PLACEHOLDERS.length
          setPlaceholder(HARBOR_PLACEHOLDERS[next])
          return next
        })
        setPhOpacity(1)
      }, 350)
    }, 3500)
    return () => clearInterval(cycle)
  }, [])

  const [copied, setCopied] = useState(false)
  const copyHarbor = () => {
    const text = [
      '🌊 My Body\'s Early Warning Whispers:',
      whispers || '(empty)',
      '',
      '⚓ My Non-Negotiable Anchors:',
      `1. ${anchor1 || '(empty)'}`,
      `2. ${anchor2 || '(empty)'}`,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const CARD_FOCUS_STYLE = (id) => focused === id
    ? { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(0,0,0,0.10)', borderColor: '#4ECDC4' }
    : {}

  return (
    <section id="harbor" className="py-20 px-6 bg-[#FDF8F0]">
      <Toast message="Saved ✨" show={showToast} duration={1800} onHide={() => setShowToast(false)} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 section-hidden">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4ECDC4]/15 text-[#0D4A40] text-sm font-semibold mb-3">
            My Personal Harbor
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            Self-Sourced Insights
          </h2>
          <p className="text-gray-400 text-lg">
            Know yourself. Anchor yourself. Stays right here on your device.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Card 1 — Whispers */}
          <div
            className="bg-white rounded-3xl border-2 p-6 transition-all duration-200"
            style={{
              borderColor: '#E5E7EB',
              ...CARD_FOCUS_STYLE('whispers'),
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌊</span>
              <h3 className="font-display font-black text-lg text-gray-800">
                My Body&apos;s Early Warning Whispers…
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 font-medium">to catch the slide out early</p>

            {/* Watercolor placeholder bg */}
            {!whispers && (
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden opacity-30"
                style={{
                  background: 'radial-gradient(ellipse at 30% 30%, #4ECDC488, transparent 60%), radial-gradient(ellipse at 70% 70%, #88D8B066, transparent 60%)',
                  transition: 'opacity 400ms',
                }}
              />
            )}

            <div className="relative">
              <textarea
                value={whispers}
                onChange={(e) => handleWhispers(e.target.value)}
                onFocus={() => setFocused('whispers')}
                onBlur={() => setFocused(null)}
                rows={6}
                className="w-full resize-none rounded-2xl border-0 bg-gray-50 p-4 text-gray-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/40 transition-all duration-200"
                placeholder={placeholder}
                style={{
                  caretColor: '#4ECDC4',
                  '::placeholder': { opacity: phOpacity },
                }}
              />
            </div>
          </div>

          {/* Card 2 — Anchors */}
          <div
            className="bg-white rounded-3xl border-2 p-6 transition-all duration-200"
            style={{
              borderColor: '#E5E7EB',
              ...CARD_FOCUS_STYLE('anchors'),
            }}
            onFocus={() => setFocused('anchors')}
            onBlur={() => setFocused(null)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚓</span>
              <h3 className="font-display font-black text-lg text-gray-800">
                My Non-Negotiable Anchors
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-medium">the top 2 practices I rely on</p>

            {[
              { value: anchor1, setValue: handleAnchor1, placeholder: 'My first anchor practice…' },
              { value: anchor2, setValue: handleAnchor2, placeholder: 'My second anchor practice…' },
            ].map((anchor, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Anchor {i + 1}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={anchor.value}
                    onChange={(e) => anchor.setValue(e.target.value)}
                    placeholder={anchor.placeholder}
                    className="w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/40 transition-all duration-200"
                    style={{ caretColor: '#4ECDC4' }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <SparkleIcon filled={anchor.value.length > 0} />
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state illustration */}
            {!anchor1 && !anchor2 && (
              <div className="mt-4 text-center text-xs text-gray-400 italic">
                What practices always bring you back? 🌿
              </div>
            )}
          </div>
        </div>

        {/* Copy button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={copyHarbor}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-250"
            style={{
              borderColor: copied ? '#4ECDC4' : '#E5E7EB',
              background: copied ? 'linear-gradient(135deg, #4ECDC422, #88D8B022)' : 'white',
              color: copied ? '#0D4A40' : '#6B7280',
              transform: copied ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {copied ? (
              <><span>✓</span> Copied to clipboard!</>
            ) : (
              <><span>📋</span> Copy My Harbor</>
            )}
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Stored only on your device. Never sent anywhere.
        </p>
      </div>
    </section>
  )
}
