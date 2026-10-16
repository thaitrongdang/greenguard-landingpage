import React from 'react'
import PartnerLogos from './PartnerLogos'
import { MonoLabel, MonoNote } from '../ds/primitives'

export type BlueprintFrameId = '02A' | '02B' | '02C'

export function ChevronDownGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="ds-fill-none ds-stroke-white"
      strokeWidth="1.25"
      strokeLinecap="square"
    >
      <path d="M3.5 6L8 10.5L12.5 6" />
    </svg>
  )
}

export function ArrowLeftGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="ds-fill-none ds-stroke-obsidian"
      strokeWidth="1.25"
      strokeLinecap="square"
    >
      <path d="M10 3.5L5.5 8L10 12.5" />
    </svg>
  )
}

export function ArrowRightGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="ds-fill-none ds-stroke-obsidian"
      strokeWidth="1.25"
      strokeLinecap="square"
    >
      <path d="M6 3.5L10.5 8L6 12.5" />
    </svg>
  )
}

export function CloseGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="ds-fill-none ds-stroke-obsidian"
      strokeWidth="1.25"
      strokeLinecap="square"
    >
      <path d="M4 4L12 12M12 4L4 12" />
    </svg>
  )
}

export function BrandCubeGlyph({ tone = 'white' }: { tone?: 'white' | 'obsidian' }) {
  const strokeClass = tone === 'white' ? 'ds-stroke-white' : 'ds-stroke-obsidian'
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={`ds-fill-none ${strokeClass}`}
      strokeWidth="1.2"
    >
      <polygon points="10,1.5 18,6 18,14 10,18.5 2,14 2,6" />
      <polyline points="2,6 10,10.5 18,6" />
      <line x1="10" y1="10.5" x2="10" y2="18.5" />
    </svg>
  )
}

interface RvmBlueprintProps {
  activeFrame: BlueprintFrameId
  onSelectFrame: (frame: BlueprintFrameId) => void
}

export function RvmBlueprintSchematic({ activeFrame, onSelectFrame }: RvmBlueprintProps) {
  const isA = activeFrame === '02A'
  const isB = activeFrame === '02B'
  const isC = activeFrame === '02C'

  return (
    <div className="ds-surface-obsidian ds-border-charcoal ds-radius-card ds-p-24 flex flex-col ds-gap-16">
      {/* Top CAD Header Bar */}
      <div className="flex flex-wrap items-center justify-between ds-gap-12 ds-pb-16 ds-border-bottom-charcoal">
        <div className="flex items-center ds-gap-12">
          <MonoLabel tone="white">CAD // GG-RVM-MK4-ISO</MonoLabel>
          <MonoLabel tone="smoke">SCALE 1:12 · HCMUT MECH LAB</MonoLabel>
        </div>
        <div className="flex items-center ds-gap-8">
          {(['02A', '02B', '02C'] as BlueprintFrameId[]).map((frameId) => {
            const active = activeFrame === frameId
            return React.createElement(
              'button',
              {
                key: frameId,
                type: 'button',
                onClick: () => onSelectFrame(frameId),
                className: `ds-radius-tag ds-px-12 ds-py-6 ds-type-micro-label cursor-pointer transition-opacity duration-200 ${
                  active
                    ? 'ds-surface-canvas ds-text-obsidian'
                    : 'ds-surface-charcoal ds-text-smoke hover:opacity-90'
                }`,
              },
              `FRAME ${frameId}`
            )
          })}
        </div>
      </div>

      {/* Isometric 1px White Stroke Blueprint Canvas */}
      <div className="relative w-full">
        <svg
          viewBox="0 0 620 520"
          className="w-full h-auto block ds-fill-none"
          role="img"
          aria-label="GreenGuard RVM Internal Technical Blueprint Wireframe"
        >
          {/* Subtle Technical Grid Ticks */}
          <g className="ds-stroke-charcoal" strokeWidth="0.75">
            <line x1="20" y1="40" x2="600" y2="40" strokeDasharray="2 6" />
            <line x1="20" y1="180" x2="600" y2="180" strokeDasharray="2 6" />
            <line x1="20" y1="320" x2="600" y2="320" strokeDasharray="2 6" />
            <line x1="20" y1="470" x2="600" y2="470" strokeDasharray="2 6" />
            <line x1="90" y1="20" x2="90" y2="495" strokeDasharray="2 6" />
            <line x1="310" y1="20" x2="310" y2="495" strokeDasharray="2 6" />
            <line x1="530" y1="20" x2="530" y2="495" strokeDasharray="2 6" />
          </g>

          {/* Outer Isometric RVM Chassis Frame (Persistent Structural Wireframe) */}
          <g className="ds-stroke-smoke" strokeWidth="1" opacity="0.48">
            {/* Back & Isometric Cabinet Outline */}
            <polygon points="120,36 430,36 470,64 470,468 160,468 120,440" />
            <rect x="160" y="64" width="310" height="404" />
            <line x1="120" y1="36" x2="160" y2="64" />
            <line x1="430" y1="36" x2="470" y2="64" />
            <line x1="120" y1="440" x2="160" y2="468" />
            {/* Internal Structural Horizontal Decks */}
            <line x1="160" y1="192" x2="470" y2="192" strokeDasharray="4 4" />
            <line x1="160" y1="328" x2="470" y2="328" strokeDasharray="4 4" />
          </g>

          {/* Dimension Line Left */}
          <g className="ds-stroke-smoke" strokeWidth="0.8" opacity="0.65">
            <line x1="66" y1="64" x2="66" y2="468" />
            <line x1="60" y1="64" x2="72" y2="64" />
            <line x1="60" y1="468" x2="72" y2="468" />
          </g>
          <text
            x="54"
            y="270"
            textAnchor="middle"
            transform="rotate(-90 54 270)"
            className="ds-fill-smoke ds-type-micro-label"
          >
            1850 MM CHASSIS HEIGHT
          </text>

          {/* ==============================================================
              SUBSYSTEM 01 (FRAME 02A): EXTERIOR DE-LABELING + DUAL YOLOv8n BAY
             ============================================================== */}
          <g
            className={isA ? 'ds-stroke-white' : 'ds-stroke-smoke'}
            strokeWidth={isA ? '1.35' : '0.85'}
            opacity={isA ? '1' : '0.32'}
          >
            {/* Exterior Mechanical De-Labeling & Ring-Removal Module (Left Side Mount) */}
            <rect x="96" y="88" width="64" height="86" className="ds-fill-obsidian" />
            <line x1="106" y1="104" x2="150" y2="104" />
            <circle cx="128" cy="130" r="16" />
            <circle cx="128" cy="130" r="6" strokeDasharray="2 2" />
            <path d="M114 156 L142 156" />

            {/* Diffused-LED Optical Chamber */}
            <rect x="182" y="78" width="266" height="102" className="ds-fill-obsidian" />
            {/* Diffused LED Top Array */}
            <line x1="196" y1="88" x2="434" y2="88" strokeDasharray="6 4" />
            <line x1="196" y1="93" x2="434" y2="93" strokeDasharray="2 4" />

            {/* Dual YOLOv8n Optical Sensors */}
            <polygon points="235,93 225,110 245,110" />
            <polygon points="375,93 365,110 385,110" />

            {/* Optical Inspection FOV Cones */}
            {isA && (
              <g strokeDasharray="3 3" className="ds-animate-pulse-line">
                <line x1="235" y1="110" x2="205" y2="155" />
                <line x1="235" y1="110" x2="295" y2="155" />
                <line x1="375" y1="110" x2="325" y2="155" />
                <line x1="375" y1="110" x2="415" y2="155" />
              </g>
            )}

            {/* Horizontal Bottle Specimen in Chamber */}
            <rect x="242" y="128" width="128" height="32" rx="6" />
            <rect x="370" y="135" width="16" height="18" />
            {/* AI Bounding Box Reticle */}
            {isA && (
              <g>
                <path d="M236,122 L248,122 M236,122 L236,134" strokeWidth="1.5" />
                <path d="M392,122 L380,122 M392,122 L392,134" strokeWidth="1.5" />
                <path d="M236,166 L248,166 M236,166 L236,154" strokeWidth="1.5" />
                <path d="M392,166 L380,166 M392,166 L392,154" strokeWidth="1.5" />
              </g>
            )}

            {/* Leader Annotations for Frame 02A */}
            {isA && (
              <g>
                <line x1="128" y1="88" x2="128" y2="52" />
                <circle cx="128" cy="52" r="2.5" className="ds-fill-white" />
                <text x="136" y="55" className="ds-fill-white ds-type-micro-label">
                  EXT. DE-LABEL & RING STRIPPER
                </text>

                <line x1="448" y1="112" x2="492" y2="112" />
                <circle cx="492" cy="112" r="2.5" className="ds-fill-white" />
                <text x="500" y="108" className="ds-fill-white ds-type-micro-label">
                  YOLOV8N DUAL CAM
                </text>
                <text x="500" y="122" className="ds-fill-smoke ds-type-micro-label">
                  &gt;94.5% PURITY VERIFIED
                </text>
              </g>
            )}
          </g>

          {/* ==============================================================
              SUBSYSTEM 02 (FRAME 02B): 800N LINEAR ACTUATOR + 3 ISOLATED BINS
             ============================================================== */}
          <g
            className={isB ? 'ds-stroke-white' : 'ds-stroke-smoke'}
            strokeWidth={isB ? '1.35' : '0.85'}
            opacity={isB ? '1' : '0.32'}
          >
            {/* Horizontal Compaction Chamber (Middle Deck) */}
            <rect x="182" y="206" width="266" height="106" className="ds-fill-obsidian" />
            {/* Dual Parallel Linear Guide Rails */}
            <line x1="192" y1="224" x2="438" y2="224" />
            <line x1="192" y1="294" x2="438" y2="294" />
            {/* 800N Electric Linear Actuator Cylinder */}
            <rect x="192" y="242" width="110" height="34" />
            <line x1="204" y1="242" x2="204" y2="276" />
            <line x1="286" y1="242" x2="286" y2="276" />
            {/* Piston Rod */}
            <rect x="302" y="253" width="48" height="12" />
            {/* >6mm Heavy-Duty Steel Pressing Plate */}
            <rect x="350" y="218" width="10" height="82" className={isB ? 'ds-fill-white' : 'ds-fill-obsidian'} />
            {/* Compacted Feedstock Block inside Chamber */}
            <rect x="368" y="232" width="54" height="54" strokeDasharray="3 2" />
            {/* Force Vector Arrows */}
            {isB && (
              <g className="ds-animate-pulse-line">
                <line x1="312" y1="238" x2="342" y2="238" />
                <polyline points="337,234 343,238 337,242" />
                <line x1="312" y1="280" x2="342" y2="280" />
                <polyline points="337,276 343,280 337,284" />
              </g>
            )}

            {/* 3-Stream Routing Diverter Chutes */}
            <line x1="315" y1="312" x2="222" y2="344" strokeDasharray="3 3" />
            <line x1="315" y1="312" x2="315" y2="344" strokeDasharray="3 3" />
            <line x1="315" y1="312" x2="408" y2="344" strokeDasharray="3 3" />

            {/* 3 Isolated Bottom Storage Bins */}
            {/* Bin 1: Compressed Aluminum (>95% Purity, 1:4) */}
            <rect x="182" y="344" width="82" height="108" className="ds-fill-obsidian" />
            <line x1="190" y1="418" x2="256" y2="418" strokeDasharray="2 2" />
            <text x="223" y="370" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              BIN 01
            </text>
            <text x="223" y="386" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              ALUM 1:4
            </text>
            <text x="223" y="400" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              &gt;95% PURE
            </text>

            {/* Bin 2: High-Purity PET (Food-Grade Ready, 1:3) */}
            <rect x="274" y="344" width="82" height="108" className="ds-fill-obsidian" />
            <line x1="282" y1="408" x2="348" y2="408" strokeDasharray="2 2" />
            <text x="315" y="370" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              BIN 02
            </text>
            <text x="315" y="386" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              CLEAN PET
            </text>
            <text x="315" y="400" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              1:3 RATIO
            </text>

            {/* Bin 3: Sub-Standard PET (Isolated) */}
            <rect x="366" y="344" width="82" height="108" className="ds-fill-obsidian" />
            <line x1="374" y1="432" x2="440" y2="432" strokeDasharray="2 2" />
            <text x="407" y="370" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              BIN 03
            </text>
            <text x="407" y="386" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              SUB-STD
            </text>
            <text x="407" y="400" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              ISOLATED
            </text>

            {isB && (
              <g>
                <line x1="448" y1="258" x2="492" y2="258" />
                <circle cx="492" cy="258" r="2.5" className="ds-fill-white" />
                <text x="500" y="254" className="ds-fill-white ds-type-micro-label">
                  800N ACTUATOR
                </text>
                <text x="500" y="268" className="ds-fill-smoke ds-type-micro-label">
                  &gt;6MM STEEL PLATE
                </text>
              </g>
            )}
          </g>

          {/* ==============================================================
              SUBSYSTEM 03 (FRAME 02C): ASYNC EDGE SQLITE + QR JWT + CLOUD IOT
             ============================================================== */}
          <g
            className={isC ? 'ds-stroke-white' : 'ds-stroke-smoke'}
            strokeWidth={isC ? '1.35' : '0.85'}
            opacity={isC ? '1' : '0.28'}
          >
            {/* Edge Microcontroller & Local SQLite Node */}
            <rect x="492" y="156" width="108" height="72" className="ds-fill-obsidian" />
            <text x="546" y="180" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              EDGE MCU NODE
            </text>
            <text x="546" y="196" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              LOCAL SQLITE DB
            </text>
            <text x="546" y="212" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              &lt;0.2S LATENCY
            </text>

            {/* Consumer Mobile App QR JWT Node */}
            <rect x="492" y="264" width="108" height="76" className="ds-fill-obsidian" />
            <rect x="504" y="278" width="24" height="24" />
            <rect x="510" y="284" width="12" height="12" strokeDasharray="2 2" />
            <text x="564" y="290" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              QR JWT
            </text>
            <text x="564" y="304" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              DYNAMIC
            </text>
            <text x="546" y="326" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              MOBILE REWARDS
            </text>

            {/* Cloud IoT EPR Telemetry Bus */}
            <rect x="492" y="374" width="108" height="78" className="ds-fill-obsidian" />
            <text x="546" y="400" textAnchor="middle" className="ds-fill-white ds-type-micro-label">
              CLOUD IOT BUS
            </text>
            <text x="546" y="416" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              EPR AUDIT LOG
            </text>
            <text x="546" y="432" textAnchor="middle" className="ds-fill-smoke ds-type-micro-label">
              GPS + TIMESTAMP
            </text>

            {/* Data Telemetry Bus Lines */}
            <polyline
              points="448,140 478,140 478,192 492,192"
              strokeDasharray={isC ? '4 2' : '2 4'}
              className={isC ? 'ds-animate-pulse-line' : ''}
            />
            <line
              x1="546"
              y1="228"
              x2="546"
              y2="264"
              strokeDasharray="3 3"
              className={isC ? 'ds-animate-pulse-line' : ''}
            />
            <line
              x1="546"
              y1="340"
              x2="546"
              y2="374"
              strokeDasharray="3 3"
              className={isC ? 'ds-animate-pulse-line' : ''}
            />
          </g>
        </svg>
      </div>

      {/* Bottom Blueprint Annotation Readout (13px Mono sentence-case) */}
      <div className="flex flex-wrap items-center justify-between ds-gap-12 ds-pt-16 ds-border-top-charcoal">
        <MonoNote tone="white">
          {isA &&
            'Fig 02A — Exterior mechanical stripper removes labels/rings before dual YOLOv8n optical verification.'}
          {isB &&
            'Fig 02B — 800N electric actuator on dual rails compresses Al (1:4) and PET (1:3) into 3 isolated bins.'}
          {isC &&
            'Fig 02C — Offline-first SQLite edge queue issues instant JWT QR rewards and syncs EPR audit logs.'}
        </MonoNote>
        <MonoLabel tone="smoke">
          {isA && 'ACCURACY: >94.5%'}
          {isB && 'TRIPS REDUCED: -70%'}
          {isC && 'LATENCY: <0.2S'}
        </MonoLabel>
      </div>
    </div>
  )
}

export function RecognitionEmblemsStrip() {
  return (
    <div className="ds-pt-16 ds-border-top-charcoal flex flex-col lg:flex-row items-start lg:items-center justify-between ds-gap-32">
      <PartnerLogos />

      {/* Official Recognition Caption */}
      <MonoNote tone="smoke" className="max-w-xl">
        Recognized among the Top 4 Teams in the Grand Final — Dow Chemical Design for Circularity
        Challenge (U-I) 2026.
      </MonoNote>
    </div>
  )
}
