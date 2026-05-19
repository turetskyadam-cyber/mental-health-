import { useEffect } from 'react'
import { ZoneProvider } from './context/ZoneContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Onboarding from './components/Onboarding'
import StateQuiz from './components/StateQuiz'
import WindowMap from './components/WindowMap'
import ToolkitSection from './components/ToolkitSection'
import BreathingExercise from './components/BreathingExercise'
import CardSortGame from './components/CardSortGame'
import PersonalHarbor from './components/PersonalHarbor'

function SectionReveal({ children }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
            entry.target.classList.remove('section-hidden')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const targets = document.querySelectorAll('.section-hidden')
    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  })

  return children
}

function Footer() {
  const [storedName] = useLocalStorage('ww_name', '')
  const [storedDoctor] = useLocalStorage('ww_doctor', '')

  return (
    <footer className="py-12 px-6 text-center bg-white border-t border-gray-100">
      <p className="font-display font-black text-xl text-gray-700 mb-1">
        Window of Wellness
      </p>
      <p className="text-sm text-gray-400">
        {storedDoctor
          ? `${storedDoctor}'s Clinical Resources · Window of Tolerance model`
          : "Based on Dr. Santiago's Clinical Resources · Window of Tolerance model"}
        {storedName && <span> · Prepared for <strong>{storedName}</strong></span>}
      </p>
      <p className="text-xs text-gray-300 mt-2">
        For educational purposes. If you&apos;re struggling, please reach out to a mental health professional. 💚
      </p>
    </footer>
  )
}

export default function App() {
  return (
    <ZoneProvider>
      <div className="min-h-screen font-body">
        <Onboarding />
        <Nav />

        <SectionReveal>
          <Hero />
          <StateQuiz />
          <WindowMap />
          <ToolkitSection />
          <BreathingExercise />
          <CardSortGame />
          <PersonalHarbor />
        </SectionReveal>

        <Footer />
      </div>
    </ZoneProvider>
  )
}
