import { useState, useRef, useCallback } from 'react'
import { CARD_SORT_ITEMS, WIDENERS, CONSTRICTORS } from '../constants/content'
import RippleButton from './ui/RippleButton'
import Confetti from './ui/Confetti'

const shuffled = [...CARD_SORT_ITEMS].sort(() => Math.random() - 0.5)

export default function CardSortGame() {
  const [items] = useState(shuffled)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [flyDir, setFlyDir] = useState(null)
  const [confettiTrig, setConfettiTrig] = useState(0)
  const [showRef, setShowRef] = useState(false)
  const [wrongFeedback, setWrongFeedback] = useState(null)

  const dragStart = useRef(null)
  const cardRef = useRef(null)
  const done = index >= items.length

  // Use Pointer Events only — they handle both mouse and touch,
  // and avoid the double-fire bug from mixing onPointerDown + onTouchStart.
  // touch-action:none on the card prevents browser scroll from stealing the drag.
  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    dragStart.current = { x: startX, y: startY }
    setIsDragging(true)
    setFlyDir(null)
    setWrongFeedback(null)

    const onMove = (ev) => {
      if (!dragStart.current) return
      setOffset({ x: ev.clientX - startX, y: ev.clientY - startY })
    }

    const onEnd = (ev) => {
      if (!dragStart.current) return
      const finalDx = ev.clientX - startX
      dragStart.current = null
      setIsDragging(false)

      if (Math.abs(finalDx) >= 70) {
        resolveSwipe(finalDx > 0 ? 'right' : 'left')
      } else {
        setOffset({ x: 0, y: 0 })
      }

      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
  }, [index, items])

  const advanceCard = (nextIndex) => {
    setOffset({ x: 0, y: 0 })
    setFlyDir(null)
    setIndex(nextIndex)
    if (nextIndex >= items.length) {
      setTimeout(() => setConfettiTrig((t) => t + 1), 200)
    }
  }

  const resolveSwipe = (dir) => {
    const card = items[index]
    const guessedExpand = dir === 'right'
    const correct = (guessedExpand && card.correct === 'expand') ||
                    (!guessedExpand && card.correct === 'constrict')
    const next = index + 1

    // Always fly the card off in the swiped direction
    setFlyDir(dir)
    setOffset({ x: dir === 'right' ? 650 : -650, y: 0 })

    if (correct) {
      setScore((s) => s + 1)
      setTimeout(() => advanceCard(next), 360)
    } else {
      // Show explanation, then advance
      setTimeout(() => {
        setWrongFeedback({
          item: card,
          guessedDir: dir,
          correctLabel: card.correct === 'expand' ? '→ Expands' : '← Constricts',
        })
        advanceCard(next)
      }, 360)
    }
  }

  const handleKeyDown = (e) => {
    if (done) return
    if (e.key === 'ArrowRight') resolveSwipe('right')
    if (e.key === 'ArrowLeft')  resolveSwipe('left')
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
                touchAction: 'none',
                transform: `translateX(${offset.x}px) translateY(${offset.y * 0.2}px) rotate(${rotation}deg)`,
                transition: flyDir ? 'transform 360ms ease-in' : isDragging ? 'none' : 'transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onPointerDown={handleDragStart}
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

        {/* Wrong answer explanation panel */}
        {wrongFeedback && (
          <div
            className="mt-4 p-4 rounded-2xl border-2 text-left"
            style={{
              background: '#FFF0EE',
              borderColor: '#FF6B6B55',
              animation: 'fadeSlideUp 0.35s ease-out both',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-bold text-[#7B2D00] text-sm mb-1">
                  {wrongFeedback.item.icon} &ldquo;{wrongFeedback.item.text}&rdquo; actually{' '}
                  <span className="underline decoration-dotted">
                    {wrongFeedback.item.correct === 'expand' ? 'expands' : 'constricts'}
                  </span>{' '}
                  your window{' '}
                  <span className="font-black">
                    {wrongFeedback.correctLabel}
                  </span>
                </p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {wrongFeedback.item.explanation}
                </p>
              </div>
              <button
                onClick={() => setWrongFeedback(null)}
                className="flex-shrink-0 text-xs font-bold text-[#FF6B6B] hover:text-[#cc4444] transition-colors mt-0.5"
              >
                Got it ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
