import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AccentPanel,
  ActionButton,
  FlatCard,
  GhostNavButton,
  Heading,
  InteractiveTrigger,
  MonoLabel,
  MonoNote,
  NestedCard,
  SectionHeaderStack,
  SquareIconButton,
  TagPill,
  Text,
} from './ds/primitives'
import {
  ArrowLeftGlyph,
  ArrowRightGlyph,
  BlueprintFrameId,
  RecognitionEmblemsStrip,
  RvmBlueprintSchematic,
} from './components/BlueprintSchematic'
import { CountUp, useScrollReveal } from './components/Motion'
import ScaleHero from './components/ScaleHero'
import TactileGrid from './components/TactileGrid'
import ValueStreams from './components/ValueStreams'
import RoadmapCarousel from './components/RoadmapCarousel'
import StackLayer from './components/StackLayer'
import EcosystemPanels from './components/EcosystemPanels'
import TeamSection from './components/TeamSection'
import { GREENGUARD_DASHBOARD_URL, GREENPOINT_APP_URL } from './config/links'
import DotBackdrop from './components/DotGrid/DotBackdrop'
import BrandLogo from './components/BrandLogo'
import { LiveIotDashboardModal, PartnerDemoModal } from './components/InteractiveModals'

const NAV_LINKS = [
  { label: 'RVM System', target: 'rvm-system' },
  { label: 'Edge AI', target: 'ecosystem' },
  { label: 'EPR & Feedstock', target: 'value-streams' },
  { label: 'Roadmap', target: 'roadmap' },
]

const FRAMES: { id: BlueprintFrameId; eyebrow: string; heading: string; body: string }[] = [
  {
    id: '02A',
    eyebrow: '01 / DUAL YOLOV8N EDGE VISION',
    heading: 'Automated Material & Purity Verification',
    body: 'Users strip labels and tamper-evident rings via an integrated exterior module. Inside the diffused-LED chamber, YOLOv8n Model 1 classifies PET bottles vs. aluminum cans, while Model 2 verifies zero residual caps, rings, labels, or liquids with >94.5% accuracy.',
  },
  {
    id: '02B',
    eyebrow: '02 / HIGH-DENSITY MECHANICAL COMPACTION',
    heading: '1:4 & 1:3 Compaction. Three Controlled Streams.',
    body: 'Horizontal compression crushes aluminum cans at a 1:4 ratio and PET bottles at 1:3, routing outputs into Bin 1 (Compressed Aluminum >95% purity), Bin 2 (High-Purity PET), and Bin 3 (Sub-Standard PET isolated from clean feedstock) — cutting collection trips by nearly 70%.',
  },
  {
    id: '02C',
    eyebrow: '03 / OFFLINE-FIRST EDGE ARCHITECTURE',
    heading: '<0.2s Processing Latency. 100% Mechanical Uptime.',
    body: 'Decoupled from network lags via a local SQLite database and encrypted JWT QR codes. Users earn dynamic points scaled to bottle purity for instant vouchers or cash, while every transaction syncs live to our EPR audit trail dashboard.',
  },
]

const METRICS = [
  ['OPTICAL AI ACCURACY', '>94.5%', 'Single lightweight YOLOv8n model trained on 1,500+ in-chamber horizontal images with diffused LED lighting.'],
  ['LOGISTICS OVERHEAD', '-70% Trips', 'Cuts 120L bin collection frequency from ~22 trips/week down to ~7 trips/week (140 kg/m³ aluminum density; 84 kg/m³ PET density).'],
  ['DISCOUNTED PAYBACK (DPP)', '12.18 Mos', 'Breaks even in ~1 year over a 36-month lifespan (1.0%/month WACC), retaining 66% of asset life for pure profit generation.'],
  ['INTERNAL RATE OF RETURN', '158% IRR', 'Generates a positive NPV of 31,128,996 VND per machine with a 19,000,000 VND CAPEX (16,000,000 VND at 15-unit batch scale).'],
]

const REVENUE = [
  ['01', 'High-Purity PET (Bin 2)', '185 kg/month', '11,500 VND/kg', '2,127,500'],
  ['02', 'Crushed Aluminum Cans (>95% Purity)', '65 kg/month', '40,000 VND/kg', '2,600,000'],
  ['03', 'EPR Data & Audit Trail Service Fee', '250 kg', '900 VND/kg', '225,000'],
  ['04', 'Brand Sponsorship (In-App Ads & Frame)', '1 machine/month', 'Flat', '1,250,000'],
]

const SUMMARY = [
  ['TOTAL MONTHLY REVENUE', '6,202,500 VND'],
  ['MAINTENANCE OPEX', '1,270,000 VND'],
  ['LOGISTICS OPEX', '3,267,000 VND'],
  ['MONTHLY GROSS PROFIT', '1,665,000 VND · 26.8%'],
]


const FOOTER_COLS = [
  ['PLATFORM', ['Physical RVM Unit', 'YOLOv8n Vision Engine', 'Mobile Consumer App', 'Live IoT Telemetry Dashboard']],
  ['SOLUTIONS', ['Food-Grade rPET Feedstock', 'High-Purity Compacted Aluminum', 'EPR Audit Trail & Reporting', 'Brand Voucher Sponsorship']],
  ['VALIDATION', ['HCMUT Canteen Telemetry', '1:4 & 1:3 Compaction Study', 'Unit Economics (158% IRR)', 'Top 4 Dow Challenge Brief']],
] as const

// Footer items that point to live products; VALIDATION entries have no detail pages yet, so they render as text.
const FOOTER_LINKS: Record<string, string> = {
  'Mobile Consumer App': GREENPOINT_APP_URL,
  'Live IoT Telemetry Dashboard': GREENGUARD_DASHBOARD_URL,
}

const COALITION = ['PRO VIETNAM', 'COCA-COLA', 'HEINEKEN', 'SUNTORY PEPSICO', 'UNILEVER', 'DUY TAN RECYCLING', 'LAGOM VIETNAM', 'VIET DUC SCRAP', 'DOW CHEMICAL', 'HCMUT']

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function App() {
  const [navDark, setNavDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [frameIndex, setFrameIndex] = useState(0)
  const [iotOpen, setIotOpen] = useState(false)
  const [partner, setPartner] = useState<{ open: boolean; context: string; key: number }>({
    open: false,
    context: 'epr-offtake',
    key: 0,
  })
  const [pageProgress, setPageProgress] = useState(0)
  useScrollReveal()
  const voidRef = useRef<HTMLDivElement>(null)

  const openPartner = (context: string) =>
    setPartner((p) => ({ open: true, context, key: p.key + 1 }))

  // Callbacks only use stable setters, so the hero element is created once and never re-renders on page scroll.
  const hero = useMemo(
    () => <ScaleHero onExplore={() => scrollToId('rvm-system')} onSolutions={() => scrollToId('value-streams')} />,
    []
  )

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      setScrolled(y > 8)
      const max = document.documentElement.scrollHeight - vh
      setPageProgress(max > 0 ? y / max : 0)
      // Nav theme follows the surface beneath it
      const probe = 40
      const surfaces = document.querySelectorAll<HTMLElement>('[data-surface]')
      surfaces.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= probe && r.bottom > probe) setNavDark(el.dataset.surface === 'dark')
      })
      // Sticky blueprint sequence progress
      const v = voidRef.current
      if (v) {
        const r = v.getBoundingClientRect()
        const total = r.height - vh
        const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, total)))
        setFrameIndex(Math.floor(p * FRAMES.length))
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('gg-surface-change', onScroll)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('gg-surface-change', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])


  const selectFrame = (id: BlueprintFrameId) => {
    const idx = FRAMES.findIndex((f) => f.id === id)
    const v = voidRef.current
    if (!v) return setFrameIndex(idx)
    const total = v.offsetHeight - window.innerHeight
    window.scrollTo({ top: v.offsetTop + (total * (idx + 0.5)) / FRAMES.length, behavior: 'smooth' })
  }


  const frame = FRAMES[frameIndex]
  const navSolid = scrolled
  // Always solid: white over light surfaces (incl. hero Stage 1), translucent obsidian over dark ones.
  const navSurface = navDark ? 'ds-nav-surface-dark' : 'ds-surface-canvas'

  return (
    <div className="ds-surface-canvas ds-font-primary">
      {/* SECTION 0 — STICKY NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ds-nav-shell ${navSurface}`}>
        <div className="ds-nav-bar ds-nav-72 flex items-center justify-between ds-gap-24">
          <InteractiveTrigger ariaLabel="GreenGuard home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BrandLogo surface={navDark ? 'dark' : 'light'} />
          </InteractiveTrigger>
          <div className="hidden lg:flex items-center ds-gap-32">
            {NAV_LINKS.map((l) => (
              <GhostNavButton key={l.target} active className="ds-nav-link-sm" tone={navDark ? 'white' : 'obsidian'} onClick={() => scrollToId(l.target)}>
                {l.label}
              </GhostNavButton>
            ))}
          </div>
          <div className={`ds-nav-actions ${navDark ? 'is-dark' : 'is-light'}`}>
            <a className="ds-nav-ghost hidden sm:inline-flex" href={GREENPOINT_APP_URL} target="_blank" rel="noopener noreferrer">
              GreenPoint App <span aria-hidden="true">↗</span>
            </a>
            <a className="ds-nav-pill" href={GREENGUARD_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
              <span className="ds-live-dot" aria-hidden="true" />
              Live Dashboard
            </a>
          </div>
        </div>
        {navSolid && <div className="ds-scroll-progress" style={{ transform: `scaleX(${pageProgress})` }} />}
      </nav>

      <main className="ds-stack-root">
      <StackLayer z={10} tone="obsidian" first>
      {/* SECTION 1 + 2 — FULLSCREEN VIDEO → STICKY 3D BLACK VOID */}
      {hero}

      {/* SECTION 2 — BLACK VOID STICKY BLUEPRINT SEQUENCE */}
      <section id="rvm-system" data-surface="dark" className="ds-surface-obsidian">
        <div ref={voidRef} className="relative ds-void-track">
          <div className="ds-dot-host sticky top-0 min-h-screen flex flex-col justify-center ds-px-32 ds-pt-64 ds-pb-32">
            <DotBackdrop />
            <div className="ds-container flex flex-col ds-gap-48 ds-pt-48">
              <div className="grid lg:grid-cols-2 items-center ds-gap-64 ds-stagger">
                <RvmBlueprintSchematic activeFrame={frame.id} onSelectFrame={selectFrame} />
                <div className="flex flex-col ds-gap-32">
                  <div className="flex ds-gap-8">
                    {FRAMES.map((f, i) => (
                      <InteractiveTrigger key={f.id} ariaLabel={`Frame ${f.id}`} onClick={() => selectFrame(f.id)} className="flex-1">
                        <div className={`h-px transition-colors duration-500 ${i <= frameIndex ? 'ds-surface-canvas' : 'ds-surface-charcoal'}`} />
                        <MonoLabel tone={i === frameIndex ? 'white' : 'smoke'} className="ds-mt-12">FRAME {f.id}</MonoLabel>
                      </InteractiveTrigger>
                    ))}
                  </div>
                  <div key={frame.id} className="flex flex-col ds-gap-16 ds-fade-up">
                    <MonoLabel tone="smoke">{frame.eyebrow}</MonoLabel>
                    <Heading level={3} scale="subheading" tone="white">{frame.heading}</Heading>
                    <Text tone="white-70">{frame.body}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ds-container ds-px-32 ds-pb-64">
          <div className="ds-reveal"><RecognitionEmblemsStrip /></div>
          <div className="ds-marquee ds-mt-48 ds-pt-32 ds-border-top-charcoal">
            <div className="ds-marquee-track ds-gap-64">
              {[...COALITION, ...COALITION].map((name, i) => (
                <MonoLabel key={i} tone="smoke" className="shrink-0">{name}</MonoLabel>
              ))}
            </div>
          </div>
        </div>
      </section>
      </StackLayer>

      <StackLayer z={20} tone="soft-mist">
      {/* SECTION 3 — ECOSYSTEM: sticky horizontal pillars */}
      <EcosystemPanels />
      </StackLayer>

      <StackLayer z={30} tone="soft-stone">
      {/* OUR JOURNEY — spiral orbit gallery */}
      <TactileGrid />
      </StackLayer>

      <StackLayer z={40} tone="soft-mist">
      {/* SECTION 4 — KEYWORD SCROLLER */}
      <ValueStreams onDiscuss={openPartner} />
      </StackLayer>

      <StackLayer z={50} tone="white">
      {/* SECTION 5 — UNIT ECONOMICS BENTO */}
      <section id="unit-economics" data-surface="light" className="ds-surface-canvas ds-section-daylight">
        <div className="ds-container flex flex-col ds-gap-64">
          <SectionHeaderStack
            className="ds-reveal"
            eyebrow="EMPIRICAL TELEMETRY & FINANCIAL VIABILITY"
            headline="Field-tested at HCMUT. Engineered for rapid payback."
            rightAction={<ActionButton variant="surface-outline-light" onClick={() => openPartner('investor-dcf')}>Request DCF model</ActionButton>}
          />
          <div className="flex flex-col ds-gap-16">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 ds-gap-16 ds-stagger">
              {METRICS.map(([label, value, copy]) => (
                <FlatCard key={label} surface="soft-mist" className="flex flex-col justify-between ds-gap-48 ds-card-hover">
                  <MonoLabel tone="graphite">{label}</MonoLabel>
                  <div className="flex flex-col ds-gap-12">
                    <Heading level={3} scale="heading" tone="obsidian"><CountUp value={value} /></Heading>
                    <Text tone="graphite">{copy}</Text>
                  </div>
                </FlatCard>
              ))}
            </div>
            <FlatCard surface="pale-stone" className="flex flex-col ds-gap-24 ds-reveal">
              <div className="flex flex-wrap items-center justify-between ds-gap-12">
                <MonoLabel tone="obsidian">MONTHLY UNIT ECONOMICS · PER MACHINE</MonoLabel>
                <MonoNote tone="graphite">All figures in VND</MonoNote>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="ds-border-bottom-charcoal">
                      {['#', 'REVENUE STREAM', 'VOLUME', 'UNIT RATE', 'MONTHLY (VND)'].map((h, i) => (
                        <th key={h} className={`ds-py-12 ds-pb-16 ${i === 4 ? 'text-right' : ''}`}>
                          <MonoLabel tone="graphite">{h}</MonoLabel>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REVENUE.map(([n, stream, vol, rate, total]) => (
                      <tr key={n} className="ds-border-bottom-charcoal">
                        <td className="ds-py-20"><MonoNote tone="smoke">{n}</MonoNote></td>
                        <td className="ds-py-20"><Text as="span" tone="obsidian">{stream}</Text></td>
                        <td className="ds-py-20"><MonoNote tone="graphite">{vol}</MonoNote></td>
                        <td className="ds-py-20"><MonoNote tone="graphite">× {rate}</MonoNote></td>
                        <td className="ds-py-20 text-right"><Text as="span" scale="body-sm-medium" tone="obsidian">{total}</Text></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <NestedCard surface="canvas" className="grid sm:grid-cols-2 lg:grid-cols-4 ds-gap-24">
                {SUMMARY.map(([l, v], i) => (
                  <div key={l} className="flex flex-col ds-gap-8">
                    <MonoLabel tone={i === 3 ? 'obsidian' : 'graphite'}>{l}</MonoLabel>
                    <Heading level={4} scale="subheading-sm" tone="obsidian">{v}</Heading>
                  </div>
                ))}
              </NestedCard>
            </FlatCard>
          </div>
        </div>
      </section>
      </StackLayer>

      <StackLayer z={60} tone="pale-stone">
      {/* SECTION 6 — ROADMAP CAROUSEL & TEAM */}
      <section id="roadmap" data-surface="light" className="ds-surface-sandstone-wash ds-section-band">
        <div className="ds-container flex flex-col ds-gap-48">
          <RoadmapCarousel />
          <TeamSection />
        </div>
      </section>
      </StackLayer>

      <StackLayer z={70} tone="obsidian">
      {/* SECTION 7 — OBSIDIAN PRE-FOOTER & FOOTER */}
      <footer data-surface="dark" className="ds-dot-host relative ds-surface-obsidian ds-section-footer">
        <DotBackdrop />
        <div className="ds-container">
          <div className="flex flex-col items-center text-center ds-gap-24 ds-mb-96 ds-stagger">
            <Heading level={2} scale="heading-lg" tone="white" className="ds-prefooter-max">
              Ready to standardize your circular supply chain?
            </Heading>
            <Text scale="body" tone="smoke" className="ds-hero-subcopy">
              Experience our live RVM hardware, consumer reward app, and real-time EPR telemetry dashboard in action.
            </Text>
            <div className="ds-prefooter-ctas ds-mt-12">
              <a className="ds-prefooter-cta ds-prefooter-cta--primary" href={GREENGUARD_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
                <span className="ds-live-status-dot" aria-hidden="true" />
                Open Live Dashboard ↗
              </a>
              <a className="ds-prefooter-cta ds-prefooter-cta--secondary" href={GREENPOINT_APP_URL} target="_blank" rel="noopener noreferrer">
                Launch GreenPoint App ↗
              </a>
            </div>
          </div>
          <div className="ds-border-top-charcoal ds-pt-64 grid md:grid-cols-2 lg:grid-cols-4 ds-gap-48 ds-stagger">
            <div className="flex flex-col ds-gap-16">
              <BrandLogo surface="dark" />
              <Text tone="smoke">Top 4 Finalist — Bach Khoa Innovation 2026 (Dow Chemical Challenge U-I Track)</Text>
              <MonoNote tone="smoke">Ho Chi Minh City, Vietnam</MonoNote>
              <MonoNote tone="white">GreenGuard.works@gmail.com</MonoNote>
            </div>
            {FOOTER_COLS.map(([head, items]) => (
              <div key={head} className="flex flex-col ds-gap-16">
                <MonoLabel tone="smoke">{head}</MonoLabel>
                {items.map((it) =>
                  FOOTER_LINKS[it] ? (
                    <a key={it} href={FOOTER_LINKS[it]} target="_blank" rel="noopener noreferrer" className="ds-type-body-sm ds-footer-link">{it} ↗</a>
                  ) : head === 'VALIDATION' ? (
                    <Text key={it} tone="white" className="ds-footer-static">{it}</Text>
                  ) : (
                    <GhostNavButton key={it} tone="white" className="text-left">{it}</GhostNavButton>
                  )
                )}
              </div>
            ))}
          </div>
          <div className="ds-mt-64 ds-pt-24 ds-border-top-charcoal flex flex-wrap justify-between ds-gap-12">
            <MonoLabel tone="smoke">© 2026 GREENGUARD · HCMUT</MonoLabel>
            <MonoLabel tone="smoke">CIRCULARITY · STANDARDIZED AT SOURCE</MonoLabel>
          </div>
        </div>
      </footer>
      </StackLayer>

      </main>

      <LiveIotDashboardModal isOpen={iotOpen} onClose={() => setIotOpen(false)} />
      <PartnerDemoModal
        key={partner.key}
        isOpen={partner.open}
        initialContext={partner.context}
        onClose={() => setPartner((p) => ({ ...p, open: false }))}
      />
    </div>
  )
}
