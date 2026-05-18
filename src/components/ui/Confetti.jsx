import { useEffect, useState } from 'react'

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#88D8B0', '#C3A6D4', '#FF8E53', '#FDCB6E']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export default function Confetti({ trigger, count = 22 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!trigger) return
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: randomBetween(-160, 160),
      y: randomBetween(-200, -320),
      rot: randomBetween(-540, 540),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(8, 16),
      delay: randomBetween(0, 200),
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }))
    setParticles(newParticles)
    const t = setTimeout(() => setParticles([]), 1400)
    return () => clearTimeout(t)
  }, [trigger])

  if (!particles.length) return null

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 0.5,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            backgroundColor: p.color,
            '--conf-x': `${p.x}px`,
            '--conf-y': `${p.y}px`,
            '--conf-rot': `${p.rot}deg`,
            animation: `confettiFly 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}
