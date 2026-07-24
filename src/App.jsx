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
  useEffect(() => {
    const refresh = async () => {
      await document.fonts?.ready
      await Promise.all(Array.from(document.images).map((image) => image.decode?.().catch(() => {})))
      ScrollTrigger.refresh()
    }
    refresh()
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
        <a className="footer-mark display" href="#top">Ember <em>&amp;</em> Oak</a>
        <p className="mono">Small-batch smoke goods<br />Lockhart, Texas</p>
        <p className="mono">© 2026 Ember &amp; Oak Smoke Co.<br /><a href="mailto:pit@emberandoak.com">pit@emberandoak.com</a></p>
      </footer>
    </>
  )
}
