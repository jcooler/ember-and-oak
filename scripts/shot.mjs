// Screenshot the page at key scroll positions for design critique.
// Usage: node scripts/shot.mjs [outDir]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const outDir = process.argv[2] ?? 'shots'
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500) // fonts + hero intro

const shot = async (name) => {
  await page.screenshot({ path: `${outDir}/${name}.png` })
  console.log(`saved ${name}`)
}

await shot('01-hero')

// scroll helper: instant jumps, then settle so scrub (0.6) catches up
const scrollTo = async (y) => {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await page.waitForTimeout(1400)
}

// section offsets
const offsets = await page.evaluate(() => {
  const top = (sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY
  return {
    philosophy: top('.philosophy'),
    cook: top('.cook'),
    products: top('.products'),
    buy: top('.buy'),
    max: document.documentElement.scrollHeight - innerHeight,
  }
})

await scrollTo(offsets.philosophy - 120)
await shot('02-philosophy')

// pinned cook section: 4600px of scrub after its top
const cookStart = offsets.cook
for (const [name, frac] of [
  ['03-cook-start', 0.02],
  ['04-cook-stall', 0.4],
  ['05-cook-wrap', 0.62],
  ['06-cook-tender', 0.82],
  ['07-cook-rest', 0.985],
]) {
  await scrollTo(cookStart + 4600 * frac)
  await shot(name)
}

await scrollTo(offsets.products - 60)
await shot('08-products')

// hover state on second product
await page.hover('.product:nth-child(2)')
await page.waitForTimeout(700)
await shot('09-product-hover')

await scrollTo(offsets.max)
await shot('10-buy')

await browser.close()
