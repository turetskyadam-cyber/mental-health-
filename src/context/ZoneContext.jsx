import { createContext, useContext, useState, useEffect } from 'react'

const ZoneContext = createContext(null)

const ZONE_VARS = {
  hyper:  { '--zone-primary': '#FF6B6B', '--zone-secondary': '#FF8E53', '--zone-text': '#7B2D00' },
  window: { '--zone-primary': '#4ECDC4', '--zone-secondary': '#88D8B0', '--zone-text': '#0D4A40' },
  hypo:   { '--zone-primary': '#A8B4D4', '--zone-secondary': '#C3A6D4', '--zone-text': '#2D1F5E' },
}

export function ZoneProvider({ children }) {
  const [zone, setZoneState] = useState(null)

  const setZone = (newZone) => {
    setZoneState(newZone)
  }

  useEffect(() => {
    const root = document.documentElement
    if (zone && ZONE_VARS[zone]) {
      Object.entries(ZONE_VARS[zone]).forEach(([prop, val]) => {
        root.style.setProperty(prop, val)
      })
    } else {
      Object.keys(ZONE_VARS.window).forEach((prop) => {
        root.style.removeProperty(prop)
      })
    }
  }, [zone])

  return (
    <ZoneContext.Provider value={{ zone, setZone }}>
      {children}
    </ZoneContext.Provider>
  )
}

export function useZone() {
  return useContext(ZoneContext)
}
