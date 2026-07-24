import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const STAGES = [
  { hr: 0, temp: 38, tag: 'Clean fire', copy: 'Post oak burns down until the smoke runs thin and blue. The brisket waits.' },
  { hr: 2, temp: 110, tag: 'Bark sets', copy: 'Salt moves inward. Coarse pepper and paprika fuse into the rendering fat.' },
  { hr: 6, temp: 165, tag: 'The stall', copy: 'Evaporation parks the internal temperature. Add a split of oak. Do not chase the dial.' },
  { hr: 8, temp: 168, tag: 'Paper wrap', copy: 'Peach paper protects the bark without trapping it in steam. Fold tight and return to heat.' },
  { hr: 12, temp: 203, tag: 'Probe tender', copy: 'The number is a clue. The brisket is ready when the probe meets almost no resistance.' },
  { hr: 14, temp: 203, tag: 'The rest', copy: 'One hour, minimum. The last move is no move at all.' },
]

export default function CookTimeline() {
  const root = useRef(null)
  const hour = useRef(null)
  const temp = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add({
      animate: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 901px)',
    }, ({ conditions }) => {
      if (!conditions.animate || !conditions.desktop) return
      const section = root.current
      const cards = gsap.utils.toArray('.cook-stage')
      const state = { hour: 0, temp: STAGES[0].temp }
      section.classList.add('cook--motion')
      gsap.set(cards[0], { autoAlpha: 1 })
      const render = () => {
        hour.current.textContent = String(Math.round(state.hour)).padStart(2, '0')
        temp.current.textContent = Math.round(state.temp)
      }
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: render,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2800',
          scrub: 0.5,
          pin: '.cook-frame',
        },
      })
      STAGES.slice(1).forEach((stage, index) => {
        const previous = STAGES[index]
        timeline.to(state, { hour: stage.hr, temp: stage.temp, duration: stage.hr - previous.hr }, previous.hr)
        timeline.to(cards[index], { autoAlpha: 0, y: -18, duration: 0.35, ease: 'power2.in' }, stage.hr - 0.4)
        timeline.fromTo(cards[index + 1], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, stage.hr - 0.05)
      })
      timeline.to('.cook-progress', { scaleX: 1, duration: 14 }, 0)
      return () => section.classList.remove('cook--motion')
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="cook" ref={root} aria-labelledby="cook-title" id="cook">
      <div className="cook-frame">
        <header className="cook-head">
          <span className="eyebrow">A rub measured against time</span>
          <h2 className="cook-title display" id="cook-title">Fourteen<br />hours, held.</h2>
        </header>
        <div className="cook-readout" aria-hidden="true">
          <span ref={temp}>38</span><sup>°F</sup>
          <small className="mono">Internal · hour <b ref={hour}>00</b></small>
        </div>
        <div className="cook-stages">
          {STAGES.map((stage) => (
            <article className="cook-stage" key={stage.hr}>
              <p className="cook-stage-meta mono">Hour {String(stage.hr).padStart(2, '0')} · {stage.temp}°F</p>
              <h3 className="display">{stage.tag}</h3>
              <p>{stage.copy}</p>
            </article>
          ))}
        </div>
        <div className="cook-track" aria-hidden="true"><span className="cook-progress" /></div>
        <div className="cook-hours mono" aria-hidden="true"><span>00</span><span>02</span><span>06</span><span>08</span><span>12</span><span>14</span></div>
      </div>
    </section>
  )
}
