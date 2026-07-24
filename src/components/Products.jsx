import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import blackline from '../assets/generated/blackline-no1-tin.webp'
import yardbird from '../assets/generated/yardbird-no2-tin.webp'
import mop from '../assets/generated/mop-and-tang-no3-bottle.webp'
import burnt from '../assets/generated/burnt-end-no4-bottle.webp'

const PRODUCTS = [
  { num: '1', name: 'Blackline', sub: 'Beef rub', price: '$14', accent: '#ff5a1f', image: blackline, desc: '16-mesh pepper, kosher salt, oak-smoked paprika. Built for a brisket bark that stays put.' },
  { num: '2', name: 'Yardbird', sub: 'Poultry rub', price: '$12', accent: '#ffb25e', image: yardbird, desc: 'Honey powder, sage, and white pepper. Savory first, with enough sugar to crisp the skin.' },
  { num: '3', name: 'Mop & Tang', sub: 'Vinegar sauce', price: '$11', accent: '#e8935c', image: mop, desc: 'Cider vinegar and a slow cayenne burn. Thin on purpose—it works into pulled pork, not over it.' },
  { num: '4', name: 'Burnt End', sub: 'Molasses glaze', price: '$13', accent: '#c96f5a', image: burnt, desc: 'Molasses, espresso, and guajillo. Brush it on in the last hour for a dark mahogany lacquer.' },
]

export default function Products() {
  const root = useRef(null)
  useGSAP((_, contextSafe) => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.product', {
        autoAlpha: 0, y: 42, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.products-grid', start: 'top 78%', once: true },
      })
    })
    const enter = contextSafe((event) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.to(event.currentTarget.querySelector('.product-photo-inner'), { y: -8, scale: 1.015, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
    })
    const leave = contextSafe((event) => {
      gsap.to(event.currentTarget.querySelector('.product-photo-inner'), { y: 0, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
    })
    const products = root.current.querySelectorAll('.product')
    products.forEach((el) => {
      el.addEventListener('pointerenter', enter)
      el.addEventListener('pointerleave', leave)
    })
    return () => {
      mm.revert()
      products.forEach((el) => {
        el.removeEventListener('pointerenter', enter)
        el.removeEventListener('pointerleave', leave)
      })
    }
  }, { scope: root })

  return (
    <section className="products" ref={root} aria-labelledby="products-title" id="lineup">
      <header className="products-head">
        <p className="eyebrow">Numbered in the order they hit the pit</p>
        <h2 className="products-title display" id="products-title">The four<br />numbers.</h2>
        <p>Two before the fire. Two at the finish. Each earns its place in the box.</p>
      </header>
      <div className="products-grid">
        {PRODUCTS.map((product, index) => (
          <article className={`product product-${index + 1}`} key={product.num}>
            <div className="product-photo">
              <div className="product-photo-inner">
                <img src={product.image} alt={`${product.name} Nº ${product.num} ${product.sub}`} width="440" height="584" loading="lazy" />
              </div>
            </div>
            <div className="product-info">
              <div className="product-meta mono"><span>Nº {product.num} · {product.sub}</span><span>{product.price}</span></div>
              <h3 className="product-name display">{product.name}</h3>
              <p>{product.desc}</p>
              <a className="text-link product-link" href="#buy" aria-label={`View purchase options for ${product.name}`}>Purchase options <span>→</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
