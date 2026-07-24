import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import wrapImage from '../assets/generated/brisket-wrap-process.webp'

export default function Philosophy() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.philosophy-reveal', {
        autoAlpha: 0, y: 34, duration: 0.85, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="philosophy" ref={root} aria-labelledby="philosophy-title">
      <header className="philosophy-head philosophy-reveal">
        <span className="eyebrow">Low &amp; slow is not a slogan</span>
        <h2 className="philosophy-title display" id="philosophy-title">It is the<br />ingredient.</h2>
      </header>
      <figure className="philosophy-image philosophy-reveal">
        <img src={wrapImage} alt="Smoked brisket with coarse pepper bark resting in juice-stained peach butcher paper" width="1168" height="880" loading="lazy" />
        <figcaption className="mono">Hour 08 · the wrap · 168°F internal</figcaption>
      </figure>
      <div className="philosophy-copy philosophy-reveal">
        <p>Blackline starts coarse because fourteen hours of heat will humble anything fine. Salt moves inward. Pepper stays put. Post oak handles the rest.</p>
        <p>We blend in small weekly runs in Lockhart, then stop adding things. The jar has one job: build bark without getting between you and the beef.</p>
        <dl className="proof-list">
          <div><dt className="mono">Wood</dt><dd>Post oak only</dd></div>
          <div><dt className="mono">Grind</dt><dd>16-mesh pepper</dd></div>
          <div><dt className="mono">Batch</dt><dd>Blended weekly</dd></div>
        </dl>
      </div>
    </section>
  )
}
