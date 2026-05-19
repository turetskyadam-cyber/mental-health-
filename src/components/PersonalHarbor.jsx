import { useState, useEffect } from 'react'
import { HARBOR_PLACEHOLDERS } from '../constants/content'
import RippleButton from './ui/RippleButton'

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = word
      currentY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, currentY)
  return currentY + lineHeight
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default function PersonalHarbor() {
  const [whispers, setWhispers] = useState('')
  const [anchor1, setAnchor1] = useState('')
  const [anchor2, setAnchor2] = useState('')
  const [saved, setSaved] = useState(false)
  const [placeholder, setPlaceholder] = useState(HARBOR_PLACEHOLDERS[0])
  const [phIdx, setPhIdx] = useState(0)
  const [phOpacity, setPhOpacity] = useState(1)

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhOpacity(0)
      setTimeout(() => {
        setPhIdx((i) => {
          const next = (i + 1) % HARBOR_PLACEHOLDERS.length
          setPlaceholder(HARBOR_PLACEHOLDERS[next])
          return next
        })
        setPhOpacity(1)
      }, 350)
    }, 3500)
    return () => clearInterval(cycle)
  }, [])

  const hasContent = whispers || anchor1 || anchor2

  const saveSnapshot = async () => {
    const scale = 2
    const W = 680
    const canvas = document.createElement('canvas')

    // Measure content height first
    const tempCtx = canvas.getContext('2d')
    tempCtx.font = '500 15px "Plus Jakarta Sans", sans-serif'
    let estimatedH = 220
    if (whispers) estimatedH += Math.ceil(whispers.length / 55) * 24 + 60
    if (anchor1 || anchor2) estimatedH += 120
    const H = Math.max(420, Math.min(estimatedH + 80, 700))

    canvas.width = W * scale
    canvas.height = H * scale
    const ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)

    // Background
    ctx.fillStyle = '#FDF8F0'
    ctx.fillRect(0, 0, W, H)

    // Top gradient bar
    const topGrad = ctx.createLinearGradient(0, 0, W, 0)
    topGrad.addColorStop(0, '#4ECDC4')
    topGrad.addColorStop(1, '#88D8B0')
    ctx.fillStyle = topGrad
    roundRect(ctx, 0, 0, W, 10, 0)
    ctx.fill()

    // App name
    await document.fonts.ready
    ctx.fillStyle = '#4ECDC4'
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('WINDOW OF WELLNESS', 40, 45)

    // Date
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif'
    const dw = ctx.measureText(dateStr).width
    ctx.fillText(dateStr, W - 40 - dw, 45)

    // Title
    ctx.fillStyle = '#1F2937'
    ctx.font = '900 32px "Fraunces", serif'
    ctx.fillText('My Wellness Snapshot', 40, 85)

    // Divider
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 102)
    ctx.lineTo(W - 40, 102)
    ctx.stroke()

    let curY = 130

    // Whispers section
    ctx.fillStyle = '#0D4A40'
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('🌊  Early Warning Whispers', 40, curY)
    curY += 8

    if (whispers) {
      // Card bg
      const cardH = Math.ceil(whispers.length / 55) * 24 + 36
      ctx.fillStyle = '#F0FDFB'
      roundRect(ctx, 40, curY, W - 80, cardH, 12)
      ctx.fill()
      ctx.fillStyle = '#4ECDC4'
      ctx.fillRect(40, curY, 4, cardH)
      ctx.fillStyle = '#374151'
      ctx.font = '400 14px "Plus Jakarta Sans", sans-serif'
      curY = wrapText(ctx, whispers, 60, curY + 22, W - 120, 24)
      curY += 8
    } else {
      ctx.fillStyle = '#D1FAF3'
      roundRect(ctx, 40, curY, W - 80, 44, 12)
      ctx.fill()
      ctx.fillStyle = '#9CA3AF'
      ctx.font = 'italic 13px "Plus Jakarta Sans", sans-serif'
      ctx.fillText('Nothing written', 60, curY + 28)
      curY += 52
    }

    curY += 20

    // Anchors section
    ctx.fillStyle = '#0D4A40'
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif'
    ctx.fillText('⚓  My Non-Negotiable Anchors', 40, curY)
    curY += 14

    for (const [i, val] of [[0, anchor1], [1, anchor2]]) {
      ctx.fillStyle = '#F9FAFB'
      roundRect(ctx, 40, curY, W - 80, 44, 10)
      ctx.fill()
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1
      roundRect(ctx, 40, curY, W - 80, 44, 10)
      ctx.stroke()
      ctx.fillStyle = '#6B7280'
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(`ANCHOR ${i + 1}`, 60, curY + 16)
      ctx.fillStyle = val ? '#1F2937' : '#D1D5DB'
      ctx.font = val ? '500 14px "Plus Jakarta Sans", sans-serif' : 'italic 13px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(val || 'Not filled in', 60, curY + 34)
      curY += 54
    }

    // Bottom bar
    const botGrad = ctx.createLinearGradient(0, 0, W, 0)
    botGrad.addColorStop(0, '#4ECDC4')
    botGrad.addColorStop(1, '#88D8B0')
    ctx.fillStyle = botGrad
    ctx.fillRect(0, H - 6, W, 6)

    // Download
    const link = document.createElement('a')
    const dateFile = new Date().toISOString().split('T')[0]
    link.download = `wellness-snapshot-${dateFile}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section id="harbor" className="py-20 px-6 bg-[#FDF8F0]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 section-hidden">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4ECDC4]/15 text-[#0D4A40] text-sm font-semibold mb-3">
            My Personal Harbor
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            Self-Sourced Insights
          </h2>
          <p className="text-gray-400 text-lg">
            Write it down, save it as an image, keep it with you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 — Whispers */}
          <div className="bg-white rounded-3xl border-2 p-6 transition-all duration-200 interactive-lift"
            style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌊</span>
              <h3 className="font-display font-black text-lg text-gray-800">
                My Body&apos;s Early Warning Whispers…
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 font-medium">to catch the slide out early</p>
            <textarea
              value={whispers}
              onChange={(e) => setWhispers(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border-0 bg-gray-50 p-4 text-gray-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/40 transition-all duration-200"
              placeholder={placeholder}
              style={{ caretColor: '#4ECDC4', opacity: phOpacity, transition: 'opacity 350ms' }}
            />
          </div>

          {/* Card 2 — Anchors */}
          <div className="bg-white rounded-3xl border-2 p-6 transition-all duration-200 interactive-lift"
            style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚓</span>
              <h3 className="font-display font-black text-lg text-gray-800">
                My Non-Negotiable Anchors
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-medium">the top 2 practices I rely on</p>

            {[
              { value: anchor1, setValue: setAnchor1, placeholder: 'My first anchor practice…' },
              { value: anchor2, setValue: setAnchor2, placeholder: 'My second anchor practice…' },
            ].map((anchor, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Anchor {i + 1}
                </label>
                <input
                  type="text"
                  value={anchor.value}
                  onChange={(e) => anchor.setValue(e.target.value)}
                  placeholder={anchor.placeholder}
                  className="w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/40 transition-all duration-200"
                  style={{ caretColor: '#4ECDC4' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-center mt-8">
          <RippleButton
            onClick={saveSnapshot}
            disabled={!hasContent}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm shadow-lg"
            style={{
              background: saved
                ? 'linear-gradient(135deg, #4ECDC4, #88D8B0)'
                : hasContent
                ? 'linear-gradient(135deg, #4ECDC4, #88D8B0)'
                : '#E5E7EB',
              color: hasContent ? 'white' : '#9CA3AF',
              boxShadow: hasContent ? '0 6px 20px rgba(78,205,196,0.35)' : 'none',
              transition: 'all 300ms ease',
            }}
          >
            {saved ? '✓ Saved to your device!' : '📸 Save as Image'}
          </RippleButton>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Downloads a PNG snapshot with today&apos;s date — nothing stored online.
        </p>
      </div>
    </section>
  )
}
