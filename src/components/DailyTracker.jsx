import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ZONES } from '../constants/content'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ZONE_OPTS = ['hyper', 'window', 'hypo']

function getWeekKey() {
  const d = new Date()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return monday.toISOString().slice(0, 10)
}

function getStreakMessage(log) {
  const filled = Object.values(log).filter(Boolean)
  if (filled.length === 0) return null

  const counts = { hyper: 0, window: 0, hypo: 0 }
  filled.forEach((z) => counts[z]++)
  const max = Math.max(...Object.values(counts))
  const dominant = Object.entries(counts).find(([, v]) => v === max)?.[0]

  const msgs = {
    hyper:  "You've been running hot — try the Down-Regulate toolkit when you're ready. 🌊",
    window: "You're doing beautifully. Keep widening that window. 💚",
    hypo:   "You've been resting deep — a gentle Up-Regulate activity might feel good today. ✨",
  }
  return msgs[dominant]
}

export default function DailyTracker() {
  const weekKey = getWeekKey()
  const [log, setLog] = useLocalStorage(`ww_tracker_${weekKey}`, {})
  const [openDay, setOpenDay] = useState(null)

  const streak = Object.values(log).filter(Boolean).length

  const setDay = (day, zone) => {
    setLog({ ...log, [day]: zone })
    setOpenDay(null)
  }

  const pattern = getStreakMessage(log)

  return (
    <section id="tracker" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 section-hidden">
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            My Week at a Glance
          </h2>
          <p className="text-gray-400 text-lg">Check in daily — one tap, that&apos;s it.</p>
        </div>

        {/* Streak banner */}
        <div className="flex items-center justify-center gap-3 mb-8 p-3 glass border border-white/60 rounded-2xl max-w-xs mx-auto">
          <span
            className="text-2xl"
            style={{ animation: streak > 0 ? 'wiggle 0.3s ease-in-out 3' : undefined }}
          >
            🔥
          </span>
          <div>
            <span
              className="font-display font-black text-2xl text-gray-800"
              key={streak}
              style={{ display: 'inline-block', animation: 'countUp 0.4s ease-out both' }}
            >
              {streak}
            </span>
            <span className="font-semibold text-gray-500 ml-1 text-sm">
              {streak === 1 ? 'day checked in' : 'days checked in'} this week
            </span>
          </div>
        </div>

        {/* Day grid */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {DAYS.map((day) => {
            const zoneId = log[day]
            const z = zoneId ? ZONES[zoneId] : null
            const isOpen = openDay === day

            return (
              <div key={day} className="flex-shrink-0 relative" style={{ width: 80 }}>
                {/* Selector fan */}
                {isOpen && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-10"
                    style={{ animation: 'fadeSlideUp 0.25s ease-out both' }}>
                    {ZONE_OPTS.map((zId, i) => {
                      const zz = ZONES[zId]
                      return (
                        <button
                          key={zId}
                          onClick={() => setDay(day, zId)}
                          className="w-10 h-10 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xl transition-transform hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${zz.fromColor}, ${zz.toColor})`,
                            animation: `expandIn 0.2s ${i * 50}ms cubic-bezier(0.34,1.56,0.64,1) both`,
                          }}
                          title={zz.name}
                        >
                          {zz.emoji}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => { setLog({ ...log, [day]: undefined }); setOpenDay(null) }}
                      className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 text-gray-400 text-xs font-bold hover:bg-gray-200 transition-colors"
                      style={{ animation: `expandIn 0.2s 150ms cubic-bezier(0.34,1.56,0.64,1) both` }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Day card */}
                <button
                  onClick={() => setOpenDay(isOpen ? null : day)}
                  className="w-full rounded-2xl border-2 flex flex-col items-center justify-center py-3 gap-2 interactive-lift transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: z ? z.fromColor : '#E5E7EB',
                    background: z
                      ? `linear-gradient(160deg, ${z.fromColor}33, ${z.toColor}22)`
                      : 'white',
                    height: 90,
                    borderStyle: z ? 'solid' : 'dashed',
                  }}
                >
                  <span className="text-xl" key={zoneId || 'empty'} style={{ animation: zoneId ? 'expandIn 0.3s ease-out both' : undefined }}>
                    {z ? z.emoji : '○'}
                  </span>
                  <span className="text-xs font-bold" style={{ color: z ? z.textColor : '#9CA3AF' }}>
                    {day}
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {ZONE_OPTS.map((zId) => {
            const z = ZONES[zId]
            return (
              <div key={zId} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{z.emoji}</span>
                <span>{z.name.split(' ')[0]}</span>
              </div>
            )
          })}
        </div>

        {/* Pattern message */}
        {pattern && streak >= 3 && (
          <div
            className="mt-6 p-4 rounded-2xl glass border border-white/60 text-center text-sm font-medium text-gray-600"
            style={{ animation: 'fadeSlideUp 0.4s ease-out both' }}
          >
            {pattern}
          </div>
        )}

        {streak === 0 && (
          <div className="mt-4 text-center text-sm text-gray-400 italic">
            Tap any day to check in — no pressure, just awareness 💛
          </div>
        )}
      </div>
    </section>
  )
}
