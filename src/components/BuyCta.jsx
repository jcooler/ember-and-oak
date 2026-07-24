import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import pitBox from '../assets/generated/pit-box-four-product-set.webp'

export default function BuyCta() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.buy-reveal', {
        autoAlpha: 0, y: 38, duration: 0.85, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="buy" ref={root} aria-labelledby="buy-title" id="buy">
      <div className="buy-image buy-reveal">
        <img src={pitBox} alt="Pit Box with two rub tins and two sauce bottles packed in peach butcher paper" width="1168" height="880" loading="lazy" />
        <span className="buy-stamp mono">4 products / 1 box</span>
      </div>
      <div className="buy-copy">
        <span className="eyebrow buy-reveal">For the next long Saturday</span>
        <h2 className="buy-title display buy-reveal" id="buy-title">The<br />Pit Box.</h2>
        <p className="buy-price display buy-reveal">$45</p>
        <p className="buy-reveal">Blackline, Yardbird, Mop &amp; Tang, and Burnt End—packed with folded peach butcher paper.</p>
        <ul className="buy-list mono buy-reveal" aria-label="Pit Box contents">
          <li>2 × 4 oz rub tins</li><li>2 × 12 oz sauces</li><li>Peach butcher paper</li>
        </ul>
        <a className="btn buy-reveal" href="mailto:pit@emberandoak.com?subject=Pit%20Box%20order">Order the Pit Box</a>
        <p className="buy-shipping mono buy-reveal">Ships Mondays · free U.S. shipping over $40</p>
      </div>
    </section>
  )
}
