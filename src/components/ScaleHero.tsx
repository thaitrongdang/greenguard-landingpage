import { Fragment, useEffect, useRef, useState } from 'react'
import { ActionButton, Heading, MonoLabel, MonoNote, SquareIconButton, Text } from '../ds/primitives'
import { ChevronDownGlyph } from './BlueprintSchematic'
import Shuffle from './Shuffle/Shuffle'
import TechText from './TechText'
import DotGrid from './DotGrid/DotGrid'

// WebGL needs literal colors, so resolve palette tokens from the CSS at runtime.
function useTokenColor(name: string, fallback: string) {
  const [color, setColor] = useState(fallback)
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    if (v) setColor(v)
  }, [name, fallback])
  return color
}

const VIMEO_SRC =
  'https://player.vimeo.com/video/1236224279?autoplay=1&loop=1&muted=1&playsinline=1&controls=0&title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1&app_id=122963'

// Reference geometry (desktop px). Scaled down on smaller viewports.
const NAV_H = 72
const INSET = 20
const CARD_W = 560
const CARD_H = 350

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const remap = (value: number, inMin: number, inMax: number) => clamp((value - inMin) / (inMax - inMin))
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Eased 0..1 progress inside a stage window. */
const stage = (p: number, a: number, b: number) => easeInOutCubic(remap(p, a, b))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

interface Pose {
  x: number
  y: number
  rotY: number
  rotX: number
  e2: number
  e3: number
  e4: number
}

/** Card pose for a given progress — evaluated separately for the card and each trailing layer. */
function poseAt(p: number, shift: number, stage1Y: number, mobile: boolean, vh: number): Pose {
  const e2 = stage(p, 0.18, 0.44)
  const e3 = stage(p, 0.44, 0.72)
  const e4 = stage(p, 0.72, 1)
  const liftY = mobile ? -vh * 0.16 : -35
  return {
    x: (250 * e3 - 500 * e4) * shift,
    y: lerp(stage1Y, liftY, e2) + (mobile ? 0 : 35 * e3),
    rotY: -18 * e2 - 10 * e3 + 54 * e4,
    rotX: 5 * e2 + 2 * e3 - 2 * e4,
    e2,
    e3,
    e4,
  }
}

interface ScaleHeroProps {
  onExplore: () => void
  onSolutions: () => void
}

export default function ScaleHero({ onExplore, onSolutions }: ScaleHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dotBase = useTokenColor('--color-forest-sovereignty', '#113821')
  const dotActive = useTokenColor('--color-guard-green', '#085e24')
  const sceneRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const frontOuterRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const rearRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const stage3Ref = useRef<HTMLDivElement>(null)
  const stage4Ref = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState({ s2: false, s3: false, s4: false })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let target = 0
    let smoothP = 0
    let frontLayerP = 0
    let backLayerP = 0
    let targetMouseX = 0
    let targetMouseY = 0
    let mouseX = 0
    let mouseY = 0
    let vw = window.innerWidth
    let vh = window.innerHeight
    let lastSize = ''
    let raf = 0
    let inView = true
    let flags = { s2: false, s3: false, s4: false }

    const readScroll = () => {
      const track = trackRef.current
      if (!track) return
      const max = track.offsetHeight - vh
      target = max > 0 ? clamp(-track.getBoundingClientRect().top / max) : 0
    }

    const fade = (el: HTMLElement | null, o: number, y = 0, x = '0') => {
      if (!el) return
      el.style.opacity = `${o}`
      el.style.transform = `translate3d(${x}, ${y}px, 0)`
      el.style.pointerEvents = o < 0.5 ? 'none' : 'auto'
    }

    const frame = (time: number) => {
      raf = inView ? requestAnimationFrame(frame) : 0

      // Three damped progress values: card, then front layer, then back layers trail behind.
      if (reduced) {
        smoothP = frontLayerP = backLayerP = target
      } else {
        smoothP += (target - smoothP) * 0.055
        frontLayerP += (target - frontLayerP) * 0.038
        backLayerP += (target - backLayerP) * 0.028
      }
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06

      const p = smoothP
      const mobile = vw < 900
      const motion = reduced ? 0 : 1
      const shift = mobile ? 0 : Math.min(1, vw / 1440)
      const depthK = mobile ? 0.6 : Math.min(1, vw / 1280)
      const stage1Y = (NAV_H - INSET) / 2
      const t = time * 0.0015

      const card = poseAt(p, shift, stage1Y, mobile, vh)
      const front = poseAt(frontLayerP, shift, stage1Y, mobile, vh)
      const back = poseAt(backLayerP, shift, stage1Y, mobile, vh)

      // Size + background (Stage 1 → 2)
      const cardW = Math.min(CARD_W, vw * (mobile ? 0.82 : 0.4))
      const cardH = cardW * (CARD_H / CARD_W)
      const w = lerp(vw - INSET * 2, cardW, card.e2)
      const h = lerp(vh - NAV_H - INSET, cardH, card.e2)
      const sizeKey = `${Math.round(w * 4)}x${Math.round(h * 4)}`
      const scene = sceneRef.current
      if (scene && sizeKey !== lastSize) {
        scene.style.width = `${w}px`
        scene.style.height = `${h}px`
        lastSize = sizeKey
      }
      if (videoRef.current) videoRef.current.style.borderRadius = `${lerp(16, 20, card.e2)}px`
      viewportRef.current?.style.setProperty('--hero-dark', `${stage(p, 0.18, 0.34)}`)

      // Combined transform: scroll pose + mouse tilt + idle float.
      const active3D = stage(p, 0.14, 0.34) * motion
      const floatY = Math.sin(t) * 7 * active3D
      const floatRotZ = Math.cos(t * 0.7) * 1.2 * active3D
      const tiltY = mouseX * 10 * active3D
      const tiltX = -mouseY * 10 * active3D
      if (scene) {
        scene.style.transform = `translate3d(${card.x}px, ${card.y + floatY}px, 0) rotateY(${card.rotY * motion + tiltY}deg) rotateX(${card.rotX * motion + tiltX}deg) rotateZ(${floatRotZ}deg)`
      }

      // Layers: position trails the card (pose delta), depth comes from each layer's own progress.
      const layer = (el: HTMLDivElement | null, pose: Pose, dx: number, dy: number, z: number, sign: 1 | -1, opacity: number) => {
        if (!el) return
        const px = mouseX * 28 * sign * pose.e2
        const py = mouseY * 18 * sign * pose.e2
        const lagX = (pose.x - card.x) * motion
        const lagY = (pose.y - card.y) * motion
        el.style.opacity = `${opacity}`
        el.style.transform = `translate3d(${dx + lagX + px}px, ${dy + lagY + py}px, ${z}px) rotateY(${(pose.rotY - card.rotY) * motion}deg)`
      }
      const zf = (85 * front.e2 + 40 * front.e4) * depthK * motion
      const zb = (85 * back.e2 + 40 * back.e4) * depthK * motion
      layer(frontRef.current, front, -45 * front.e2 * depthK * motion, -6 * front.e2 * motion, zf, 1, stage(frontLayerP, 0.2, 0.36))
      layer(backRef.current, back, 55 * back.e2 * depthK * motion, 8 * back.e2 * motion, -zb, -1, stage(backLayerP, 0.2, 0.36))
      layer(frontOuterRef.current, front, -80 * front.e3 * depthK * motion, -12 * front.e3 * motion, zf + 70 * front.e3 * depthK * motion, 1, front.e3)
      layer(rearRef.current, back, 100 * back.e3 * depthK * motion, 14 * back.e3 * motion, -zb - 80 * back.e3 * depthK * motion, -1, back.e3)

      // Hero copy + text containers (outer opacity only; inner reveals are CSS-staggered).
      const out1 = stage(p, 0.02, 0.14)
      fade(headlineRef.current, 1 - out1, -40 * out1)
      fade(cueRef.current, 1 - stage(p, 0.02, 0.1))
      fade(captionRef.current, 1 - stage(p, 0.41, 0.46), 0, '-50%')
      fade(stage3Ref.current, 1 - stage(p, 0.73, 0.78))
      fade(stage4Ref.current, 1)

      // Stage 3 text waits until the card has settled on the right.
      const next = { s2: p > 0.26 && p < 0.46, s3: p > 0.64 && p < 0.78, s4: p > 0.78 }
      if (next.s2 !== flags.s2 || next.s3 !== flags.s3 || next.s4 !== flags.s4) {
        flags = next
        setActive(next)
      }

      // Nav theme follows smoothP: light on the white Stage 1, dark once the void begins.
      const surface = p > 0.18 ? 'dark' : 'light'
      const section = sectionRef.current
      if (section && section.dataset.surface !== surface) {
        section.dataset.surface = surface
        window.dispatchEvent(new Event('gg-surface-change'))
      }
    }

    const start = () => {
      if (!raf && inView) raf = requestAnimationFrame(frame)
    }
    const onScroll = () => {
      readScroll()
      start()
    }
    const onMouse = (e: MouseEvent) => {
      targetMouseX = clamp((e.clientX / vw - 0.5) * 2, -1, 1)
      targetMouseY = clamp((e.clientY / vh - 0.5) * 2, -1, 1)
    }
    const onResize = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      lastSize = ''
      readScroll()
      start()
    }
    // Pause the loop once the section is fully off-screen; snap state on re-entry to avoid a long catch-up glide.
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
      if (inView) {
        readScroll()
        start()
      }
    })
    if (trackRef.current) io.observe(trackRef.current)

    // Start at Stage 1; damping then glides to the real position if the page loads mid-track.
    smoothP = frontLayerP = backLayerP = 0
    readScroll()
    start()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={sectionRef} data-surface="light" className="ds-surface-canvas">
      <div ref={trackRef} id="scaleHeroTrack" className="scaleHeroTrack">
        <div ref={viewportRef} className="scaleHeroViewport">
          <div className="heroDotGrid" aria-hidden="true">
            <DotGrid baseColor={dotBase} activeColor={dotActive} shape="circle" dotSize={3} gap={11} proximity={95} strength={0.5} bounce={0.1} tension={0.4} returnDuration={1.4} shockRadius={320} shockStrength={5} swell={0.4} stretch={0.05} glow={0.25} fade={0.5} intro={false} clickShock={false} />
          </div>
          <div ref={sceneRef} id="scene3D" className="scene3D">
            <div ref={rearRef} className="rearPlane ds-wire-plane" aria-hidden="true">
              <RearWireframe />
            </div>
            <div ref={backRef} id="backPlane" className="backPlane ds-wire-plane" aria-hidden="true">
              <BackWireframe />
            </div>
            <div ref={videoRef} className="videoCard">
              <div className="videoCard-frame">
                <iframe
                  src={VIMEO_SRC}
                  title="DEMO PROCESS"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="videoCard-iframe"
                  tabIndex={-1}
                  loading="eager"
                  width="1920"
                  height="1080"
                />
                <div className="heroDimmer" />
              </div>
              <div ref={headlineRef} className="heroOverlayText">
                <div className="gg-hero-headline-wrap" style={{ width: '100%', maxWidth: '1150px', padding: '0 24px' }}>
                  <Heading level={1} scale="heading-lg" tone="white" className="sr-only">
                    Circularity at scale needs standardized feedstock.
                  </Heading>
                  <div aria-hidden="true" style={{ width: '100%', height: '140px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TechText
                      text="Circularity at scale needs standardized feedstock."
                      fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
                      fontWeight={400}
                      fontSize={52}
                      letterSpacing={-0.02}
                      color="#FFFFFF"
                      accentColor="#A2D925"
                      reveal="letter"
                      dashLength={4}
                      dashGap={2}
                      specks={15}
                      intro="none"
                      draggable={true}
                      clickKick={true}
                      guides={false}
                    />
                  </div>
                </div>
              </div>
              <div ref={cueRef} className="heroScrollCue flex items-center ds-gap-12">
                <MonoNote tone="white">Scroll to explore</MonoNote>
                <SquareIconButton variant="hero-dark" ariaLabel="Scroll to explore" onClick={onExplore} className="gg-cue-square">
                  <ChevronDownGlyph />
                </SquareIconButton>
              </div>
            </div>
            <div ref={frontRef} id="frontPlane" className="frontPlane ds-wire-plane" aria-hidden="true">
              <FrontWireframe />
            </div>
            <div ref={frontOuterRef} className="frontOuterPlane ds-wire-plane" aria-hidden="true">
              <OuterWireframe />
            </div>
          </div>

          <div ref={captionRef} className="bottomVoidCaption">
            <StaggeredTextBlock
              variant="caption"
              isActive={active.s2}
              heading="Industrial recycling has no shortcuts."
              body="GreenGuard works across the circular stack, from the YOLOv8n optical inspection that grades every bottle, to the compaction and telemetry systems that put materials to work."
            />
          </div>

          <div ref={stage3Ref} className="gg-stage-column gg-stage-left">
            <StaggeredTextBlock
              isActive={active.s3}
              eyebrow="RVM HARDWARE & EDGE AI"
              heading="Sorting systems that actually work."
              body="50% of collected PET in Vietnam fails food-grade reuse. We verify purity at the intake bay with >94.5% AI accuracy and 1:4 mechanical compaction, cutting collection trips by 70%."
              cta="Explore RVM Architecture"
              ctaClassName="gg-cta-rvm"
              onCta={onExplore}
              credentials="TOP 4 DOW CHALLENGE (U-I) · BKI 2026 · HCMUT"
            />
          </div>

          <div ref={stage4Ref} className="gg-stage-column gg-stage-right">
            <StaggeredTextBlock
              isActive={active.s4}
              eyebrow="FEEDSTOCK & EPR TELEMETRY"
              heading="The data and purity powering circular supply chains."
              body="Delivering uncontaminated rPET and >95% purity aluminum alongside real-time IoT audit trails (<0.2s edge latency) for industrial recyclers and FMCG compliance."
              cta="Explore B2B & EPR Solutions"
              ctaClassName="gg-cta-rvm"
              onCta={onSolutions}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface StaggeredTextBlockProps {
  isActive: boolean
  heading: string
  body: string
  eyebrow?: string
  cta?: string
  onCta?: () => void
  ctaClassName?: string
  credentials?: string
  variant?: 'stage' | 'caption'
}

/** Cascading reveal: eyebrow → headline words → body words → CTA → credentials. Reverses when inactive. */
function StaggeredTextBlock({ isActive, heading, body, eyebrow, cta, onCta, ctaClassName = '', credentials, variant = 'stage' }: StaggeredTextBlockProps) {
  const caption = variant === 'caption'
  return (
    <div className={`gg-stagger-block ${caption ? 'is-caption' : ''} ${isActive ? 'is-active' : ''}`} aria-hidden={!isActive}>
      {eyebrow && (
        <MonoLabel tone="smoke" className="gg-eyebrow gg-rv-eyebrow">
          <span className="gg-eyebrow-marker" aria-hidden="true">▼</span> {eyebrow}
        </MonoLabel>
      )}
      <Heading level={2} scale={caption ? 'subheading' : 'heading-sm'} tone="white" className={caption ? 'gg-caption-title' : 'gg-stage-heading'}>
        {heading.split(' ').map((word, i) => (
          <Fragment key={i}>
            <span className="gg-rv-head-word" style={{ transitionDelay: `${0.16 + i * 0.03}s` }}>{word}</span>{' '}
          </Fragment>
        ))}
      </Heading>
      {caption ? (
        <Text scale="caption" tone="smoke" className="gg-caption-body gg-rv-subtitle">{body}</Text>
      ) : (
        <Text tone="white" className="gg-stage-body">
          {body.split(' ').map((word, i) => (
            <Fragment key={i}>
              <span className="gg-rv-body-word" style={{ transitionDelay: `${0.28 + i * 0.022}s` }}>{word}</span>{' '}
            </Fragment>
          ))}
        </Text>
      )}
      {cta && (
        <div className={`gg-rv-cta ${ctaClassName}`.trim()}>
          <ActionButton variant="forest-cta" onClick={onCta}>
            {cta}&nbsp;&nbsp;›
          </ActionButton>
        </div>
      )}
      {credentials && (
        <div className="gg-recognition-plain">
          {/* Appears via the shuffle itself (no fade); starts after the CTA so it lands last. */}
          {isActive && <CredentialsShuffle text={credentials} />}
        </div>
      )}
    </div>
  )
}

/** Mounts the Shuffle after a short delay so it is the credentials' entrance animation. */
function CredentialsShuffle({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), 780)
    return () => window.clearTimeout(id)
  }, [])
  if (!show) return null
  return (
    <Shuffle
      text={text}
      tag="span"
      className="gg-recognition-text whitespace-nowrap"
      style={{ whiteSpace: 'nowrap' }}
      textAlign="left"
      effect="slide"
      shuffleDirection="down"
      duration={0.9}
      animationMode="random"
      shuffleTimes={5}
      ease="expo.out"
      stagger={0.03}
      maxDelay={0.45}
      threshold={0}
      rootMargin="0px"
      triggerOnce
      triggerOnHover={false}
      motionBlur
      respectReducedMotion
      scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      color="var(--color-pure-white)"
      accentColor="var(--color-bio-lime)"
    />
  )
}

/* Lightweight SVG wireframes: white contours, dashed diagonal projection rays, Bio-Lime triangle nodes. */
function Arrow({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return <polygon className="wire-fill" points="0,-5 5,4 -5,4" transform={`translate(${x} ${y}) rotate(${r})`} />
}

function Rays() {
  return (
    <g className="wire-ray">
      <line x1="0" y1="0" x2="120" y2="70" />
      <line x1="560" y1="0" x2="440" y2="70" />
      <line x1="0" y1="350" x2="120" y2="280" />
      <line x1="560" y1="350" x2="440" y2="280" />
    </g>
  )
}

function FrontWireframe() {
  return (
    <svg viewBox="0 0 560 350" className="ds-wire-svg" preserveAspectRatio="none">
      <Rays />
      <path className="wire-line" d="M60 250 C 150 250, 170 120, 280 120 S 410 210, 500 96" />
      <path className="wire-line" d="M60 160 C 140 160, 220 230, 310 214 S 430 150, 500 170" />
      <Arrow x={500} y={96} r={40} />
      <Arrow x={280} y={120} r={90} />
      <Arrow x={60} y={250} r={-90} />
      <g className="wire-text">
        <text x="286" y="110">0111</text>
        <text x="440" y="88">0100</text>
        <text x="66" y="240">0010</text>
      </g>
    </svg>
  )
}

function BackWireframe() {
  return (
    <svg viewBox="0 0 560 350" className="ds-wire-svg" preserveAspectRatio="none">
      <Rays />
      <path className="wire-line" d="M40 290 C 160 290, 190 80, 330 80 S 490 240, 530 60" />
      <Arrow x={330} y={80} r={90} />
      <Arrow x={530} y={60} r={20} />
      <g className="wire-text">
        <text x="48" y="60">1000</text>
        <text x="336" y="70">0111</text>
      </g>
    </svg>
  )
}

function RearWireframe() {
  return (
    <svg viewBox="0 0 560 350" className="ds-wire-svg" preserveAspectRatio="none">
      <Rays />
      <path className="wire-line" d="M30 300 Q 280 40 530 300" />
      <Arrow x={280} y={170} />
      <g className="wire-text">
        <text x="290" y="160">0010</text>
      </g>
    </svg>
  )
}

function OuterWireframe() {
  return (
    <svg viewBox="0 0 560 350" className="ds-wire-svg" preserveAspectRatio="none">
      <Rays />
      <path className="wire-line" d="M80 80 L 200 140 L 360 120 L 480 220" />
      <Arrow x={200} y={140} r={60} />
      <Arrow x={480} y={220} r={130} />
      <g className="wire-text">
        <text x="208" y="134">0100</text>
        <text x="420" y="240">1000</text>
      </g>
    </svg>
  )
}
