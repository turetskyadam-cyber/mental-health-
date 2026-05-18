import { useState } from 'react'
import { useRipple } from '../../hooks/useRipple'

export default function FlipCard({ front, back, className = '' }) {
  const [flipped, setFlipped] = useState(false)
  const createRipple = useRipple()

  const handleClick = (e) => {
    createRipple(e)
    setFlipped((f) => !f)
  }

  return (
    <div
      className={`flip-card ripple-container cursor-pointer ${flipped ? 'flipped' : ''} ${className}`}
      onClick={handleClick}
      role="button"
      aria-pressed={flipped}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
    >
      <div className="flip-card-inner rounded-2xl">
        <div className="flip-card-front rounded-2xl overflow-hidden">
          {front}
        </div>
        <div className="flip-card-back rounded-2xl overflow-hidden">
          {back}
        </div>
      </div>
    </div>
  )
}
