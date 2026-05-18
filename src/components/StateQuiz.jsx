import { useState, useRef, useEffect } from 'react'
import { QUIZ_QUESTIONS, ZONES } from '../constants/content'
import { useZone } from '../context/ZoneContext'
import RippleButton from './ui/RippleButton'
import Confetti from './ui/Confetti'

export default function StateQuiz() {
  const { setZone } = useZone()
  const [step, setStep] = useState(0)         // 0 = question index, 'result' = show result
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [exiting, setExiting] = useState(false)
  const [confettiTrig, setConfettiTrig] = useState(0)
  const [resultZone, setResultZone] = useState(null)
  const [floodIn, setFloodIn] = useState(false)
  const [floodOut, setFloodOut] = useState(false)
  const containerRef = useRef(null)

  const question = QUIZ_QUESTIONS[step === 'result' ? 0 : step]
  const progress = step === 'result' ? 100 : (step / QUIZ_QUESTIONS.length) * 100

  const calcResult = (allAnswers) => {
    const counts = { hyper: 0, window: 0, hypo: 0 }
    allAnswers.forEach((z) => counts[z]++)
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }

  const handleSelect = (zone) => {
    if (selected !== null) return
    setSelected(zone)

    setTimeout(() => {
      const newAnswers = [...answers, zone]

      if (step < QUIZ_QUESTIONS.length - 1) {
        setExiting(true)
        setTimeout(() => {
          setAnswers(newAnswers)
          setStep((s) => s + 1)
          setSelected(null)
          setExiting(false)
        }, 220)
      } else {
        const winner = calcResult(newAnswers)
        setResultZone(winner)
        setZone(winner)
        setFloodIn(true)
        if (winner === 'window') {
          setTimeout(() => setConfettiTrig((t) => t + 1), 700)
        }
        setTimeout(() => {
          setAnswers(newAnswers)
          setStep('result')
        }, 300)
      }
    }, 320)
  }

  const retake = () => {
    setFloodOut(true)
    setTimeout(() => {
      setStep(0)
      setAnswers([])
      setSelected(null)
      setResultZone(null)
      setFloodIn(false)
      setFloodOut(false)
      setZone(null)
    }, 400)
  }

  // Auto-scroll to wave map 2.5s after result appears
  useEffect(() => {
    if (step !== 'result') return
    const t = setTimeout(() => {
      document.getElementById('wavemap')?.scrollIntoView({ behavior: 'smooth' })
    }, 2500)
    return () => clearTimeout(t)
  }, [step])

  const scrollToWavemap = () => {
    document.getElementById('wavemap')?.scrollIntoView({ behavior: 'smooth' })
  }

  const zone = resultZone ? ZONES[resultZone] : null

  return (
    <section id="quiz" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 section-hidden" ref={containerRef}>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            What&apos;s Your Vibe Right Now?
          </h2>
          <p className="text-gray-400 text-lg">5 questions · takes about 30 seconds</p>
        </div>

        {/* Quiz card */}
        <div className="relative">

          {/* Flood overlay for result */}
          {(floodIn || floodOut) && resultZone && (
            <div
              className="absolute inset-0 z-20 rounded-3xl"
              style={{
                background: `linear-gradient(135deg, ${ZONES[resultZone].fromColor}, ${ZONES[resultZone].toColor})`,
                animation: floodOut
                  ? 'zoneFloodOut 0.4s ease-in forwards'
                  : 'zoneFlood 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
              }}
            />
          )}

          {step === 'result' && zone ? (
            /* ── Result card ── */
            <div
              className="rounded-3xl overflow-hidden shadow-2xl relative"
              style={{
                background: `linear-gradient(135deg, ${zone.fromColor}, ${zone.toColor})`,
              }}
            >
              <Confetti trigger={confettiTrig} />

              <div className="p-10 text-center" style={{ color: zone.textColor }}>
                <div
                  className="text-7xl mb-5"
                  style={{ animation: 'expandIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
                >
                  {zone.emoji}
                </div>

                {/* Clear "this is your zone" label */}
                <div
                  className="inline-block px-4 py-1.5 rounded-full mb-4 font-bold text-xs uppercase tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.30)',
                    animation: 'fadeSlideUp 0.4s 0.28s ease-out both',
                  }}
                >
                  ✦ This is your zone ✦
                </div>

                <h3
                  className="font-display font-black text-4xl md:text-5xl mb-2"
                  style={{ animation: 'fadeSlideUp 0.4s 0.36s ease-out both' }}
                >
                  {zone.name}
                </h3>
                <p
                  className="text-lg font-semibold mb-3 opacity-90"
                  style={{ animation: 'fadeSlideUp 0.4s 0.42s ease-out both' }}
                >
                  {zone.subtitle}
                </p>
                <p
                  className="text-base opacity-80 max-w-sm mx-auto leading-relaxed mb-4"
                  style={{ animation: 'fadeSlideUp 0.4s 0.48s ease-out both' }}
                >
                  {zone.description}
                </p>

                {/* Auto-scroll notice */}
                <p
                  className="text-xs opacity-60 mb-6 font-medium"
                  style={{ animation: 'fadeSlideUp 0.4s 0.54s ease-out both' }}
                >
                  Taking you to your landscape in a moment…
                </p>

                <div
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  style={{ animation: 'fadeSlideUp 0.4s 0.6s ease-out both' }}
                >
                  <RippleButton
                    onClick={scrollToWavemap}
                    className="px-7 py-3.5 rounded-2xl font-bold text-base shadow-lg"
                    style={{
                      background: 'rgba(255,255,255,0.35)',
                      color: zone.textColor,
                      border: '2px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    See Your Landscape →
                  </RippleButton>
                  <button
                    onClick={retake}
                    className="px-5 py-3.5 rounded-2xl font-semibold text-sm opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: zone.textColor }}
                  >
                    Retake quiz
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Question card ── */
            <div
              className="glass border border-white/70 rounded-3xl shadow-xl overflow-hidden"
              style={{
                animation: exiting ? 'slideOutLeft 0.22s ease-in forwards' : undefined,
              }}
            >
              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100">
                <div
                  className="h-full rounded-full zone-transition"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #4ECDC4, #88D8B0)',
                    transition: 'width 400ms cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>

              <div className="p-8 md:p-10">
                {/* Step indicator */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Question {typeof step === 'number' ? step + 1 : QUIZ_QUESTIONS.length} of {QUIZ_QUESTIONS.length}
                </p>

                {/* Question */}
                <h3
                  className="font-display font-bold text-2xl md:text-3xl text-gray-800 mb-8"
                  key={step}
                  style={{ animation: 'slideInRight 0.3s ease-out both' }}
                >
                  {question?.question}
                </h3>

                {/* Options */}
                <div
                  className="grid gap-3"
                  key={`opts${step}`}
                  style={{ animation: 'slideInRight 0.3s 0.05s ease-out both' }}
                >
                  {question?.options.map((opt) => {
                    const isSelected = selected === opt.zone
                    const z = ZONES[opt.zone]
                    return (
                      <button
                        key={opt.zone}
                        onClick={() => handleSelect(opt.zone)}
                        disabled={selected !== null}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left font-semibold text-gray-700 ripple-container"
                        style={{
                          borderColor: isSelected ? z.fromColor : '#E5E7EB',
                          background: isSelected
                            ? `linear-gradient(135deg, ${z.fromColor}22, ${z.toColor}22)`
                            : 'white',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
                          boxShadow: isSelected ? `0 0 0 3px ${z.fromColor}44` : undefined,
                        }}
                      >
                        <span className="text-3xl">{opt.emoji}</span>
                        <span className="text-lg">{opt.text}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
