import { useState, useRef, useCallback } from 'react'
import { CARD_SORT_ITEMS, WIDENERS, CONSTRICTORS } from '../constants/content'
import RippleButton from './ui/RippleButton'
import Confetti from './ui/Confetti'

const shuffled = [...CARD_SORT_ITEMS].sort(() => Math.random() - 0.5)

export default function CardSortGame() {
  const [items] = useState(shuffled)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)  // 'correct' | 'wrong'
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [flyDir, setFlyDir] = useState(null)       // 'left' | 'right'
  const [confettiTrig, setConfettiTrig] = useState(0)
  const [showRef, setShowRef] = useState(false)
  const [shaking, setShaking] = useState(false)

  const dragStart = useRef(null)
  const cardRef = useRef(null)
  const done = index >= items.length

  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX)
  const getClientY = (e) => (e.touches ? e.touches[0].clientY : e.clientY)

  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    dragStart.current = { x: getClientX(e), y: getClientY(e) }
    setIsDragging(true)
    setFlyDir(null)

    const onMove = (ev) => {
      if (!dragStart.current) return
      const dx = getClientX(ev) - dragStart.current.x
      const dy = getClientY(ev) - dragStart.current.y
      setOffset({ x: dx, y: dy })
    }

    const onEnd = (ev) => {
      if (!dragStart.current) return
      const finalDx = getClientX(ev) - dragStart.current.x
      dragStart.current = null
      setIsDragging(false)

      if (Math.abs(finalDx) >= 80) {
        resolveSwipe(finalDx > 0 ? 'right' : 'left', finalDx)
      } else {
        setOffset({ x: 0, y: 0 })
      }

      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }, [index, items])

  const resolveSwipe = (dir, dx) => {
    const card = items[index]
    const guessedExpand = dir === 'right'
    const correct = (guessedExpand && card.correct === 'expand') ||
                    (!guessedExpand && card.correct === 'constrict')

    if (correct) {
      setFeedback('correct')
      setScore((s) => s + 1)
    } else {
      setFeedback('wrong')
    }

    if (correct) {
      setFlyDir(dir)
      setOffset({ x: dir === 'right' ? 600 : -600, y: 0 })
      setTimeout(() => {
        setIndex((i) => i + 1)
        setOffset({ x: 0, y: 0 })
        setFeedback(null)
        setFlyDir(null)
        if (index === items.length - 1) {
          // last card
          setTimeout(() => setConfettiTrig((t) => t + 1), 200)
        }
      }, 350)
    } else {
      setShaking(true)
      setOffset({ x: 0, y: 0 })
      setTimeout(() => {
        setShaking(false)
        setFeedback(null)
      }, 500)
    }
  }

  const handleKeyDown = (e) => {
    if (done) return
    if (e.key === 'ArrowRight') resolveSwipe('right', 100)
    if (e.key === 'ArrowLeft')  resolveSwipe('left', -100)
  }

  const reset = () => {
    setIndex(0)
    setScore(0)
    setFeedback(null)
    setOffset({ x: 0, y: 0 })
    setFlyDir(null)
    setShowRef(false)
    setConfettiTrig(0)
  }

  const card = items[index]
  const rotation = offset.x / 20

  const swipeIndicatorOpacity = Math.min(Math.abs(offset.x) / 80, 1)
  const swipeRight = offset.x > 20
  const swipeLeft = offset.x < -20

  return (
    <section id="cardsort" className="py-20 px-6 bg-[#FDF8F0]">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10 section-hidden">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4ECDC4]/15 text-[#0D4A40] text-sm font-semibold mb-3">
            Widen Your Window
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            Expand or Constrict?
          </h2>
          <p className="text-gray-400 text-base max-w-xs mx-auto">
            Swipe <span className="font-bold text-[#4ECDC4]">right</span> if it expands your window,{' '}
            <span className="font-bold text-[#FF6B6B]">left</span> if it constricts it.
          </p>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {items.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i < index ? 18 : 8,
                  height: 8,
                  background: i < index
                    ? items[i] && score > 0 ? '#4ECDC4' : '#FF6B6B'
                    : '#E5E7EB',
                }}
              />
            ))}
          </div>
          <div className="font-bold text-gray-600 text-sm">
            {score}/{items.length} correct
          </div>
        </div>

        {done ? (
          /* ── Completion ── */
          <div className="relative text-center py-10">
            <Confetti trigger={confettiTrig} count={30} />
            <div className="text-6xl mb-4" style={{ animation: 'expandIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              {score >= 9 ? '🏆' : score >= 6 ? '⭐' : '🌱'}
            </div>
            <h3 className="font-display font-black text-3xl text-gray-800 mb-2"
              style={{ animation: 'fadeSlideUp 0.4s 0.1s ease-out both' }}>
              {score >= 9 ? 'Window Expert!' : score >= 6 ? 'Nice work!' : 'Good effort!'}
            </h3>
            <p className="text-gray-500 mb-6" style={{ animation: 'fadeSlideUp 0.4s 0.2s ease-out both' }}>
              You got {score} out of {items.length} correct.
            </p>
            <div className="flex gap-3 justify-center" style={{ animation: 'fadeSlideUp 0.4s 0.3s ease-out both' }}>
              <RippleButton
                onClick={reset}
                className="px-6 py-3 rounded-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #4ECDC4, #88D8B0)' }}
              >
                Play Again
              </RippleButton>
              <RippleButton
                onClick={() => setShowRef((v) => !v)}
                className="px-6 py-3 rounded-2xl font-bold border-2 border-[#4ECDC4] text-[#0D4A40]"
              >
                See Reference
              </RippleButton>
            </div>

            {showRef && (
              <div className="mt-8 text-left" style={{ animation: 'fadeSlideUp 0.4s ease-out both' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F0FDFB] border border-[#4ECDC4]/30">
                    <h4 className="font-bold text-[#0D4A40] mb-3 flex items-center gap-1">
                      <span className="text-[#4ECDC4]">↑</span> Expanders
                    </h4>
                    {WIDENERS.map((w) => (
                      <div key={w.text} className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                        <span>{w.icon}</span> {w.text}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF0EE] border border-[#FF6B6B]/30">
                    <h4 className="font-bold text-[#7B2D00] mb-3 flex items-center gap-1">
                      <span className="text-[#FF6B6B]">↓</span> Constrictors
                    </h4>
                    {CONSTRICTORS.map((c) => (
                      <div key={c.text} className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
                        <span>{c.icon}</span> {c.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Active card ── */
          <div
            className="relative flex justify-center"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ height: 260 }}
          >
            {/* Next card peek */}
            {index + 1 < items.length && (
              <div
                className="absolute bg-white rounded-3xl shadow-md border border-gray-100"
                style={{ width: '90%', height: '100%', top: 8, transform: 'scale(0.96)', zIndex: 1 }}
              />
            )}

            {/* Active card */}
            <div
              ref={cardRef}
              className="absolute bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
              style={{
                width: '90%',
                height: '100%',
                zIndex: 2,
                transform: `translateX(${offset.x}px) translateY(${offset.y * 0.2}px) rotate(${rotation}deg)`,
                transition: flyDir ? 'transform 350ms ease-in' : isDragging ? 'none' : 'transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
                animation: shaking ? 'shake 0.45s ease-in-out' : undefined,
              }}
              onPointerDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {/* Swipe hint overlays */}
              {swipeRight && (
                <div
                  className="absolute inset-0 rounded-3xl flex items-center justify-start pl-8"
                  style={{ background: `rgba(78,205,196,${swipeIndicatorOpacity * 0.25})`, border: `2px solid rgba(78,205,196,${swipeIndicatorOpacity})` }}
                >
                  <span className="text-3xl font-black text-[#4ECDC4]" style={{ opacity: swipeIndicatorOpacity }}>↑ Expand</span>
                </div>
              )}
              {swipeLeft && (
                <div
                  className="absolute inset-0 rounded-3xl flex items-center justify-end pr-8"
                  style={{ background: `rgba(255,107,107,${swipeIndicatorOpacity * 0.25})`, border: `2px solid rgba(255,107,107,${swipeIndicatorOpacity})` }}
                >
                  <span className="text-3xl font-black text-[#FF6B6B]" style={{ opacity: swipeIndicatorOpacity }}>Constrict ↓</span>
                </div>
              )}

              <div className="text-5xl mb-3">{card.icon}</div>
              <p className="font-display font-black text-xl text-gray-800 text-center px-8">{card.text}</p>
              <p className="text-xs text-gray-400 mt-3 font-medium">{index + 1} / {items.length}</p>
            </div>
          </div>
        )}

        {!done && (
          <div className="flex justify-between mt-4 text-sm text-gray-400 font-semibold">
            <span className="text-[#FF6B6B]">← Constricts</span>
            <span className="text-xs">or use ← → keys</span>
            <span className="text-[#4ECDC4]">Expands →</span>
          </div>
        )}
      </div>
    </section>
  )
}
