import { useCallback, useEffect, useRef, useState } from 'react'
import { Heading, MonoLabel, SectionHeaderStack, SquareIconButton, TagPill, Text } from '../ds/primitives'
import { ArrowLeftGlyph, ArrowRightGlyph } from './BlueprintSchematic'

/* ------------------------------------------------------------------
 * EDIT HERE — the three roadmap phases.
 * ------------------------------------------------------------------ */
const ROADMAP_ITEMS = [
  {
    phase: 'PHASE 01',
    duration: '3 MONTHS',
    category: 'CAMPUS',
    title: 'Refinement & Grading Specs',
    description: 'Optimize intake ergonomics, de-labeling module, and AI purity scoring across controlled campus deployments; formalize grading specifications with downstream off-takers.',
    metricLabel: 'TARGET ACCURACY',
    metricValue: '>94.5% AI Purity',
  },
  {
    phase: 'PHASE 02',
    duration: '6 MONTHS',
    category: 'PILOT HUB',
    title: 'Commercial Pilot & Break-Even',
    description: 'Deploy in high-footfall hubs to surpass the operational break-even volume of 198 items/day (~135 PET bottles + 63 aluminum cans, recovering ~420 VND/item against ~83,000 VND/day OPEX) and maintain 95% PET purity.',
    metricLabel: 'BREAK-EVEN TARGET',
    metricValue: '198 items/day',
  },
  {
    phase: 'PHASE 03',
    duration: '12 MONTHS',
    category: '15-UNIT CLUSTER',
    title: '15-Unit Ward Cluster',
    description: 'Scale to a localized network of 15 RVM units within 1 HCMC Ward to optimize logistics routing, recovering ~3,825 kg/month (~18 m³ volume) at stabilized 49,000,000 VND/month logistics OPEX.',
    metricLabel: 'COLLECTION VOLUME',
    metricValue: '3,825 kg/mo',
  },
]

const COPIES = [0, 1, 2]
const CARD_GAP = 20
const DRAG_SENSITIVITY = 1.15
const FRICTION_PER_FRAME = 0.93 // at 60 Hz; applied time-based
const STOP_SPEED = 0.1 // px per 60 Hz frame
const FRAME_MS = 1000 / 60
const DRAG_THRESHOLD = 5
// Ease-out approximating cubic-bezier(0.16, 1, 0.3, 1).
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

export default function RoadmapCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stepRef = useRef(420 + CARD_GAP)
  const offsetRef = useRef(-(420 + CARD_GAP) * ROADMAP_ITEMS.length)
  const velocityRef = useRef(0) // px per ms
  const lastPointerXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const startXRef = useRef(0)
  const movedRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const rafIdRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const setWidth = () => stepRef.current * ROADMAP_ITEMS.length

  // Keep the offset within [-2·set, 0]; the copies are identical so wrapping is invisible.
  const wrapOffset = useCallback((value: number) => {
    const set = setWidth()
    let w = value
    while (w > 0) w -= set
    while (w < -set * 2) w += set
    return w
  }, [])

  const render = useCallback(() => {
    offsetRef.current = wrapOffset(offsetRef.current)
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`
  }, [wrapOffset])

  const cancelAnimation = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = 0
  }

  // Tween in unwrapped space and wrap on every frame, so crossing a copy boundary never jumps.
  const animateBy = useCallback((delta: number, duration: number) => {
    cancelAnimation()
    const from = offsetRef.current
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      offsetRef.current = from + delta * easeOut(t)
      render()
      rafIdRef.current = t < 1 ? requestAnimationFrame(tick) : 0
    }
    rafIdRef.current = requestAnimationFrame(tick)
  }, [render])

  const settle = useCallback(() => {
    const step = stepRef.current
    const target = Math.round(offsetRef.current / step) * step
    const delta = target - offsetRef.current
    if (Math.abs(delta) < 0.5) { offsetRef.current = target; render(); return }
    animateBy(delta, 400)
  }, [animateBy, render])

  const startMomentum = useCallback(() => {
    cancelAnimation()
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      offsetRef.current += velocityRef.current * dt
      velocityRef.current *= Math.pow(FRICTION_PER_FRAME, dt / FRAME_MS)
      render()
      if (Math.abs(velocityRef.current * FRAME_MS) < STOP_SPEED) {
        rafIdRef.current = 0
        settle()
        return
      }
      rafIdRef.current = requestAnimationFrame(tick)
    }
    rafIdRef.current = requestAnimationFrame(tick)
  }, [render, settle])

  // Measure the real card width + gap so wrapping stays correct at every breakpoint.
  useEffect(() => {
    const measure = () => {
      const card = trackRef.current?.firstElementChild as HTMLElement | null
      if (!card) return
      const prevStep = stepRef.current
      const nextStep = card.offsetWidth + CARD_GAP
      // Preserve the current card position when the step changes.
      offsetRef.current = (offsetRef.current / prevStep) * nextStep
      stepRef.current = nextStep
      render()
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current?.firstElementChild) ro.observe(trackRef.current.firstElementChild)
    return () => { ro.disconnect(); cancelAnimation() }
  }, [render])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if ((e.target as Element).closest('button, a, input, select, textarea')) return
    cancelAnimation()
    pointerIdRef.current = e.pointerId
    startXRef.current = e.clientX
    lastPointerXRef.current = e.clientX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0
    movedRef.current = false
    setIsDragging(true)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* unsupported */ }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return
    const now = performance.now()
    const deltaX = e.clientX - lastPointerXRef.current
    const deltaTime = Math.max(1, now - lastTimeRef.current)
    if (!movedRef.current && Math.abs(e.clientX - startXRef.current) > DRAG_THRESHOLD) movedRef.current = true
    offsetRef.current += deltaX * DRAG_SENSITIVITY
    // Smooth the measured velocity (px/ms, in track units).
    velocityRef.current = velocityRef.current * 0.2 + ((deltaX * DRAG_SENSITIVITY) / deltaTime) * 0.8
    lastPointerXRef.current = e.clientX
    lastTimeRef.current = now
    render()
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return
    pointerIdRef.current = null
    setIsDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* already released */ }
    // A pause before release means the user stopped — no fling.
    if (performance.now() - lastTimeRef.current > 80) velocityRef.current = 0
    if (movedRef.current) startMomentum()
  }

  // Suppress clicks that end a drag.
  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) { e.preventDefault(); e.stopPropagation(); movedRef.current = false }
  }

  const nudge = (dir: 1 | -1) => {
    velocityRef.current = 0
    // Snap from the nearest boundary so repeated clicks stay aligned.
    const step = stepRef.current
    const aligned = Math.round(offsetRef.current / step) * step
    animateBy(aligned - offsetRef.current - dir * step, 450)
  }

  return (
    <>
      <SectionHeaderStack
        className="ds-reveal"
        eyebrow="DEPLOYMENT ROADMAP"
        headline="From campus validation to urban cluster density"
        rightAction={
          <>
            <SquareIconButton variant="carousel-light" ariaLabel="Previous phase" onClick={() => nudge(-1)}><ArrowLeftGlyph /></SquareIconButton>
            <SquareIconButton variant="carousel-light" ariaLabel="Next phase" onClick={() => nudge(1)}><ArrowRightGlyph /></SquareIconButton>
          </>
        }
      />
      <div
        ref={viewportRef}
        className={`ds-rc-viewport ${isDragging ? 'is-dragging' : ''}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Deployment roadmap phases"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onClickCapture={onClickCapture}
      >
        <div ref={trackRef} className="ds-rc-track">
          {COPIES.map((copyIndex) =>
            ROADMAP_ITEMS.map((item, itemIndex) => (
              <article
                key={`${item.phase}-${copyIndex}-${itemIndex}`}
                className="ds-rc-card"
                aria-hidden={copyIndex !== 1}
              >
                <div className="flex items-center justify-between ds-gap-12">
                  <MonoLabel tone="graphite">{`${item.phase} · ${item.duration}`}</MonoLabel>
                  <TagPill variant="light-surface">{item.category}</TagPill>
                </div>
                <div className="flex flex-col ds-gap-16">
                  <Heading level={3} scale="subheading" tone="obsidian">{item.title}</Heading>
                  <Text tone="graphite">{item.description}</Text>
                </div>
                <div className="ds-rc-metric">
                  <MonoLabel tone="smoke">{item.metricLabel}</MonoLabel>
                  <Heading level={4} scale="heading-sm" tone="obsidian">{item.metricValue}</Heading>
                </div>
              </article>
            )),
          )}
        </div>
      </div>
    </>
  )
}
