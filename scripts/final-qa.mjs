import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('final-shots', { recursive: true })
const browser = await chromium.launch()
const cases = [
  ['mobile', 375, 812, false],
  ['tablet', 768, 1024, false],
  ['desktop', 1440, 1000, false],
  ['wide', 1920, 1080, false],
  ['reduced', 1440, 1000, true],
]
const report = []

for (const [name, width, height, reduced] of cases) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    hasTouch: width <= 768,
  })
  const consoleErrors = []
  const failed = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request) => failed.push(`${request.method()} ${request.url()}`))
  const response = await page.goto('http://127.0.0.1:5199', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.querySelector('.hero-media img')?.complete)
  await page.waitForTimeout(1800)
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    images: [...document.images].map((image) => ({ alt: image.alt, width: image.naturalWidth, height: image.naturalHeight })),
    headings: [...document.querySelectorAll('h1,h2,h3')].map((heading) => `${heading.tagName}:${heading.textContent.trim().replace(/\s+/g, ' ')}`),
    buttons: [...document.querySelectorAll('a,button')].map((el) => {
      const rect = el.getBoundingClientRect()
      return { text: el.textContent.trim().replace(/\s+/g, ' '), width: Math.round(rect.width), height: Math.round(rect.height) }
    }),
  }))
  await page.screenshot({ path: `final-shots/${name}-hero.png` })
  await page.locator('#lineup').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1400)
  await page.screenshot({ path: `final-shots/${name}-products.png` })
  await page.locator('#buy').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `final-shots/${name}-buy.png` })
  metrics.images = await page.evaluate(() => [...document.images].map((image) => ({
    alt: image.alt,
    width: image.naturalWidth,
    height: image.naturalHeight,
  })))
  await page.keyboard.press('Home')
  await page.keyboard.press('Tab')
  const focus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }))
  report.push({ name, status: response?.status(), consoleErrors, failed, metrics, focus })
  await page.close()
}

console.log(JSON.stringify(report, null, 2))
await browser.close()
