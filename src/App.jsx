import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './components/Hero.jsx'
import Philosophy from './components/Philosophy.jsx'
import CookTimeline from './components/CookTimeline.jsx'
import Products from './components/Products.jsx'
import BuyCta from './components/BuyCta.jsx'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function App() {
  // web fonts change metrics enough to move pin positions, so refresh once loaded
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Hero />
      <main>
        <Philosophy />
        <CookTimeline />
        <Products />
        <BuyCta />
      </main>
      <footer className="footer">
        <span className="mono">© 2026 Ember &amp; Oak Smoke Co.</span>
        <span className="mono">Lockhart, Texas · pit@emberandoak.com</span>
      </footer>
    </>
  )
}
