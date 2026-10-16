import { useEffect, useRef, useState } from 'react'

/** Observes every .ds-reveal / .ds-stagger element and marks it visible once in view. */
export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    document.querySelectorAll('.ds-reveal, .ds-stagger').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Splits a string into words that blur/rise in sequence. */
export function WordReveal({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="ds-word" style={{ ['--i' as string]: i }}>
          {w}
          {'\u00A0'}
        </span>
      ))}
    </>
  )
}

/** Counts the numeric part of a metric up from zero when it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const match = value.match(/^([^\d-]*)(-?)([\d.]+)(.*)$/)
  const [display, setDisplay] = useState(match ? `${match[1]}${match[2]}0${match[4]}` : value)

  useEffect(() => {
    if (!match || !ref.current) return
    const [, pre, sign, num, post] = match
    const target = parseFloat(num)
    const decimals = num.includes('.') ? num.split('.')[1].length : 0
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1600)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(`${pre}${sign}${(target * eased).toFixed(decimals)}${post}`)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(ref.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <span ref={ref}>{display}</span>
}
