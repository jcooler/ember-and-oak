import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Embers from './Embers.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function BuyCta() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const targets = '.buy > *:not(.fx-canvas)'
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(targets, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(targets, {
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power1.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="buy" ref={root} aria-labelledby="buy-title" id="buy">
      <Embers emberCount={22} smokeCount={5} />
      <h2 className="buy-title display" id="buy-title">
        Get on <em>the fire</em>
      </h2>
      <p className="buy-sub">
        The Pit Box: all four numbers in one crate. Both rubs, both sauces, and a roll of
        peach butcher paper, because now you know what it's for.
      </p>
      <div className="buy-actions">
        <a className="btn" href="#buy">
          Buy the Pit Box · $45
        </a>
        <a className="btn btn--ghost" href="#lineup">
          Start with Nº 1 · $14
        </a>
      </div>
      <p className="buy-note mono">
        Blended weekly in Lockhart, Texas · ships Mondays · free shipping over $40
      </p>
    </section>
  )
}
