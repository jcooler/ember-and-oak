import { useEffect, useRef } from 'react'

// Ambient ember particles + drifting smoke, canvas-based.
// Skipped entirely under prefers-reduced-motion; paused when offscreen.

const EMBER_COLORS = ['#ff5a1f', '#ffb25e', '#ff8a3d', '#e8935c']

export default function Embers({ emberCount = 46, smokeCount = 9 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, raf
    let running = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const rand = (a, b) => a + Math.random() * (b - a)

    const makeEmber = (seedY) => ({
      x: rand(0, width),
      y: seedY ? rand(0, height) : height + rand(0, 40),
      r: rand(1, 2.6),
      vy: rand(0.25, 0.9),
      vx: rand(-0.15, 0.15),
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.005, 0.02),
      color: EMBER_COLORS[(Math.random() * EMBER_COLORS.length) | 0],
      alpha: rand(0.35, 0.9),
      flicker: rand(0.02, 0.08),
    })

    const makeSmoke = () => ({
      x: rand(0, width),
      y: rand(height * 0.35, height + 100),
      r: rand(90, 220),
      vy: rand(0.1, 0.28),
      vx: rand(-0.08, 0.12),
      alpha: rand(0.025, 0.06),
      grow: rand(0.05, 0.15),
    })

    const embers = Array.from({ length: emberCount }, () => makeEmber(true))
    const smokes = Array.from({ length: smokeCount }, makeSmoke)

    const tick = () => {
      ctx.clearRect(0, 0, width, height)

      for (const s of smokes) {
        s.y -= s.vy
        s.x += s.vx
        s.r += s.grow
        if (s.y + s.r < 0) Object.assign(s, makeSmoke(), { y: height + s.r })
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
        g.addColorStop(0, `rgba(163, 154, 143, ${s.alpha})`)
        g.addColorStop(1, 'rgba(163, 154, 143, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const e of embers) {
        e.y -= e.vy
        e.wobble += e.wobbleSpeed
        e.x += e.vx + Math.sin(e.wobble) * 0.3
        e.alpha += rand(-e.flicker, e.flicker)
        e.alpha = Math.max(0.1, Math.min(0.95, e.alpha))
        if (e.y < -10) Object.assign(e, makeEmber(false))
        ctx.globalAlpha = e.alpha
        ctx.fillStyle = e.color
        ctx.shadowColor = e.color
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.01,
    })
    io.observe(canvas)
    window.addEventListener('resize', resize)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [emberCount, smokeCount])

  return <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true" />
}
