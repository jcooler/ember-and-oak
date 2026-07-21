// Full-page axe audit. Runs under emulated reduced motion so GSAP reveals
// are once-only fades that complete: axe then measures steady-state colors
// instead of mid-animation blends (and skips visibility:hidden elements).
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto('http://localhost:5199', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

// walk the page so every scroll-triggered reveal has played
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
for (let y = 0; y <= max; y += 500) {
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await page.waitForTimeout(120)
}
await page.waitForTimeout(1200)
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(800)

await page.evaluate(axeSource)
const results = await page.evaluate(async () => {
  return await axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
  })
})

for (const v of results.violations) {
  console.log(`\n[${v.impact}] ${v.id}: ${v.help}`)
  for (const n of v.nodes) {
    console.log(`  - ${n.target.join(' ')}`)
    console.log(`    ${n.failureSummary.replace(/\n/g, '\n    ')}`)
  }
}
console.log(`\n${results.violations.length} violation type(s), ${results.violations.reduce((a, v) => a + v.nodes.length, 0)} node(s)`)

// Also report elements axe could not conclusively check for contrast
const incomplete = results.incomplete.filter((i) => i.id === 'color-contrast')
for (const v of incomplete) {
  console.log(`\n[incomplete] ${v.id}:`)
  for (const n of v.nodes) console.log(`  - ${n.target.join(' ')} :: ${n.any[0]?.message ?? ''}`)
}

await browser.close()
