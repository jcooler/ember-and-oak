import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Timeline positions are in "hours": 1 timeline second = 1 hour of the cook.
const STAGES = [
  {
    hr: 0,
    temp: 38,
    tag: 'Fire management',
    copy: 'Light post oak, and only post oak. Wait for the smoke to run clean and blue before the brisket gets anywhere near the pit.',
  },
  {
    hr: 2,
    temp: 110,
    tag: 'The bark',
    copy: 'Nº 1 sets into mahogany bark as salt and coarse pepper fuse into the fat. Spritz it. Otherwise, hands off. Restraint is a technique.',
  },
  {
    hr: 6,
    temp: 165,
    tag: 'The stall',
    copy: "The internal temp parks at 165° and sits there for hours. Amateurs panic and crank the heat. We add a log and wait it out.",
  },
  {
    hr: 8,
    temp: 168,
    tag: 'The wrap',
    copy: "Peach butcher paper, wrapped tight. It protects the bark and pushes through the stall. It's also why this page just changed color.",
  },
  {
    hr: 12,
    temp: 203,
    tag: 'Probe tender',
    copy: "The probe slides in like it's not even there. 203° is where we usually find it, but it's a feeling in the wrist, not a number.",
  },
  {
    hr: 14,
    temp: 203,
    tag: 'The rest',
    copy: "An hour in the cooler, minimum. The hardest part of a fourteen-hour cook is the part where you don't slice. It's done when it's done.",
  },
]

const PAPER = '#e7be93'
const CHAR2 = '#221a14'
const INK = '#241408'
const BONE = '#f1e9dc'
const SMOKE = '#a39a8f'
const INK_SOFT = '#5c4128'

export default function CookTimeline() {
  const root = useRef(null)
  const hourRef = useRef(null)
  const tempRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = root.current
        section.classList.add('cook--motion')
        section.classList.remove('cook--static')

        const stageEls = gsap.utils.toArray('.cook-stage')
        const state = { hour: 0, temp: STAGES[0].temp }

        const render = () => {
          hourRef.current.textContent = String(Math.round(state.hour)).padStart(2, '0')
          tempRef.current.textContent = Math.round(state.temp)
        }
        render()
        gsap.set(stageEls[0], { autoAlpha: 1 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: render,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=4600',
            scrub: 0.6,
            pin: true,
          },
        })

        // temperature + hour march, one segment per stage
        for (let i = 1; i < STAGES.length; i++) {
          const prev = STAGES[i - 1]
          const s = STAGES[i]
          tl.to(state, { hour: s.hr, temp: s.temp, duration: s.hr - prev.hr }, prev.hr)
        }

        // stage crossfades at each boundary
        for (let i = 1; i < STAGES.length; i++) {
          const at = STAGES[i].hr
          tl.to(stageEls[i - 1], { autoAlpha: 0, y: -26, duration: 0.5, ease: 'power2.in' }, at - 0.55)
          tl.fromTo(
            stageEls[i],
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            at - 0.1,
          )
        }

        // ---- THE WRAP: the page itself gets wrapped in butcher paper ----
        const wrapAt = STAGES[3].hr // hour 8
        tl.to('.cook-bg', { backgroundColor: PAPER, duration: 1.4, ease: 'power2.inOut' }, wrapAt - 0.3)
        tl.to(section, { color: INK, duration: 1.4, ease: 'power2.inOut' }, wrapAt - 0.3)
        tl.to(
          ['.cook-stage-copy', '.cook-readout-label', '.cook-ticks'],
          { color: INK_SOFT, duration: 1.4, ease: 'power2.inOut' },
          wrapAt - 0.3,
        )
        tl.to('.cook .eyebrow', { color: '#7f370f', duration: 1.4, ease: 'power2.inOut' }, wrapAt - 0.3)
        tl.fromTo(
          '.cook-wrapnote',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          wrapAt + 0.4,
        )

        // ---- unwrap for the rest: back to char for the quiet ending ----
        const restAt = STAGES[5].hr // hour 14
        tl.to('.cook-wrapnote', { autoAlpha: 0, duration: 0.4 }, restAt - 0.8)
        tl.to('.cook-bg', { backgroundColor: CHAR2, duration: 1.2, ease: 'power2.inOut' }, restAt - 0.5)
        tl.to(section, { color: BONE, duration: 1.2, ease: 'power2.inOut' }, restAt - 0.5)
        tl.to(
          ['.cook-stage-copy', '.cook-readout-label', '.cook-ticks'],
          { color: SMOKE, duration: 1.2, ease: 'power2.inOut' },
          restAt - 0.5,
        )
        tl.to('.cook .eyebrow', { color: '#ffb25e', duration: 1.2, ease: 'power2.inOut' }, restAt - 0.5)

        // fire line fill, 1:1 with the hours
        tl.to('.cook-line-fill', { scaleX: 1, duration: 14 }, 0)

        // breathing room at the end so the rest stage can be read
        tl.to({}, { duration: 1.2 }, 14)

        return () => {
          section.classList.remove('cook--motion')
          section.classList.add('cook--static')
        }
      })

      // reduced motion: stages stay stacked and static, but still fade in
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray('.cook-stage').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            duration: 0.6,
            ease: 'power1.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="cook cook--static" ref={root} aria-labelledby="cook-title" id="cook">
      <div className="cook-frame">
        <div className="cook-bg" aria-hidden="true" />
        <p className="cook-wrapnote" aria-hidden="true">
          ← that's the butcher paper
        </p>

        <header className="cook-head">
          <span className="eyebrow">what the rub is built to survive</span>
          <h2 className="cook-title display" id="cook-title">
            Anatomy of a 14-hour cook
          </h2>
        </header>

        <div className="cook-body">
          <div className="cook-readout" aria-hidden="true">
            <div className="cook-readout-temp">
              <span ref={tempRef}>38</span>
              <sup>°F</sup>
            </div>
            <div className="cook-readout-label mono">
              <span>
                internal · hour <span ref={hourRef}>00</span>
              </span>
              <span>pit 225°F</span>
            </div>
          </div>

          <div className="cook-stages">
            {STAGES.map((s) => (
              <article className="cook-stage" key={s.hr}>
                <span className="cook-stage-meta mono">{`Hour ${String(s.hr).padStart(2, '0')} · internal ${s.temp}°F`}</span>
                <h3 className="cook-stage-tag display">{s.tag}</h3>
                <p className="cook-stage-copy">{s.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="cook-line" aria-hidden="true">
          <div className="cook-line-track">
            <div className="cook-line-fill" />
          </div>
          <div className="cook-ticks">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i}>{String(i).padStart(2, '0')}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
