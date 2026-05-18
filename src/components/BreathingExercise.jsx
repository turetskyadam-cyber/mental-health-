import { useState, useEffect, useRef, useCallback } from 'react'
import { BREATHING_MODES } from '../constants/content'
import RippleButton from './ui/RippleButton'

export default function BreathingExercise() {
  const [mode, setMode] = useState('down')
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(5)
  const [scale, setScale] = useState(1)
  const [phaseText, setPhaseText] = useState('Ready?')
  const [subText, setSubText] = useState('Press start when you are')
  const [done, setDone] = useState(false)
  const [switching, setSwitching] = useState(false)

  const timerRef = useRef(null)
  const currentMode = BREATHING_MODES[mode]
  const phases = currentMode.phases

  useEffect(() => {
    const onSetMode = (e) => {
      if (!isActive) {
        setMode(e.detail)
        setPhaseText('Ready?')
        setSubText('Press start when you are')
        setScale(1)
        setRound(0)
        setDone(false)
      }
    }
    window.addEventListener('set-breathe-mode', onSetMode)
    return () => window.removeEventListener('set-breathe-mode', onSetMode)
  }, [isActive])

  const stopSession = useCallback(() => {
    clearTimeout(timerRef.current)
    setIsActive(false)
    setPhaseIndex(0)
    setScale(1)
    setPhaseText('Session paused')
    setSubText('Press start to begin again')
  }, [])

  const runPhase = useCallback(
    (pIdx, roundNum, modeSnap) => {
      const modePhases = BREATHING_MODES[modeSnap].phases
      const currentPhase = modePhases[pIdx]

      setPhaseText(currentPhase.name)
      setSubText(`${currentPhase.duration / 1000}s`)
      setScale(currentPhase.targetScale)
      setPhaseIndex(pIdx)

      timerRef.current = setTimeout(() => {
        const nextIdx = (pIdx + 1) % modePhases.length
        const completedRound = nextIdx === 0

        if (completedRound) {
          const newRound = roundNum + 1
          if (newRound >= 5) {
            setDone(true)
            setIsActive(false)
            setScale(1)
            setPhaseText('Done! 💚')
            setSubText("Your nervous system thanks you")
            setRound(newRound)
            return
          }
          setRound(newRound)
          runPhase(nextIdx, newRound, modeSnap)
        } else {
          runPhase(nextIdx, roundNum, modeSnap)
        }
      }, currentPhase.duration)
    },
    []
  )

  const start = () => {
    clearTimeout(timerRef.current)
    setDone(false)
    setRound(0)
    setIsActive(true)
    runPhase(0, 0, mode)
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const switchMode = (newMode) => {
    if (isActive) {
      clearTimeout(timerRef.current)
      setIsActive(false)
      setSwitching(true)
      setScale(1)
      setPhaseText('Switching…')
      setSubText('')
      setTimeout(() => {
        setMode(newMode)
        setSwitching(false)
        setPhaseText('Ready?')
        setSubText('Press start when you are')
        setRound(0)
        setDone(false)
      }, 500)
    } else {
      setMode(newMode)
      setPhaseText('Ready?')
      setSubText('Press start when you are')
      setRound(0)
      setDone(false)
    }
  }

  const color = currentMode.color

  return (
    <section id="breathe" className="py-20 px-6 overflow-hidden" style={{ background: `linear-gradient(160deg, ${color}22 0%, ${color}08 100%)` }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 section-hidden">
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            Breathe With Me
          </h2>
          <p className="text-gray-400 text-lg">Follow the circle. Let your breath lead.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-3 justify-center mb-10">
          {Object.values(BREATHING_MODES).map((m) => (
            <button
              key={m.id}
              disabled={switching}
              onClick={() => switchMode(m.id)}
              className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-250 border-2"
              style={{
                background: mode === m.id ? `linear-gradient(135deg, ${m.color}CC, ${m.color}88)` : 'white',
                borderColor: mode === m.id ? m.color : '#E5E7EB',
                color: mode === m.id ? 'white' : '#6B7280',
                transform: mode === m.id ? 'scale(1.04)' : 'scale(1)',
                boxShadow: mode === m.id ? `0 4px 14px ${m.color}44` : 'none',
              }}
            >
              <div>{m.name}</div>
              <div className="text-xs opacity-80 font-medium">{m.description}</div>
            </button>
          ))}
        </div>

        {/* Breathing circle */}
        <div className="flex items-center justify-center mb-10">
          <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

            {/* Outer glow ring */}
            <div
              className="absolute rounded-full breathing-ring"
              style={{
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle, ${color}18, transparent 70%)`,
                transform: `scale(${0.8 + scale * 0.25})`,
                '--breath-dur': `${isActive && !done ? phases[phaseIndex]?.duration || 4000 : 600}ms`,
                opacity: isActive ? 0.6 : 0.3,
              }}
            />

            {/* Mid ring */}
            <div
              className="absolute rounded-full breathing-ring border-2"
              style={{
                width: '85%',
                height: '85%',
                borderColor: `${color}44`,
                transform: `scale(${0.9 + scale * 0.12})`,
                '--breath-dur': `${isActive && !done ? phases[phaseIndex]?.duration || 4000 : 600}ms`,
              }}
            />

            {/* Core circle */}
            <div
              className="absolute rounded-full flex flex-col items-center justify-center text-white breathing-ring shadow-2xl"
              style={{
                width: '60%',
                height: '60%',
                background: `linear-gradient(135deg, ${color}, ${color}BB)`,
                transform: `scale(${scale})`,
                '--breath-dur': `${isActive && !done ? phases[phaseIndex]?.duration || 4000 : 500}ms`,
                boxShadow: `0 0 40px ${color}44`,
              }}
            >
              <span
                key={phaseText}
                className="font-display font-black text-sm text-center px-2 leading-tight"
                style={{ animation: 'fadeSlideUp 0.3s ease-out both' }}
              >
                {phaseText}
              </span>
              {subText && (
                <span
                  key={subText}
                  className="text-xs opacity-80 mt-0.5"
                  style={{ animation: 'fadeSlideUp 0.3s 0.05s ease-out both' }}
                >
                  {subText}
                </span>
              )}
            </div>

            {/* Done checkmark */}
            {done && (
              <div
                className="absolute"
                style={{ animation: 'expandIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60" className="absolute -top-8 -right-8">
                  <circle cx="30" cy="30" r="28" fill="#FFE66D" />
                  <polyline
                    points="18,32 26,40 44,22"
                    fill="none"
                    stroke="#0D4A40"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                    style={{ animation: 'checkDraw 0.4s 0.3s ease-out forwards', strokeDashoffset: 60 }}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Round counter */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i < round ? 20 : 10,
                  height: 10,
                  background: i < round
                    ? `linear-gradient(90deg, ${color}, ${color}AA)`
                    : '#E5E7EB',
                }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 font-medium">
            {done ? '5 rounds complete! 🌟' : `Round ${Math.min(round + 1, 5)} of 5`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive && !done && (
            <RippleButton
              onClick={start}
              className="px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}BB)`,
                boxShadow: `0 6px 20px ${color}44`,
              }}
            >
              {round > 0 ? 'Resume' : 'Start Session'}
            </RippleButton>
          )}
          {isActive && (
            <RippleButton
              onClick={stopSession}
              className="px-8 py-3.5 rounded-2xl font-bold text-base border-2"
              style={{
                borderColor: color,
                color: color,
                background: 'white',
              }}
            >
              Pause
            </RippleButton>
          )}
          {done && (
            <RippleButton
              onClick={start}
              className="px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}BB)`,
              }}
            >
              Go Again 🌟
            </RippleButton>
          )}
        </div>
      </div>
    </section>
  )
}
