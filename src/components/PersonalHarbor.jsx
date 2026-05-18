import { useState, useEffect } from 'react'
import { HARBOR_PLACEHOLDERS } from '../constants/content'

export default function PersonalHarbor() {
  const [whispers, setWhispers] = useState('')
  const [anchor1, setAnchor1] = useState('')
  const [anchor2, setAnchor2] = useState('')
  const [erasing, setErasing] = useState(false)
  const [erased, setErased] = useState(false)
  const [placeholder, setPlaceholder] = useState(HARBOR_PLACEHOLDERS[0])
  const [phIdx, setPhIdx] = useState(0)
  const [phOpacity, setPhOpacity] = useState(1)

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

  const hasContent = whispers || anchor1 || anchor2

  const handleErase = () => {
    if (!hasContent) return
    setErasing(true)
    setTimeout(() => {
      setWhispers('')
      setAnchor1('')
      setAnchor2('')
      setErasing(false)
      setErased(true)
      setTimeout(() => setErased(false), 2000)
    }, 700)
  }

  return (
    <section id="harbor" className="py-20 px-6 bg-[#FDF8F0]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 section-hidden">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4ECDC4]/15 text-[#0D4A40] text-sm font-semibold mb-3">
            My Personal Harbor
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            Self-Sourced Insights
          </h2>
          <p className="text-gray-400 text-lg">
            Write it down. Let it go. Like an Etch-a-Sketch.
          </p>
        </div>

        <div
          className="grid md:grid-cols-2 gap-6"
          style={{
            opacity: erasing ? 0 : 1,
            transform: erasing ? 'scale(0.97)' : 'scale(1)',
            filter: erasing ? 'blur(2px)' : 'none',
            transition: 'opacity 600ms ease, transform 600ms ease, filter 600ms ease',
          }}
        >
          {/* Card 1 — Whispers */}
          <div className="bg-white rounded-3xl border-2 p-6 transition-all duration-200 interactive-lift"
            style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌊</span>
              <h3 className="font-display font-black text-lg text-gray-800">
                My Body&apos;s Early Warning Whispers…
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 font-medium">to catch the slide out early</p>
            <textarea
              value={whispers}
              onChange={(e) => setWhispers(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border-0 bg-gray-50 p-4 text-gray-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/40 transition-all duration-200"
              placeholder={placeholder}
              style={{ caretColor: '#4ECDC4', opacity: phOpacity, transition: 'opacity 350ms' }}
            />
          </div>

          {/* Card 2 — Anchors */}
          <div className="bg-white rounded-3xl border-2 p-6 transition-all duration-200 interactive-lift"
            style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚓</span>
              <h3 className="font-display font-black text-lg text-gray-800">
                My Non-Negotiable Anchors
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-medium">the top 2 practices I rely on</p>

            {[
              { value: anchor1, setValue: setAnchor1, placeholder: 'My first anchor practice…' },
              { value: anchor2, setValue: setAnchor2, placeholder: 'My second anchor practice…' },
            ].map((anchor, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Anchor {i + 1}
                </label>
                <input
                  type="text"
                  value={anchor.value}
                  onChange={(e) => anchor.setValue(e.target.value)}
                  placeholder={anchor.placeholder}
                  className="w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/40 transition-all duration-200"
                  style={{ caretColor: '#4ECDC4' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Erase button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleErase}
            disabled={!hasContent || erasing}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-250 interactive"
            style={{
              background: erased ? 'linear-gradient(135deg, #4ECDC422, #88D8B022)' : hasContent ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)' : '#E5E7EB',
              color: erased ? '#0D4A40' : hasContent ? 'white' : '#9CA3AF',
              cursor: hasContent && !erasing ? 'pointer' : 'default',
            }}
          >
            {erased ? '✓ Cleared' : erasing ? 'Erasing…' : '🎨 Shake & Erase'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Nothing is saved. Write freely, then let it go.
        </p>
      </div>
    </section>
  )
}
