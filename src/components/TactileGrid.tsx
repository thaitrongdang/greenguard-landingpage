import { useEffect, useRef, useState } from 'react'
import { InteractiveTrigger } from '../ds/primitives'
import journeyImg1 from '../assets/journey/demo-idea.png'
import journeyImg2 from '../assets/journey/users-interview.png'
import journeyImg3 from '../assets/journey/software-development.png'
import journeyImg4 from '../assets/journey/round-2-university.jpg'
import journeyImg5 from '../assets/journey/round-2-u-i-dow-track.jpg'
import journeyImg6 from '../assets/journey/duy-tan-recycling-field-trip.jpg'
import journeyImg7 from '../assets/journey/completing-the-rvm.jpg'
import journeyImg8 from '../assets/journey/testing-rvm.jpg'
import journeyImg9 from '../assets/journey/round-3-pitching.jpg'
import journeyImg10 from '../assets/journey/top-4-u-i-dow-track-bki.jpg'

/* ------------------------------------------------------------------
 * EDIT HERE — the ten journey milestones (order matters).
 * `accent` references a palette token; `image` can be swapped freely.
 * ------------------------------------------------------------------ */

export const JOURNEY_ITEMS = [
  { title: 'Demo Idea', accent: 'var(--color-warm-sandstone)', image: journeyImg1, alt: 'Demo Idea' },
  { title: 'Users Interview', accent: 'var(--color-dusty-iris)', image: journeyImg2, alt: 'Users Interview' },
  { title: 'Software Development', accent: 'var(--color-slate-blue)', image: journeyImg3, alt: 'Software Development' },
  { title: 'Round 2 University', accent: 'var(--color-journey-iris)', image: journeyImg4, alt: 'Round 2 University' },
  { title: 'Round 2 U-I Dow track', accent: 'var(--color-guard-green)', image: journeyImg5, alt: 'Round 2 U-I Dow track' },
  { title: 'Duy Tan Recycling Field Trip', accent: 'var(--color-warm-sandstone)', image: journeyImg6, alt: 'Duy Tan Recycling Field Trip' },
  { title: 'Completing the RVM', accent: 'var(--color-forest-sovereignty)', image: journeyImg7, alt: 'Completing the RVM' },
  { title: 'Testing RVM', accent: 'var(--color-slate-blue)', image: journeyImg8, alt: 'Testing RVM' },
  { title: 'Round 3 Pitching', accent: 'var(--color-journey-iris)', image: journeyImg9, alt: 'Round 3 Pitching' },
  { title: 'Top 4 U-I Dow track BKI', accent: 'var(--color-guard-green)', image: journeyImg10, alt: 'Top 4 U-I Dow track BKI' },
]

const COUNT = JOURNEY_ITEMS.length
// 0.00035 / frame and 0.000006 / frame at 60 Hz, expressed per millisecond.
const SPEED_NORMAL = (0.00035 * 60) / 1000
const SPEED_HOVER = (0.000006 * 60) / 1000
const AUTO_ADVANCE_MS = 2600

// Fixed per-item radial offsets so the loop feels organic but stays stable.
const RADIAL_JITTER = [0, 14, -10, 16, -8, 12, -12, 10, -6, 15]

export default function TactileGrid() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hovering, setHovering] = useState(false)
  const hoveredIndexRef = useRef(-1)
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const hoverRef = useRef(false)
  const rafRef = useRef(0)

  useEffect(() => { hoverRef.current = hovering }, [hovering])

  // Orbit loop — writes transforms directly so React doesn't re-render per frame.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let progress = 0
    let speed = reduced ? 0 : SPEED_NORMAL
    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const target = reduced ? 0 : hoverRef.current ? SPEED_HOVER : SPEED_NORMAL
      speed += (target - speed) * Math.min(1, dt / 90)
      progress = (progress + speed * dt) % 1

      const section = sectionRef.current
      const vw = section?.clientWidth ?? window.innerWidth
      const vh = section?.clientHeight ?? window.innerHeight
      const baseRx = Math.min(vw * 0.37, 450)
      const baseRy = Math.min(vh * 0.35, 275)
      const ks = Math.min(1, Math.max(0.5, vw / 1180))

      for (let i = 0; i < COUNT; i++) {
        const el = itemRefs.current[i]
        if (!el) continue
        // Full 360° ellipse, starting at the bottom and travelling clockwise.
        const u = (i / COUNT + progress) % 1
        const angleRad = (((u * 360 + 90) % 360) * Math.PI) / 180
        const jitter = RADIAL_JITTER[i] * ks
        const x = Math.cos(angleRad) * (baseRx + jitter)
        const y = Math.sin(angleRad) * (baseRy + jitter * 0.6)
        // Left ≈ 136px, bottom/top centre ≈ 97px, right ≈ 58px.
        const horizontalFactor = (1 - Math.cos(angleRad)) * 0.5
        const size = Math.round((58 + horizontalFactor * 78) * ks)
        el.style.width = `${size}px`
        el.style.height = `${size}px`
        el.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px, 0)`
        // Outer wrapper only: orbit position + stacking. Hover scale lives on the inner layer.
        el.style.zIndex = hoveredIndexRef.current === i ? '60' : String(10 + Math.round(size / 20))
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Auto-advance the milestone ticker while nothing is hovered.
  useEffect(() => {
    if (hovering) return
    const t = window.setInterval(() => setActiveIndex((i) => (i + 1) % COUNT), AUTO_ADVANCE_MS)
    return () => window.clearInterval(t)
  }, [hovering])

  const active = JOURNEY_ITEMS[activeIndex]

  return (
    <section ref={sectionRef} id="our-journey" data-surface="light" className="ds-tg-section ds-surface-soft-mist">
      <div className="ds-tg-orbit">
        {JOURNEY_ITEMS.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => { itemRefs.current[i] = el }}
            className="ds-tg-item"
            onMouseEnter={() => { hoveredIndexRef.current = i; hoverRef.current = true; setHovering(true); setActiveIndex(i) }}
            onMouseLeave={() => { hoveredIndexRef.current = -1; hoverRef.current = false; setHovering(false) }}
            onClick={() => setActiveIndex(i)}
          >
            <div className={`ds-tg-zoom ${hovering && activeIndex === i ? 'is-hovered' : ''}`}>
              <img src={item.image} alt={item.title} loading="lazy" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="ds-tg-center">
        <p className="ds-tg-title">Our Journey</p>
        <div className="ds-tg-ticker" aria-live="polite">
          <div className="ds-tg-stack" style={{ transform: `translateY(-${activeIndex * 46}px)` }}>
            {JOURNEY_ITEMS.map((item, i) => (
              <span key={item.title} className="ds-tg-row" style={{ color: item.accent }} aria-hidden={i !== activeIndex}>
                {item.title}
              </span>
            ))}
          </div>
        </div>
        <InteractiveTrigger
          className="ds-tg-cta"
          ariaLabel={`Explore milestone: ${active.title}`}
          onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explore Milestone
        </InteractiveTrigger>
      </div>
    </section>
  )
}
