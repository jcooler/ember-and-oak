import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tin, Bottle } from './ProductArt.jsx'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  {
    num: '1',
    name: 'BLACKLINE',
    sub: 'BEEF RUB',
    accent: '#ff5a1f',
    price: '$14',
    kind: 'tin',
    desc: 'Coarse 16-mesh pepper, kosher salt, oak-smoked paprika. The signature. Built for brisket bark.',
  },
  {
    num: '2',
    name: 'YARDBIRD',
    sub: 'POULTRY RUB',
    accent: '#ffb25e',
    price: '$12',
    kind: 'tin',
    desc: 'Honey powder, sage, white pepper. Crisps chicken skin like it has something to prove.',
  },
  {
    num: '3',
    name: 'MOP & TANG',
    sub: 'VINEGAR SAUCE',
    accent: '#e8935c',
    price: '$11',
    kind: 'bottle',
    desc: 'Carolina-style cider vinegar with a slow cayenne burn. Thin on purpose. It works, not coats.',
  },
  {
    num: '4',
    name: 'BURNT END',
    sub: 'MOLASSES GLAZE',
    accent: '#c96f5a',
    price: '$13',
    kind: 'bottle',
    desc: 'Molasses, espresso, guajillo. Lacquers ribs to a mahogany shine in the last hour.',
  },
]

export default function Products() {
  const root = useRef(null)

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.product', {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        })
        gsap.from('.products-head > *', {
          y: 36,
          autoAlpha: 0,
          duration: 0.8,
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
        gsap.from(['.products-head > *', '.product'], {
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

  // heat-bloom hover: the art lifts, an ember glow ignites underneath
  const onEnter = contextSafe((e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = e.currentTarget
    gsap.to(card.querySelector('.product-art'), {
      y: -14,
      rotation: -2,
      duration: 0.5,
      ease: 'power3.out',
    })
    gsap.to(card.querySelector('.product-glow'), {
      autoAlpha: 1,
      scale: 1.12,
      duration: 0.5,
      ease: 'power2.out',
    })
  })

  const onLeave = contextSafe((e) => {
    const card = e.currentTarget
    gsap.to(card.querySelector('.product-art'), {
      y: 0,
      rotation: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    gsap.to(card.querySelector('.product-glow'), {
      autoAlpha: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
  })

  return (
    <section className="products" ref={root} aria-labelledby="products-title" id="lineup">
      <div className="products-head">
        <div>
          <span className="eyebrow">numbered like we cook them</span>
          <h2 className="products-title display" id="products-title">
            The lineup
          </h2>
        </div>
        <p className="products-intro">
          Four numbers, one system: rub before the fire, sauce after it. Each one earned its
          spot across a season of fourteen-hour cooks.
        </p>
      </div>

      <div className="products-grid">
        {PRODUCTS.map((p) => (
          <article className="product" key={p.num} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <div className="product-art-wrap">
              <div className="product-glow" aria-hidden="true" />
              <div className="product-art">
                {p.kind === 'tin' ? <Tin id={p.num} {...p} /> : <Bottle id={p.num} {...p} />}
              </div>
            </div>
            <div className="product-num mono">
              <span>{`Nº ${p.num}`}</span>
              <span>{p.price}</span>
            </div>
            <h3 className="product-name">{p.name}</h3>
            <p className="product-desc">{p.desc}</p>
            <button
              className="product-add"
              type="button"
              aria-label={`Add ${p.name} ${p.sub.toLowerCase()} to box`}
            >
              Add to box
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
