// Mobile + reduced-motion verification shots.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const outDir = process.argv[2] ?? 'shots'
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

// mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await mobile.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await mobile.waitForTimeout(2200)
await mobile.screenshot({ path: `${outDir}/m1-hero.png` })
const mOffsets = await mobile.evaluate(() => {
  const top = (sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY
  return { cook: top('.cook'), products: top('.products') }
})
await mobile.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), mOffsets.cook + 2800)
await mobile.waitForTimeout(1400)
await mobile.screenshot({ path: `${outDir}/m2-cook-wrap.png` })
await mobile.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), mOffsets.products - 40)
await mobile.waitForTimeout(1000)
await mobile.screenshot({ path: `${outDir}/m3-products.png` })
console.log('mobile done')

// reduced motion: static fallback must show all content
const rm = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  reducedMotion: 'reduce',
})
await rm.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await rm.waitForTimeout(1800)
await rm.screenshot({ path: `${outDir}/r1-hero.png` })
const rmCook = await rm.evaluate(
  () => document.querySelector('.cook').getBoundingClientRect().top + window.scrollY,
)
await rm.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), rmCook - 60)
await rm.waitForTimeout(600)
await rm.screenshot({ path: `${outDir}/r2-cook-static.png`, fullPage: false })
console.log('reduced motion done')

await browser.close()
