import { useEffect } from 'react'
import { ZoneProvider } from './context/ZoneContext'
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

        {/* Footer */}
        <footer className="py-12 px-6 text-center bg-white border-t border-gray-100">
          <p className="font-display font-black text-xl text-gray-700 mb-1">
            Window of Wellness
          </p>
          <p className="text-sm text-gray-400">
            Based on Dr. Santiago&apos;s Clinical Resources · Window of Tolerance model
          </p>
          <p className="text-xs text-gray-300 mt-2">
            For educational purposes. If you&apos;re struggling, please reach out to a mental health professional. 💚
          </p>
        </footer>
      </div>
    </ZoneProvider>
  )
}
