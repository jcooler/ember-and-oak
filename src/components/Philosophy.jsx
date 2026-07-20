import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Philosophy() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.reveal', {
          y: 44,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.reveal', {
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power1.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="philosophy" ref={root} aria-labelledby="philosophy-title">
      <div className="reveal">
        <span className="eyebrow">the whole philosophy</span>
        <h2 className="philosophy-heading display" id="philosophy-title">
          Low <em>&amp;</em>
          <br />
          slow
        </h2>
      </div>
      <div className="philosophy-body">
        <p className="reveal">
          Every jar starts at the pit, not in a lab. We run post oak at 225° and let time do
          the talking, then blend rubs that can stand in that smoke for fourteen hours
          <strong> without turning bitter or burning off.</strong>
        </p>
        <p className="reveal">
          That means coarse grinds that build bark instead of dissolving into it. Real
          smoked paprika, not smoke flavoring. And batches small enough that the jar on
          your shelf was blended <strong>the same week it shipped.</strong>
        </p>
        <div className="philosophy-facts reveal">
          <span className="mono">Post oak only</span>
          <span className="mono">16-mesh grind</span>
          <span className="mono">Blended weekly</span>
        </div>
      </div>
    </section>
  )
}
