import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Embers from './Embers.jsx'
import { Tin } from './ProductArt.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.hero-title .line > span', {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
        })
          .from('.hero-prod', { y: 70, autoAlpha: 0, duration: 0.9 }, '-=0.55')
          .from('.hero-note', { autoAlpha: 0, rotate: 3, y: 8, duration: 0.7 }, '-=0.3')
          .from(
            ['.topbar', '.hero-sub', '.hero-cta', '.hero-stats', '.hero-scroll'],
            { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.08 },
            '-=0.55',
          )

        // scroll cue: a soft repeating dip so the eye catches it
        gsap.to('.hero-scroll-arrow', {
          y: 7,
          duration: 0.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        })

        // ambient float lives on the rotate wrapper so it never fights
        // the pointer-parallax x/y on .hero-tin
        gsap.to('.hero-tin-rot', {
          y: -12,
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.6,
        })

        // depth on exit: product leaves faster than the type behind it
        gsap.to('.hero-stage', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-prod-move', {
          y: -110,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      // pointer parallax only where a fine pointer exists
      mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', (context) => {
        const tinX = gsap.quickTo('.hero-tin', 'x', { duration: 0.7, ease: 'power3' })
        const tinY = gsap.quickTo('.hero-tin', 'y', { duration: 0.7, ease: 'power3' })
        const titleX = gsap.quickTo('.hero-title', 'x', { duration: 1, ease: 'power3' })

        const onMove = context.add((e) => {
          const dx = (e.clientX / window.innerWidth) * 2 - 1
          const dy = (e.clientY / window.innerHeight) * 2 - 1
          tinX(dx * 18)
          tinY(dy * 12)
          titleX(dx * -10)
        })

        root.current.addEventListener('mousemove', onMove)
        return () => root.current?.removeEventListener('mousemove', onMove)
      })

      // reduced motion: everything appears with a quiet fade, nothing moves
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(['.topbar', '.hero-stage > *', '.hero-stats', '.hero-scroll'], {
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power1.out',
          stagger: 0.07,
        })
      })
    },
    { scope: root },
  )

  return (
    <header className="hero" ref={root}>
      <Embers />
      <nav className="topbar">
        <a className="topbar-mark" href="#top">
          Ember <em>&amp;</em> Oak
        </a>
        <a className="topbar-shop mono" href="#buy">
          Shop →
        </a>
      </nav>

      <div className="hero-stage">
        <div className="hero-center">
          <h1 className="hero-title display" id="top">
            <span className="line">
              <span>Ember</span>
            </span>
            <span className="line line--oak">
              <span>&amp; Oak</span>
            </span>
          </h1>

          <div className="hero-prod">
            <div className="hero-prod-move">
              <div className="hero-note" aria-hidden="true">
                the signature
                <svg viewBox="0 0 160 100" fill="none" aria-hidden="true">
                  <path
                    d="M152 8 C 110 6, 55 28, 16 88"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 88 l14 -6 M16 88 l1 -15"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="hero-tin-glow" aria-hidden="true" />
              <div className="hero-tin">
                <div className="hero-tin-rot">
                  <Tin id="hero" num="1" name="BLACKLINE" sub="BEEF RUB" accent="#ff5a1f" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="hero-sub">
          Small-batch rubs and sauces built over fourteen-hour post oak fires. Salt, pepper,
          smoke, and nothing you can't pronounce.
        </p>

        <div className="hero-cta">
          <a className="btn" href="#buy">
            Get the rub · $14
          </a>
          <a className="btn btn--ghost" href="#cook">
            Watch the cook
          </a>
        </div>
      </div>

      <p className="hero-stats mono" aria-hidden="true">
        225°F · 14 hrs · post oak only
      </p>
      <p className="hero-scroll mono" aria-hidden="true">
        Scroll <span className="hero-scroll-arrow">↓</span>
      </p>
    </header>
  )
}
