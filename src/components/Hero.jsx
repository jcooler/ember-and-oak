import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import heroImage from '../assets/generated/blackline-hero-campaign.webp'

export default function Hero() {
  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-media', { autoAlpha: 0, scale: 1.04, duration: 1.35 })
        .from('.hero-kicker', { autoAlpha: 0, y: 18, duration: 0.55 }, '-=.8')
        .from('.hero-title span', { yPercent: 105, duration: 0.9, stagger: 0.08 }, '-=.48')
        .from('.hero-copy > *', { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.08 }, '-=.5')
        .from('.topbar', { autoAlpha: 0, y: -12, duration: 0.55 }, '-=.7')

      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
        .to('.hero-media-inner', { yPercent: 8, scale: 1.035, ease: 'none' }, 0)
        .to('.hero-title', { yPercent: -5, ease: 'none' }, 0)
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <header className="hero" ref={root} id="top">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="topbar-mark" href="#top">Ember <em>&amp;</em> Oak</a>
        <div className="topbar-links">
          <a href="#cook">The cook</a>
          <a href="#lineup">The lineup</a>
          <a className="topbar-shop" href="#buy">Shop the Pit Box</a>
        </div>
      </nav>
      <div className="hero-media" aria-hidden="true">
        <div className="hero-media-inner">
          <img src={heroImage} alt="" width="1344" height="752" fetchPriority="high" />
        </div>
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-kicker mono">Lockhart, Texas · Small-batch smoke goods</p>
        <h1 className="hero-title display" aria-label="Fourteen hours over post oak">
          <span>Fourteen hours</span>
          <span className="hero-title-indent">over post oak.</span>
        </h1>
        <div className="hero-copy">
          <p>Rubs and sauces built to hold their ground through a full cook—coarse pepper, clean smoke, no shortcuts.</p>
          <div className="hero-actions">
            <a className="btn" href="#buy">Buy the Pit Box · $45</a>
            <a className="text-link" href="#lineup">Shop individual jars <span>→</span></a>
          </div>
        </div>
      </div>
      <p className="hero-proof mono">225°F / post oak / 14 hrs</p>
    </header>
  )
}
