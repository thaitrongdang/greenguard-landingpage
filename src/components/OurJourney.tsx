import { useEffect, useRef, useState } from 'react'
import { Heading, MonoLabel, Text } from '../ds/primitives'
import OrbitImages from './OrbitImages/OrbitImages'

/* ------------------------------------------------------------------
 * EDIT HERE — journey stages (placeholder copy) and their images.
 * Order, text and images can be changed without touching the animation.
 * ------------------------------------------------------------------ */
export const JOURNEY_STAGES = [
  {
    id: 'discover',
    label: 'Discover',
    title: 'Listening to the waste stream',
    description: 'Placeholder — describe how the problem was first understood.',
    image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageAlt: 'A pile of discarded plastic bottles and aluminum cans',
  },
  {
    id: 'build',
    label: 'Build',
    title: 'Turning insight into hardware',
    description: 'Placeholder — describe the first prototypes and engineering work.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageAlt: 'An engineer measuring technical drawings with a caliper',
  },
  {
    id: 'validate',
    label: 'Validate',
    title: 'Testing where people are',
    description: 'Placeholder — describe how the concept was tested in the field.',
    image: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageAlt: 'Students walking across a university campus',
  },
  {
    id: 'refine',
    label: 'Refine',
    title: 'Sharpening every detail',
    description: 'Placeholder — describe what was learned and improved.',
    image: 'https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageAlt: 'Rows of blue-labeled plastic bottles',
  },
  {
    id: 'scale',
    label: 'Scale',
    title: 'Growing with the city',
    description: 'Placeholder — describe the path toward wider deployment.',
    image: 'https://images.unsplash.com/photo-1602646994030-464f98de5e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imageAlt: 'Aerial view of dense city buildings',
  },
]

const ORBIT_IMAGES = JOURNEY_STAGES.map((stage) => ({ src: stage.image, alt: stage.imageAlt }))

export default function OurJourney() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Scroll drives the central text stages; the orbit runs on its own loop.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const count = JOURNEY_STAGES.length
    let raf = 0

    const update = () => {
      raf = 0
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const p = Math.min(1, Math.max(0, -rect.top / total))

      const s = Math.min(count - 0.5, Math.max(0.5, p * count))
      stageRefs.current.forEach((el, i) => {
        if (!el) return
        const d = s - (i + 0.5)
        const o = Math.min(1, Math.max(0, 1.6 - Math.abs(d) * 3))
        el.style.opacity = o.toFixed(3)
        el.style.transform = reduced ? 'none' : `translate3d(0, ${(-d * 28).toFixed(1)}px, 0)`
        el.style.visibility = o > 0.01 ? 'visible' : 'hidden'
        el.setAttribute('aria-hidden', o > 0.5 ? 'false' : 'true')
      })
      const active = Math.min(count - 1, Math.floor(p * count))
      if (counterRef.current) counterRef.current.textContent = `0${active + 1} / 0${count}`
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`
    }

    const request = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
    }
  }, [])

  const center = (
    <div className="ds-journey-center">
      <MonoLabel tone="forest">OUR JOURNEY</MonoLabel>
      <div className="ds-journey-stages">
        {JOURNEY_STAGES.map((stage, i) => (
          <div key={stage.id} ref={(el) => { stageRefs.current[i] = el }} className="ds-journey-stage">
            <MonoLabel tone="smoke">{`STAGE 0${i + 1} · ${stage.label.toUpperCase()}`}</MonoLabel>
            <Heading level={2} scale="heading-lg" tone="obsidian">{stage.title}</Heading>
            <Text tone="graphite">{stage.description}</Text>
          </div>
        ))}
      </div>
      <div className="ds-journey-progress">
        <MonoLabel tone="forest"><span ref={counterRef}>01 / 05</span></MonoLabel>
        <span className="ds-journey-bar"><span ref={barRef} /></span>
      </div>
    </div>
  )

  return (
    <section id="our-journey" data-surface="light" className="ds-surface-sandstone-wash">
      <div ref={trackRef} className="ds-journey-track">
        <div className="ds-journey-viewport">
          <OrbitImages
            className="ds-journey-orbit"
            images={ORBIT_IMAGES}
            shape="ellipse"
            baseWidth={1400}
            radiusX={compact ? 360 : 600}
            radiusY={compact ? 520 : 300}
            rotation={-8}
            duration={40}
            itemSize={compact ? 200 : 220}
            depth={0.6}
            itemRadius="var(--radius-nested-cards)"
            shadow={0}
            showPath
            pathColor="currentColor"
            pathWidth={1}
            pathDash={4}
            width="100%"
            height="100%"
            centerContent={center}
          />
        </div>
      </div>
    </section>
  )
}
