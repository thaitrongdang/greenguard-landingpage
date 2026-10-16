import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Sticky "curtain" layer. Each layer scrolls normally until its bottom meets the
 * viewport bottom, then pins (top = viewport height − layer height) so the next
 * layer slides over it. Tall layers (e.g. the hero's internal sticky track) keep
 * their full scroll length because the pin only engages at their end.
 */
export default function StackLayer({
  z,
  tone,
  first = false,
  children,
}: {
  z: number
  tone: 'obsidian' | 'white' | 'soft-stone' | 'soft-mist' | 'pale-stone'
  first?: boolean
  children: ReactNode
}) {
  const layerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    const inner = innerRef.current
    if (!layer || !inner) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const measure = () => {
      layer.style.setProperty('--stack-top', `${Math.min(0, window.innerHeight - layer.offsetHeight)}px`)
    }

    const update = () => {
      raf = 0
      const next = layer.nextElementSibling as HTMLElement | null
      if (!next || reduced) return
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / vh))
      if (p <= 0) {
        inner.style.transform = ''
        inner.style.filter = ''
        return
      }
      inner.style.transform = `scale(${(1 - 0.03 * p).toFixed(4)})`
      inner.style.filter = `brightness(${(1 - 0.08 * p).toFixed(4)})`
    }

    const request = () => { if (!raf) raf = requestAnimationFrame(update) }
    const ro = new ResizeObserver(() => { measure(); request() })
    ro.observe(layer)
    measure()
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={layerRef} className={`ds-stack ds-stack--${tone} ${first ? 'is-first' : ''}`} style={{ zIndex: z }}>
      <div ref={innerRef} className="ds-stack-inner">{children}</div>
    </div>
  )
}
