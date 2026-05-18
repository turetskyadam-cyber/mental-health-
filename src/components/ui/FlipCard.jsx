import { useState } from 'react'
import { useRipple } from '../../hooks/useRipple'

export default function FlipCard({ front, back, className = '', style }) {
  const [flipped, setFlipped] = useState(false)
  const createRipple = useRipple()

  const handleClick = (e) => {
    createRipple(e)
    setFlipped((f) => !f)
  }

  return (
    <div
      className={`relative ripple-container cursor-pointer ${className}`}
      style={style}
      onClick={handleClick}
      role="button"
      aria-pressed={flipped}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
    >
      <div className={`flip-card w-full h-full ${flipped ? 'flipped' : ''}`}>
        <div className="flip-card-inner rounded-2xl">
          <div className="flip-card-front rounded-2xl overflow-hidden">
            {front}
          </div>
          <div className="flip-card-back rounded-2xl overflow-hidden">
            {back}
          </div>
        </div>
      </div>
    </div>
  )
}
