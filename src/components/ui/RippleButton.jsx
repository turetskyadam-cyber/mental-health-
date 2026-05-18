import { useRipple } from '../../hooks/useRipple'

export default function RippleButton({ children, onClick, className = '', ...props }) {
  const createRipple = useRipple()

  const handleClick = (e) => {
    createRipple(e)
    onClick?.(e)
  }

  return (
    <button
      className={`ripple-container interactive ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
