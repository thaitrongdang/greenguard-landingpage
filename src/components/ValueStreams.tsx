import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------
 * EDIT HERE — the four B2B value streams (single source of truth).
 * ------------------------------------------------------------------ */
type Metric = { value: string; label: string }
type Stream = {
  id: string
  tab: string
  command: string
  headline: string
  status: string
  rows: { code: string; label: string; value: string }[]
  metrics: [Metric, Metric]
  partnerContext: string
}

const STREAMS: Stream[] = [
  {
    id: 'pet',
    tab: 'Bottle-to-Bottle Recyclers',
    command: 'greenguard telemetry --stream pet_high_purity --spec "food_grade >= 95%" --target duytan',
    headline: 'Purity Compliance ≥ 95%',
    status: '✓ SPEC CERTIFIED',
    rows: [
      { code: '#01', label: 'MATERIAL', value: 'Uncontaminated Post-Consumer PET' },
      { code: '#02', label: 'PURITY GRADE', value: 'Food-grade ready (De-labeled & Ring-free)' },
      { code: '#03', label: 'TARGET BUYER', value: 'Duy Tan Recycling (100K t/yr capacity)' },
      { code: '#04', label: 'MANDATE', value: 'EU PPWR 2030 (30% recycled content)' },
    ],
    metrics: [{ value: '100K t/yr', label: 'DUY TAN TARGET CAPACITY' }, { value: '30%', label: 'EU MANDATE BY 2030' }],
    partnerContext: 'epr-offtake',
  },
  {
    id: 'aluminum',
    tab: 'Aluminum Consolidators',
    command: 'greenguard compaction --stream can_aluminum --ratio "1:4" --purity ">95%"',
    headline: 'Compacted Volume Ratio 1:4',
    status: '✓ INGOT COMPLIANT',
    rows: [
      { code: '#01', label: 'MATERIAL', value: 'High-Density Crushed Aluminum UBC' },
      { code: '#02', label: 'BULK DENSITY', value: '~140 kg/m³ (9.3 cans per liter)' },
      { code: '#03', label: 'TARGET OFF-TAKER', value: 'LAGOM Vietnam / Viet Duc Scrap' },
      { code: '#04', label: 'ENERGY SAVING', value: '95% energy saved vs. primary smelter' },
    ],
    metrics: [{ value: '9B Cans', label: 'VN ANNUAL CAN MARKET' }, { value: '-95%', label: 'SMELTING ENERGY SAVED' }],
    partnerContext: 'epr-offtake',
  },
  {
    id: 'epr',
    tab: 'FMCG & EPR Compliance',
    command: 'greenguard audit --framework "EPR_ND08_ND110" --client "FMCG_PRO_VN" --status certified',
    headline: 'Verifiable EPR Audit Trail',
    status: '✓ AUDIT VERIFIED',
    rows: [
      { code: '#01', label: 'FRAMEWORK', value: 'Decree 08/2022 & Decree 110/2026' },
      { code: '#02', label: 'PARTNERS', value: 'PRO Vietnam, Coca-Cola, Suntory, Heineken' },
      { code: '#03', label: 'DATA METRICS', value: 'Timestamp, GPS coords, material purity log' },
      { code: '#04', label: 'COST SAVINGS', value: 'Bypasses 435K VND/t penalty payment' },
    ],
    metrics: [{ value: '<0.2s', label: 'EDGE PROCESSING LATENCY' }, { value: '100%', label: 'TRACEABLE EPR RECEIPTS' }],
    partnerContext: 'fmcg-epr',
  },
  {
    id: 'campus',
    tab: 'High-Footfall Campuses',
    command: 'greenguard fleet --density "15_rvm_cluster" --logistics "-70%_trips" --uptime 100%',
    headline: 'Logistics Overhead Reduction: -70%',
    status: '✓ FLEET DEPLOYED',
    rows: [
      { code: '#01', label: 'LOCATION HUBS', value: 'Universities, transit hubs, canteens, malls' },
      { code: '#02', label: 'COMPACTION', value: 'Reduces emptying trips from 22 to 7/week' },
      { code: '#03', label: 'USER LOOP', value: 'Dynamic point scoring for brand vouchers' },
      { code: '#04', label: 'UNIT ECONOMICS', value: '12.18 mos payback period, 158% IRR' },
    ],
    metrics: [{ value: '-70%', label: 'LOGISTICS TRIPS CUT' }, { value: '12.18 Mo', label: 'DISCOUNTED PAYBACK (DPP)' }],
    partnerContext: 'campus-cluster',
  },
]

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Typewriter — retypes the command whenever it changes. */
function useTypewriter(text: string, speed = 18) {
  const [out, setOut] = useState(text)
  const [typing, setTyping] = useState(false)
  useEffect(() => {
    if (prefersReduced()) { setOut(text); setTyping(false); return }
    let n = 0
    setOut('')
    setTyping(true)
    const t = window.setInterval(() => {
      n += 1
      setOut(text.slice(0, n))
      if (n >= text.length) { window.clearInterval(t); setTyping(false) }
    }, speed)
    return () => window.clearInterval(t)
  }, [text, speed])
  return { out, typing }
}

/* Counts the leading number up; the final render is always the exact source string. */
function CountMetric({ value }: { value: string }) {
  const match = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/.exec(value)
  const [display, setDisplay] = useState(value)
  useEffect(() => {
    if (!match || prefersReduced()) { setDisplay(value); return }
    const [, prefix, num, suffix] = match
    const target = parseFloat(num)
    const decimals = num.includes('.') ? num.split('.')[1].length : 0
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700)
      const e = 1 - Math.pow(1 - t, 3)
      if (t >= 1) { setDisplay(value); return }
      setDisplay(`${prefix}${(target * e).toFixed(decimals)}${suffix}`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <>{display}</>
}

function StreamTabs({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const [bar, setBar] = useState({ y: 0, h: 0 })
  useEffect(() => {
    const sync = () => {
      const el = refs.current[active]
      if (el) setBar({ y: el.offsetTop, h: el.offsetHeight })
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [active])

  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (active + dir + STREAMS.length) % STREAMS.length
    onSelect(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="ds-vt-tabs" role="tablist" aria-orientation="vertical" aria-label="Value streams" onKeyDown={onKey}>
      <span className="ds-vt-indicator" aria-hidden="true" style={{ transform: `translateY(${bar.y}px)`, height: bar.h }} />
      {STREAMS.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => { refs.current[i] = el }}
          type="button"
          role="tab"
          id={`vt-tab-${s.id}`}
          aria-selected={i === active}
          aria-controls="vt-panel"
          tabIndex={i === active ? 0 : -1}
          className={`ds-vt-tab ${i === active ? 'is-active' : ''}`}
          onClick={() => onSelect(i)}
        >
          {s.tab}
        </button>
      ))}
    </div>
  )
}

function TerminalCard({ stream, onDiscuss }: { stream: Stream; onDiscuss: (context: string) => void }) {
  const { out, typing } = useTypewriter(stream.command)
  return (
    <div id="vt-panel" role="tabpanel" aria-labelledby={`vt-tab-${stream.id}`} className="ds-vt-card">
      {/* Tier 1 — CLI protocol bar */}
      <div className="ds-vt-cli">
        <code className="ds-vt-cmd" aria-label={stream.command}>
          <span className="ds-vt-prompt">$</span> {out}
          <span className={`ds-vt-caret ${typing ? 'is-typing' : ''}`} aria-hidden="true" />
        </code>
        <span className="ds-vt-live"><span className="ds-vt-dot" aria-hidden="true" />LIVE TELEMETRY</span>
      </div>

      {/* Tier 2 — headline + status, Tier 3 — parameters: keyed so they re-enter on change */}
      <div key={stream.id} className="ds-vt-body">
        <div className="ds-vt-head ds-vt-reveal">
          <p className="ds-vt-headline">{stream.headline}</p>
          <span className="ds-vt-badge">{stream.status}</span>
        </div>
        <div className="ds-vt-table" role="table" aria-label="Technical parameters">
          {stream.rows.map((r, n) => (
            <div key={r.code} role="row" className="ds-vt-row ds-vt-reveal" style={{ ['--vt-delay' as string]: `${80 + n * 55}ms` }}>
              <span role="cell" className="ds-vt-code">{r.code}</span>
              <span role="rowheader" className="ds-vt-key">{r.label}</span>
              <span role="cell" className="ds-vt-val">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 4 — metrics + CTA */}
      <div className="ds-vt-foot">
        <div className="ds-vt-metrics">
          {stream.metrics.map((m) => (
            <div key={`${stream.id}-${m.label}`} className="ds-vt-metric ds-vt-reveal" style={{ ['--vt-delay' as string]: '320ms' }}>
              <span className="ds-vt-num"><CountMetric value={m.value} /></span>
              <span className="ds-vt-label">{m.label}</span>
            </div>
          ))}
        </div>
        <button type="button" className="ds-vt-cta" onClick={() => onDiscuss(stream.partnerContext)}>
          Discuss this value stream ›
        </button>
      </div>
    </div>
  )
}

export default function ValueStreams({ onDiscuss }: { onDiscuss: (context: string) => void }) {
  const [active, setActive] = useState(0)
  return (
    <section id="value-streams" data-surface="light" className="ds-vt-section ds-surface-soft-mist">
      <div className="ds-vt-grid">
        <div className="ds-vt-left">
          <span className="ds-vt-eyebrow">B2B CIRCULAR INFRASTRUCTURE</span>
          <p className="ds-vt-title">Standardized circular infrastructure for</p>
          <StreamTabs active={active} onSelect={setActive} />
        </div>
        <TerminalCard stream={STREAMS[active]} onDiscuss={onDiscuss} />
      </div>
    </section>
  )
}
