import { useCallback } from 'react'

export function useRipple() {
  const createRipple = useCallback((e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.5
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `

    button.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
  }, [])

  return createRipple
}
