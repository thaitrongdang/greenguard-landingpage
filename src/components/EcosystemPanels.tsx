import { useEffect, useRef } from 'react'
import appScreen from '../assets/ecosystem/App.jpg'
import dashboardScreen from '../assets/ecosystem/Dashboard.jpg'
import { GREENGUARD_DASHBOARD_URL, GREENPOINT_APP_URL } from '../config/links'

const RVM_VIDEO =
  'https://player.vimeo.com/video/1236225155?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1'
const RVM_FULL_DEMO_URL = 'https://vimeo.com/1236225155'

const LERP = 0.08

function PhoneMock() {
  return (
    <div className="ds-eco-phone">
      <span className="ds-eco-island" aria-hidden="true" />
      <div className="ds-eco-phone-display">
        <img src={appScreen} alt="GreenPoint app home screen showing Green Points balance, progress to Gold tier and recycling impact" loading="lazy" draggable={false} />
      </div>
    </div>
  )
}

function LaptopMock() {
  return (
    <div className="ds-eco-laptop">
      <div className="ds-eco-lid">
        <span className="ds-eco-sensor" aria-hidden="true" />
        <div className="ds-eco-laptop-display">
          <div className="ds-eco-dash-bar">
            <span>CLUSTER: HCMUT_D10</span>
            <span className="ds-eco-live"><span className="ds-eco-dot" aria-hidden="true" />LIVE TELEMETRY</span>
            <span>LATENCY: &lt;0.2s</span>
          </div>
          <img src={dashboardScreen} alt="GreenGuard AI dashboard with daily intake, sorting purity, bin capacity and live AI event stream" loading="lazy" draggable={false} />
        </div>
      </div>
      <div className="ds-eco-base" aria-hidden="true"><span /></div>
    </div>
  )
}

export default function EcosystemPanels() {
  const containerRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!container || !viewport || !track) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let maxX = 0
    let scrollSpan = 1
    let target = 0
    let current = 0
    let raf = 0

    const measure = () => {
      if (!desktop.matches) { track.style.transform = ''; maxX = 0; return }
      const cs = getComputedStyle(viewport)
      const available = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      maxX = Math.max(0, track.scrollWidth - available)
      scrollSpan = Math.max(1, container.offsetHeight - window.innerHeight)
      readTarget()
      current = target
      apply()
    }
    const readTarget = () => {
      target = Math.min(1, Math.max(0, -container.getBoundingClientRect().top / scrollSpan))
    }
    const apply = () => { track.style.transform = `translate3d(${(-current * maxX).toFixed(2)}px, 0, 0)` }
    const loop = () => {
      raf = 0
      current += (target - current) * (reduced ? 1 : LERP)
      if (Math.abs(target - current) < 0.0005) current = target
      apply()
      if (current !== target) raf = requestAnimationFrame(loop)
    }
    const onScroll = () => {
      if (!desktop.matches) return
      readTarget()
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(viewport)
    document.fonts?.ready.then(measure)
    desktop.addEventListener('change', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    measure()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      desktop.removeEventListener('change', measure)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section ref={containerRef} id="ecosystem" data-surface="light" className="ds-eco">
      <div ref={viewportRef} className="ds-eco-viewport">
        <header className="ds-eco-header">
          <span className="ds-eco-eyebrow">FULL-SERVICE CIRCULAR OPERATOR</span>
          <h2 className="ds-eco-title">Beyond selling hardware. We own the entire sorting and data loop.</h2>
        </header>

        <div ref={trackRef} className="ds-eco-track">
          <article className="ds-eco-panel ds-eco-panel--fleet">
            <span className="ds-eco-num" aria-hidden="true">01</span>
            <div className="ds-eco-stage">
              <div className="ds-eco-bezel">
                <iframe
                  src={RVM_VIDEO}
                  title="GreenGuard RVM Hardware Demonstration"
                  allow="autoplay; fullscreen; picture-in-picture"
                  loading="lazy"
                  tabIndex={-1}
                  style={{ width: '100%', height: '100%', border: 0, pointerEvents: 'none' }}
                />
                <span className="ds-eco-badge ds-eco-badge--ai"><span className="ds-eco-dot" aria-hidden="true" />AI CLASSIFICATION: YOLOV8N (&gt;94.5%)</span>
                <span className="ds-eco-badge ds-eco-badge--spec">COMPACTION RATIO: 1:4 UBC · 1:3 PET</span>
              </div>
            </div>
            <div className="ds-eco-copy">
              <span className="ds-eco-tag">PILLAR 01 · PHYSICAL RVM FLEET</span>
              <h3>Smart Collection & Source Standardization</h3>
              <p>Directly deployed and operated across high-footfall urban hubs. Handles user-assisted de-labeling, AI optical grading, liquid drainage, heavy-duty compaction, and three-stream physical bin separation.</p>
              <a className="ds-eco-cta ds-eco-cta--outline" href={RVM_FULL_DEMO_URL} target="_blank" rel="noopener noreferrer">Watch Full Demo with Audio ↗</a>
            </div>
          </article>

          <article className="ds-eco-panel ds-eco-panel--app">
            <span className="ds-eco-num" aria-hidden="true">02</span>
            <div className="ds-eco-stage ds-eco-stage--phone">
              <div className="ds-eco-chip ds-eco-chip--reward">
                <span className="ds-eco-chip-label">DYNAMIC REWARD</span>
                <span className="ds-eco-chip-value">+150 pts · Clean PET</span>
              </div>
              <PhoneMock />
              <div className="ds-eco-chip ds-eco-chip--wallet">
                <span className="ds-eco-chip-label">VOUCHER WALLET</span>
                <span className="ds-eco-chip-value">Coca-Cola 15K VND ↗</span>
              </div>
            </div>
            <div className="ds-eco-copy">
              <span className="ds-eco-tag">PILLAR 02 · MOBILE CONSUMER APPLICATION</span>
              <h3>Dynamic Incentives Driving Behavioral Change</h3>
              <p>Inspired by Norway's 97% recovery model. A dynamic scoring engine rewards cleaner, properly prepared bottles with higher points via instant QR scanning — redeemable for brand vouchers or cash.</p>
              <a className="ds-eco-cta ds-eco-cta--light" href={GREENPOINT_APP_URL} target="_blank" rel="noopener noreferrer">Launch GreenPoint App ↗</a>
            </div>
          </article>

          <article className="ds-eco-panel ds-eco-panel--dash">
            <span className="ds-eco-num" aria-hidden="true">03</span>
            <div className="ds-eco-stage">
              <LaptopMock />
            </div>
            <div className="ds-eco-copy">
              <span className="ds-eco-tag">PILLAR 03 · LIVE IOT TELEMETRY DASHBOARD</span>
              <h3>Data as Infrastructure for EPR Compliance</h3>
              <p>Logs every deposit in real time — recording material type, purity compliance, brand metadata, timestamps, and GPS coordinates to generate auditable recovery documentation.</p>
              <a className="ds-eco-cta ds-eco-cta--green" href={GREENGUARD_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">Open Live Dashboard ↗</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
