import { useEffect, useRef, useState } from 'react'
import RippleButton from './ui/RippleButton'

const PARTICLES = [
  { emoji: '🌊', delay: '0s',   dur: '7s',  left: '8%',  driftX: '20px'  },
  { emoji: '✨', delay: '1.2s', dur: '6s',  left: '22%', driftX: '-15px' },
  { emoji: '🌿', delay: '0.5s', dur: '8s',  left: '42%', driftX: '30px'  },
  { emoji: '💛', delay: '2s',   dur: '5.5s',left: '62%', driftX: '-20px' },
  { emoji: '✨', delay: '0.8s', dur: '9s',  left: '78%', driftX: '10px'  },
  { emoji: '🌊', delay: '3s',   dur: '7s',  left: '88%', driftX: '-25px' },
  { emoji: '🌿', delay: '1.5s', dur: '6.5s',left: '15%', driftX: '15px'  },
  { emoji: '💫', delay: '2.5s', dur: '8.5s',left: '55%', driftX: '-10px' },
]

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  const parallaxRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!parallaxRef.current) return
      const { innerWidth: w, innerHeight: h } = window
      const x = (e.clientX / w - 0.5) * 18
      const y = (e.clientY / h - 0.5) * 12
      parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const scrollToQuiz = () => {
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FDF8F0]">

      {/* Zone background blobs */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 pointer-events-none transition-transform duration-100"
        style={{ willChange: 'transform' }}
      >
        {/* Hyper zone blob */}
        <div
          className="absolute animate-morphBlob"
          style={{
            top: '-10%', left: '-5%',
            width: '55%', height: '55%',
            background: 'radial-gradient(ellipse, rgba(255,107,107,0.22) 0%, transparent 70%)',
          }}
        />
        {/* Window zone blob */}
        <div
          className="absolute animate-morphBlob"
          style={{
            top: '25%', left: '30%',
            width: '60%', height: '50%',
            background: 'radial-gradient(ellipse, rgba(78,205,196,0.18) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
        />
        {/* Hypo zone blob */}
        <div
          className="absolute animate-morphBlob"
          style={{
            bottom: '-10%', right: '-5%',
            width: '55%', height: '55%',
            background: 'radial-gradient(ellipse, rgba(168,180,212,0.20) 0%, transparent 70%)',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Floating emoji particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="ambient-particle absolute bottom-0 text-2xl select-none pointer-events-none"
          style={{
            left: p.left,
            '--drift-x': p.driftX,
            '--drift-start': '0px',
            animation: `particleDrift ${p.dur} ${p.delay} ease-in infinite`,
            fontSize: i % 3 === 0 ? '1.8rem' : '1.3rem',
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/50 text-sm font-semibold text-gray-600 mb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          }}
        >
          <span>Dr. Santiago&apos;s Clinical Resources</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4]" />
          <span>Interactive Edition</span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-black mb-6 leading-none"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.55s 0.15s ease-out, transform 0.55s 0.15s ease-out',
          }}
        >
          <span
            className="gradient-text animate-shimmer block"
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
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s 0.3s ease-out, transform 0.5s 0.3s ease-out',
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
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s 0.45s ease-out, transform 0.5s 0.45s ease-out',
          }}
        >
          {/* Pulse ring */}
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
            transition: 'opacity 0.6s 0.6s ease-out',
          }}
        >
          {[
            { label: 'Hyperarousal', color: '#FF6B6B', emoji: '🔥' },
            { label: 'Window',       color: '#4ECDC4', emoji: '🌊' },
            { label: 'Hypoarousal', color: '#A8B4D4', emoji: '💤' },
          ].map((z) => (
            <div key={z.label} className="flex items-center gap-1.5 text-sm text-gray-500">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: z.color }}
              />
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
