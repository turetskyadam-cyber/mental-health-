import { useState, useRef } from 'react'
import { ZONES } from '../constants/content'
import { useZone } from '../context/ZoneContext'

const ZONE_ORDER = ['hyper', 'window', 'hypo']

export default function WindowMap() {
  const { zone: activeZone, setZone } = useZone()
  const [expanded, setExpanded] = useState(null)
  const [markerPos, setMarkerPos] = useState(50)   // percentage 0-100 top to bottom
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef(null)

  const getZoneFromPos = (pos) => {
    if (pos < 33) return 'hyper'
    if (pos < 66) return 'window'
    return 'hypo'
  }

  const snapToZone = (zone) => {
    return zone === 'hyper' ? 16 : zone === 'window' ? 50 : 84
  }

  const handleTrackPointer = (e) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const raw = ((clientY - rect.top) / rect.height) * 100
    const clamped = Math.max(2, Math.min(98, raw))
    setMarkerPos(clamped)
    setZone(getZoneFromPos(clamped))
  }

  const startDrag = (e) => {
    e.preventDefault()
    setDragging(true)
    handleTrackPointer(e)

    const onMove = (ev) => handleTrackPointer(ev)
    const onUp = () => {
      setDragging(false)
      setMarkerPos((p) => snapToZone(getZoneFromPos(p)))
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
  }

  const currentZone = getZoneFromPos(markerPos)
  const zoneData = ZONES[currentZone]

  return (
    <section id="wavemap" className="py-20 px-6 bg-[#FDF8F0]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 section-hidden">
          <span className="inline-block px-3 py-1 rounded-full bg-[#4ECDC4]/15 text-[#0D4A40] text-sm font-semibold mb-3">
            The Nervous System Landscape
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            The Window of Tolerance
          </h2>
          <p className="text-gray-400 text-lg">
            Drag the marker to find where you are. Tap a zone to explore it.
          </p>
        </div>

        <div className="flex gap-6 items-stretch">

          {/* Zone stack */}
          <div className="flex-1 flex flex-col gap-0 rounded-3xl overflow-hidden shadow-xl">
            {ZONE_ORDER.map((zId) => {
              const z = ZONES[zId]
              const isExp = expanded === zId
              return (
                <div
                  key={zId}
                  className="relative cursor-pointer transition-all duration-500 overflow-hidden"
                  style={{
                    minHeight: isExp ? 260 : 100,
                    flex: isExp ? '3' : '1',
                    background: `linear-gradient(135deg, ${z.fromColor}CC, ${z.toColor}CC)`,
                  }}
                  onClick={() => setExpanded(isExp ? null : zId)}
                >
                  {/* Zone header */}
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{z.emoji}</span>
                        <div>
                          <p className="font-display font-black text-lg leading-tight" style={{ color: z.textColor }}>
                            {z.name}
                          </p>
                          <p className="text-sm font-medium opacity-80" style={{ color: z.textColor }}>
                            {z.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-xl transition-transform duration-300"
                      style={{
                        color: z.textColor,
                        transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      ▾
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isExp && (
                    <div
                      className="px-6 pb-6 grid grid-cols-2 gap-4"
                      style={{ animation: 'fadeSlideUp 0.35s ease-out both' }}
                    >
                      {/* Mind */}
                      <div>
                        <p className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70" style={{ color: z.textColor }}>
                          Mind
                        </p>
                        <ul className="space-y-1.5">
                          {z.mind.map((item, i) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-sm font-medium"
                              style={{
                                color: z.textColor,
                                animation: `fadeSlideUp 0.3s ${i * 60}ms ease-out both`,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: z.textColor, opacity: 0.6 }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Body */}
                      <div>
                        <p className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70" style={{ color: z.textColor }}>
                          Body
                        </p>
                        <ul className="space-y-1.5">
                          {z.body.map((item, i) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-sm font-medium"
                              style={{
                                color: z.textColor,
                                animation: `fadeSlideUp 0.3s ${i * 60 + 30}ms ease-out both`,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: z.textColor, opacity: 0.6 }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Description */}
                      <div
                        className="col-span-2 mt-2 p-3 rounded-xl"
                        style={{
                          background: 'rgba(255,255,255,0.25)',
                          animation: 'fadeSlideUp 0.3s 0.2s ease-out both',
                        }}
                      >
                        <p className="text-sm font-medium italic" style={{ color: z.textColor }}>
                          {z.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Vertical drag track */}
          <div className="flex flex-col items-center w-12 select-none">
            <p className="text-xs text-gray-400 font-semibold mb-2 rotate-90 whitespace-nowrap" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
              mark your state
            </p>
            <div
              ref={trackRef}
              className="relative flex-1 w-2 rounded-full cursor-pointer"
              style={{
                background: 'linear-gradient(to bottom, #FF6B6B 0%, #4ECDC4 50%, #A8B4D4 100%)',
                minHeight: 200,
              }}
              onPointerDown={startDrag}
              onTouchStart={startDrag}
            >
              {/* Marker */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-grab active:cursor-grabbing"
                style={{
                  top: `${markerPos}%`,
                  transition: dragging ? 'none' : 'top 300ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
                  style={{
                    background: `linear-gradient(135deg, ${zoneData.fromColor}, ${zoneData.toColor})`,
                    transform: dragging ? 'scale(1.3)' : 'scale(1)',
                    transition: 'transform 120ms ease, background 300ms ease',
                  }}
                >
                  🧡
                </div>
              </div>
            </div>

            {/* Zone chip */}
            <div
              className="mt-3 px-2 py-1 rounded-full text-xs font-bold text-center zone-transition"
              style={{
                background: `linear-gradient(135deg, ${zoneData.fromColor}, ${zoneData.toColor})`,
                color: zoneData.textColor,
                minWidth: 48,
                fontSize: '0.65rem',
              }}
            >
              {zoneData.emoji}
            </div>
          </div>
        </div>

        {/* Titration badge */}
        <div className="mt-8 flex justify-center">
          <div className="group relative inline-flex items-center gap-2 px-4 py-2 glass border border-white/60 rounded-full cursor-help">
            <span className="text-lg">💧</span>
            <span className="font-semibold text-sm text-gray-700">Titration</span>
            <span className="text-xs text-gray-400">hover me</span>

            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 p-3 glass border border-white/60 rounded-xl shadow-xl text-xs text-gray-600 leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
              Taking challenges in small, manageable doses — so your nervous system can expand gradually without overwhelm.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
