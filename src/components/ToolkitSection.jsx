import { useState, useEffect } from 'react'
import { ZONES, TOOLKIT } from '../constants/content'
import { useZone } from '../context/ZoneContext'
import FlipCard from './ui/FlipCard'
import RippleButton from './ui/RippleButton'

const TABS = [
  { id: 'hyper',  label: '🔥 Hyper',  hint: 'Down-Regulate' },
  { id: 'window', label: '🌊 Window', hint: 'Maintain & Widen' },
  { id: 'hypo',   label: '💤 Hypo',   hint: 'Up-Regulate' },
]

export default function ToolkitSection() {
  const { zone } = useZone()
  const [activeTab, setActiveTab] = useState(zone || 'window')
  const [prevTab, setPrevTab] = useState(null)

  // Sync tab whenever quiz result changes
  useEffect(() => {
    if (zone) setActiveTab(zone)
  }, [zone])

  const switchTab = (tabId) => {
    if (tabId === activeTab) return
    setPrevTab(activeTab)
    setActiveTab(tabId)
  }

  const zoneData = ZONES[activeTab]
  const tools = TOOLKIT[activeTab]

  const scrollToBreathe = (mode) => {
    document.getElementById('breathe')?.scrollIntoView({ behavior: 'smooth' })
    // Pass mode via custom event
    window.dispatchEvent(new CustomEvent('set-breathe-mode', { detail: mode }))
  }

  return (
    <section id="toolkit" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 section-hidden">
          <h2 className="font-display font-black text-4xl md:text-5xl text-gray-800 mb-3">
            Your Regulation Toolkit
          </h2>
          <p className="text-gray-400 text-lg">
            Select your zone — then flip the cards to discover your tools.
          </p>
        </div>

        {/* Tab bar */}
        <div className="relative flex gap-2 p-1.5 glass border border-white/60 rounded-2xl mb-10 max-w-sm mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className="relative flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-250 z-10"
              style={{
                color: activeTab === tab.id ? ZONES[tab.id].textColor : '#6B7280',
                background: activeTab === tab.id
                  ? `linear-gradient(135deg, ${ZONES[tab.id].fromColor}, ${ZONES[tab.id].toColor})`
                  : 'transparent',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                transform: activeTab === tab.id ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 300ms ease',
              }}
            >
              <div className="leading-tight">
                <div>{tab.label}</div>
                <div className="text-xs opacity-70 font-medium">{tab.hint}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Zone description strip */}
        <div
          className="text-center mb-8 p-4 rounded-2xl zone-transition"
          key={activeTab}
          style={{
            background: `linear-gradient(135deg, ${zoneData.fromColor}18, ${zoneData.toColor}18)`,
            borderLeft: `4px solid ${zoneData.fromColor}`,
            animation: 'fadeSlideUp 0.3s ease-out both',
          }}
        >
          <p className="text-gray-600 font-medium italic">{zoneData.description}</p>
        </div>

        {/* Flip cards */}
        <div
          className="grid md:grid-cols-3 gap-6"
          key={activeTab}
          style={{ animation: 'fadeSlideUp 0.35s ease-out both' }}
        >
          {tools.map((tool, i) => (
            <FlipCard
              key={tool.id}
              className="h-64"
              style={{ animationDelay: `${i * 80}ms` }}
              front={
                <div
                  className="h-full flex flex-col items-center justify-center text-center p-6 interactive-lift"
                  style={{
                    background: `linear-gradient(135deg, ${zoneData.fromColor}, ${zoneData.toColor})`,
                    color: zoneData.textColor,
                  }}
                >
                  <div className="text-5xl mb-4">{tool.icon}</div>
                  <h3 className="font-display font-black text-xl mb-1">{tool.name}</h3>
                  <p className="text-sm font-medium opacity-80">{tool.subtitle}</p>
                  <p className="text-xs mt-3 opacity-60 font-semibold">Tap to flip →</p>
                </div>
              }
              back={
                <div className="h-full flex flex-col bg-white p-5 overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">{tool.name}</h4>
                      <p className="text-xs text-gray-400">{tool.subtitle}</p>
                    </div>
                  </div>
                  <ol className="space-y-2 flex-1">
                    {tool.steps.map((step, si) => (
                      <li
                        key={si}
                        className="flex gap-2 text-xs text-gray-600 leading-relaxed"
                        style={{ animation: `fadeSlideUp 0.25s ${si * 50}ms ease-out both` }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: `linear-gradient(135deg, ${zoneData.fromColor}, ${zoneData.toColor})` }}
                        >
                          {si + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  {tool.action === 'breathing' && (
                    <RippleButton
                      onClick={() => scrollToBreathe(tool.mode)}
                      className="mt-3 w-full py-2 rounded-xl text-white text-xs font-bold"
                      style={{ background: `linear-gradient(135deg, ${zoneData.fromColor}, ${zoneData.toColor})` }}
                    >
                      Try the breathing exercise ↓
                    </RippleButton>
                  )}
                </div>
              }
            />
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Tap any card to flip between technique name and instructions
        </p>
      </div>
    </section>
  )
}
