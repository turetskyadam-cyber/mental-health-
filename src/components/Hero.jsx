import { useEffect, useRef, useState } from 'react'
import RippleButton from './ui/RippleButton'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const parallaxRef = useRef(null)
  const [storedName] = useLocalStorage('ww_name', '')
  const [storedDoctor] = useLocalStorage('ww_doctor', '')

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!parallaxRef.current) return
      const { innerWidth: w, innerHeight: h } = window
      const x = (e.clientX / w - 0.5) * 14
      const y = (e.clientY / h - 0.5) * 10
      parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const scrollToQuiz = () => {
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })
  }

  const ease = 'cubic-bezier(0.23, 1, 0.32, 1)'

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FDF8F0]">

      {/* Static zone background blobs — no morphing */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: 'transform', transition: 'transform 120ms linear' }}
      >
        <div
          className="absolute"
          style={{
            top: '-10%', left: '-5%',
            width: '55%', height: '55%',
            background: 'radial-gradient(ellipse, rgba(255,107,107,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '25%', left: '30%',
            width: '60%', height: '50%',
            background: 'radial-gradient(ellipse, rgba(78,205,196,0.14) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-10%', right: '-5%',
            width: '55%', height: '55%',
            background: 'radial-gradient(ellipse, rgba(168,180,212,0.16) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/50 text-sm font-semibold text-gray-600 mb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 350ms ${ease}, transform 350ms ${ease}`,
          }}
        >
          {storedName ? (
            <span>Hi, <strong>{storedName}</strong> 👋</span>
          ) : (
            <span>Welcome 👋</span>
          )}
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4]" />
          <span>{storedDoctor ? `${storedDoctor}'s Resources` : 'Window of Wellness'}</span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-black mb-6 leading-none"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 350ms 80ms ${ease}, transform 350ms 80ms ${ease}`,
          }}
        >
          <span
            className="gradient-text block"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 20%, #FFE66D 35%, #4ECDC4 55%, #88D8B0 70%, #A8B4D4 85%, #C3A6D4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
          >
            Your Window
          </span>
          <span className="text-gray-800 block">of Wellness</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-gray-500 font-medium mb-10 max-w-lg mx-auto leading-relaxed"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 350ms 160ms ${ease}, transform 350ms 160ms ${ease}`,
          }}
        >
          Your nervous system has moods too —{' '}
          <em className="not-italic text-gray-700 font-semibold">let&apos;s find yours.</em>
        </p>

        {/* CTA */}
        <div
          className="relative inline-block"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 350ms 240ms ${ease}, transform 350ms 240ms ${ease}`,
          }}
        >
          {/* Pulse ring — kept: first-time marketing CTA */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #4ECDC4, #88D8B0)',
              animation: 'pingRing 2s ease-out infinite',
            }}
          />
          <RippleButton
            onClick={scrollToQuiz}
            className="relative px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4ECDC4, #88D8B0)',
              boxShadow: '0 8px 30px rgba(78,205,196,0.4)',
            }}
          >
            Check My State →
          </RippleButton>
        </div>

        {/* Zone mini-preview */}
        <div
          className="flex items-center justify-center gap-4 mt-14"
          style={{
            opacity: loaded ? 1 : 0,
            transition: `opacity 350ms 320ms ${ease}`,
          }}
        >
          {[
            { label: 'Hyperarousal', color: '#FF6B6B' },
            { label: 'Window',       color: '#4ECDC4' },
            { label: 'Hypoarousal', color: '#A8B4D4' },
          ].map((z) => (
            <div key={z.label} className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
              <span>{z.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wave transition at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20">
          <path
            d="M0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 L0,80 Z"
            fill="white"
            opacity="0.8"
          />
        </svg>
      </div>
    </section>
  )
}
