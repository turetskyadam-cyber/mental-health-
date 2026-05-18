import { useState, useEffect } from 'react'
import { useZone } from '../context/ZoneContext'

const NAV_LINKS = [
  { label: 'Vibe Check', href: '#quiz' },
  { label: 'Wave Map', href: '#wavemap' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Breathe', href: '#breathe' },
  { label: 'Card Game', href: '#cardsort' },
  { label: 'Tracker', href: '#tracker' },
  { label: 'Harbor', href: '#harbor' },
]

const ZONE_DOT = {
  hyper:  'bg-[#FF6B6B]',
  window: 'bg-[#4ECDC4]',
  hypo:   'bg-[#A8B4D4]',
}

export default function Nav() {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { zone } = useZone()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="glass border-b border-white/40 px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full zone-transition ${zone ? ZONE_DOT[zone] : 'bg-[#4ECDC4]'}`}
            />
            <span className="font-display font-bold text-sm text-gray-800">
              Window of Wellness
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-150"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/40 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-gray-700 mb-1 transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-gray-700 mb-1 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 glass border-l border-white/40 flex flex-col pt-16 pb-8 px-6 transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/40"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="py-3 text-left font-semibold text-gray-700 border-b border-gray-100 hover:text-gray-900 transition-colors"
          >
            {link.label}
          </button>
        ))}
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
