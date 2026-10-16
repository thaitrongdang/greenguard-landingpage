import React, { useState } from 'react'
import {
  ActionButton,
  FlatCard,
  Heading,
  MonoLabel,
  MonoNote,
  NestedCard,
  SelectField,
  SquareIconButton,
  TagPill,
  Text,
  TextField,
} from '../ds/primitives'
import { CloseGlyph } from './BlueprintSchematic'

export interface DepositRecord {
  id: string
  timestamp: string
  nodeId: string
  gps: string
  material: string
  brandMeta: string
  purityScore: string
  streamBin: string
  pointsAwarded: string
  jwtHash: string
}

const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    id: 'TX-99482',
    timestamp: '14:28:09 ICT',
    nodeId: 'HCMUT-B4-01',
    gps: '10.7721° N, 106.6579° E',
    material: 'PET Bottle (500ml)',
    brandMeta: 'Suntory PepsiCo · Aquafina',
    purityScore: '98.4% (De-labeled, Zero Cap/Ring)',
    streamBin: 'Bin 2 · High-Purity PET (1:3)',
    pointsAwarded: '+150 PTS (1.5x Purity Tier)',
    jwtHash: 'eyJhbGciOiJIUzI1NiJ9.GG984',
  },
  {
    id: 'TX-99481',
    timestamp: '14:27:41 ICT',
    nodeId: 'HCMUT-LIB-02',
    gps: '10.7726° N, 106.6584° E',
    material: 'Aluminum Can (330ml)',
    brandMeta: 'Heineken Vietnam · Tiger',
    purityScore: '97.1% (Zero Liquid Residue)',
    streamBin: 'Bin 1 · Compacted Al >95% (1:4)',
    pointsAwarded: '+180 PTS (Clean Can Tier)',
    jwtHash: 'eyJhbGciOiJIUzI1NiJ9.GG981',
  },
  {
    id: 'TX-99480',
    timestamp: '14:26:12 ICT',
    nodeId: 'HCMUT-B4-01',
    gps: '10.7721° N, 106.6579° E',
    material: 'PET Bottle (350ml)',
    brandMeta: 'Coca-Cola Vietnam · Dasani',
    purityScore: '86.0% (Residual Sleeve Detected)',
    streamBin: 'Bin 3 · Sub-Standard PET Isolated',
    pointsAwarded: '+60 PTS (Base Recovery Tier)',
    jwtHash: 'eyJhbGciOiJIUzI1NiJ9.GG980',
  },
]

interface LiveIotModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LiveIotDashboardModal({ isOpen, onClose }: LiveIotModalProps) {
  const [deposits, setDeposits] = useState<DepositRecord[]>(INITIAL_DEPOSITS)
  const [simCount, setSimCount] = useState(0)

  if (!isOpen) return null

  const handleSimulateDeposit = () => {
    const nextIndex = simCount + 1
    setSimCount(nextIndex)
    const isAluminum = nextIndex % 2 === 1
    const newDeposit: DepositRecord = isAluminum
      ? {
          id: `TX-${99482 + nextIndex}`,
          timestamp: 'LIVE NOW',
          nodeId: 'HCMUT-B4-01',
          gps: '10.7721° N, 106.6579° E',
          material: 'Aluminum Can (330ml)',
          brandMeta: 'Coca-Cola Vietnam · Sprite',
          purityScore: '96.8% (Verified Empty)',
          streamBin: 'Bin 1 · Compacted Al >95% (1:4)',
          pointsAwarded: '+180 PTS (1.5x Purity Tier)',
          jwtHash: `eyJhbGciOiJIUzI1NiJ9.GG${880 + nextIndex}`,
        }
      : {
          id: `TX-${99482 + nextIndex}`,
          timestamp: 'LIVE NOW',
          nodeId: 'HCMUT-C6-03',
          gps: '10.7730° N, 106.6591° E',
          material: 'PET Bottle (500ml)',
          brandMeta: 'LaVie · Nestle Waters',
          purityScore: '97.9% (De-labeled, Zero Cap/Ring)',
          streamBin: 'Bin 2 · High-Purity PET (1:3)',
          pointsAwarded: '+150 PTS (1.5x Purity Tier)',
          jwtHash: `eyJhbGciOiJIUzI1NiJ9.GG${880 + nextIndex}`,
        }
    setDeposits((prev) => [newDeposit, ...prev.slice(0, 4)])
  }

  return (
    <div
      className="fixed inset-0 z-50 ds-surface-hero-overlay flex items-center justify-center ds-p-24 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Live IoT Telemetry Dashboard"
    >
      <div className="ds-surface-canvas ds-radius-card ds-card-pad w-full max-w-5xl flex flex-col ds-gap-24">
        <div className="flex items-start justify-between ds-gap-16 ds-pb-20 ds-border-bottom-bone">
          <div className="flex flex-col ds-gap-8">
            <div className="flex items-center ds-gap-12">
              <TagPill variant="light-surface">LIVE TELEMETRY STREAM · HCMUT PILOT</TagPill>
              <MonoLabel tone="graphite">DECREE 08/2022 &amp; 110/2026 EPR SCHEMA</MonoLabel>
            </div>
            <Heading level={3} scale="subheading" tone="obsidian">
              GreenGuard Cloud IoT &amp; Auditable EPR Ledger
            </Heading>
          </div>
          <SquareIconButton variant="modal-close" onClick={onClose} ariaLabel="Close IoT Dashboard">
            <CloseGlyph />
          </SquareIconButton>
        </div>

        {/* Node Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 ds-gap-16">
          <NestedCard surface="soft-mist" className="flex flex-col ds-gap-8">
            <MonoLabel tone="graphite">EDGE LATENCY (SQLITE)</MonoLabel>
            <Heading level={4} scale="subheading-sm" tone="obsidian">
              0.14 sec
            </Heading>
            <MonoNote tone="graphite">100% offline-resilient queue</MonoNote>
          </NestedCard>
          <NestedCard surface="soft-mist" className="flex flex-col ds-gap-8">
            <MonoLabel tone="graphite">BIN 1 · COMPACTED AL (1:4)</MonoLabel>
            <Heading level={4} scale="subheading-sm" tone="obsidian">
              96.4% Purity
            </Heading>
            <MonoNote tone="graphite">140 kg/m³ · 68% capacity</MonoNote>
          </NestedCard>
          <NestedCard surface="soft-mist" className="flex flex-col ds-gap-8">
            <MonoLabel tone="graphite">BIN 2 · FOOD-GRADE PET (1:3)</MonoLabel>
            <Heading level={4} scale="subheading-sm" tone="obsidian">
              95.2% Purity
            </Heading>
            <MonoNote tone="graphite">84 kg/m³ · 54% capacity</MonoNote>
          </NestedCard>
          <NestedCard surface="soft-mist" className="flex flex-col ds-gap-8">
            <MonoLabel tone="graphite">BIN 3 · SUB-STD PET</MonoLabel>
            <Heading level={4} scale="subheading-sm" tone="obsidian">
              Isolated
            </Heading>
            <MonoNote tone="graphite">Zero cross-contamination</MonoNote>
          </NestedCard>
        </div>

        {/* Interactive Deposit Stream */}
        <div className="flex flex-wrap items-center justify-between ds-gap-12">
          <MonoLabel tone="obsidian">REAL-TIME DEPOSIT AUDIT LOG (JWT + GPS VERIFIED)</MonoLabel>
          <ActionButton variant="surface-charcoal" onClick={handleSimulateDeposit}>
            Simulate Live RVM Deposit (+1 Item)
          </ActionButton>
        </div>

        <div className="ds-surface-pale-stone ds-radius-nested ds-p-16 flex flex-col ds-gap-12">
          {deposits.map((item) => (
            <div
              key={item.id}
              className="ds-surface-canvas ds-radius-nested ds-p-16 grid grid-cols-1 lg:grid-cols-12 ds-gap-12 items-center"
            >
              <div className="lg:col-span-2 flex flex-col ds-gap-4">
                <MonoLabel tone="obsidian">{item.id}</MonoLabel>
                <MonoNote tone="graphite">{item.timestamp}</MonoNote>
              </div>
              <div className="lg:col-span-3 flex flex-col ds-gap-4">
                <Text scale="body-sm-medium" tone="obsidian">
                  {item.material}
                </Text>
                <MonoNote tone="graphite">{item.brandMeta}</MonoNote>
              </div>
              <div className="lg:col-span-3 flex flex-col ds-gap-4">
                <MonoLabel tone="graphite">YOLOV8N OPTICAL GRADE</MonoLabel>
                <Text scale="caption" tone="obsidian">
                  {item.purityScore}
                </Text>
              </div>
              <div className="lg:col-span-2 flex flex-col ds-gap-4">
                <MonoLabel tone="graphite">ROUTING</MonoLabel>
                <Text scale="caption" tone="obsidian">
                  {item.streamBin}
                </Text>
              </div>
              <div className="lg:col-span-2 flex flex-col ds-gap-4">
                <MonoLabel tone="forest">{item.pointsAwarded}</MonoLabel>
                <MonoNote tone="smoke">{item.gps}</MonoNote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface PartnerModalProps {
  isOpen: boolean
  initialContext: string
  onClose: () => void
}

export function PartnerDemoModal({ isOpen, initialContext, onClose }: PartnerModalProps) {
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [partnerTrack, setPartnerTrack] = useState(initialContext || 'epr-offtake')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleResetAndClose = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 ds-surface-hero-overlay flex items-center justify-center ds-p-24 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule GreenGuard Live Demo or Off-Take Briefing"
    >
      <FlatCard surface="canvas" className="w-full max-w-xl flex flex-col ds-gap-24">
        <div className="flex items-start justify-between ds-gap-16 ds-pb-16 ds-border-bottom-bone">
          <div className="flex flex-col ds-gap-8">
            <MonoLabel tone="graphite">GREENGUARD CIRCULAR INFRASTRUCTURE</MonoLabel>
            <Heading level={3} scale="subheading" tone="obsidian">
              Schedule an End-to-End Demo
            </Heading>
          </div>
          <SquareIconButton
            variant="modal-close"
            onClick={handleResetAndClose}
            ariaLabel="Close modal"
          >
            <CloseGlyph />
          </SquareIconButton>
        </div>

        {submitted ? (
          <NestedCard surface="soft-mist" className="flex flex-col ds-gap-16">
            <MonoLabel tone="forest">REQUEST LOGGED · HCMUT ENGINEERING TEAM</MonoLabel>
            <Heading level={4} scale="subheading-sm" tone="obsidian">
              Briefing &amp; Live Hardware Session Confirmed
            </Heading>
            <Text scale="body-sm" tone="graphite">
              Thank you, {organization || 'Partner'}. Our team leader Huỳnh Khánh Tường
              (tuong.huynhnakitomo@hcmut.edu.vn) will share the DCF financial model, HCMUT telemetry
              dataset, and live RVM calendar slot to {email || 'your inbox'}.
            </Text>
            <div className="ds-pt-8">
              <ActionButton variant="surface-charcoal" onClick={handleResetAndClose}>
                Return to GreenGuard Overview
              </ActionButton>
            </div>
          </NestedCard>
        ) : (
          React.createElement(
            'form',
            { onSubmit: handleSubmit, className: 'flex flex-col ds-gap-20' },
            <TextField
              label="ORGANIZATION / COMPANY NAME"
              value={organization}
              onChange={setOrganization}
              placeholder="e.g., Duy Tan Recycling, PRO Vietnam, Suntory PepsiCo"
              required
            />,
            <TextField
              label="WORK EMAIL"
              value={email}
              onChange={setEmail}
              placeholder="name@company.com"
              type="email"
              required
            />,
            <SelectField
              label="PARTNERSHIP & DEPLOYMENT TRACK"
              value={partnerTrack}
              onChange={setPartnerTrack}
              options={[
                {
                  value: 'epr-offtake',
                  label: 'Food-Grade rPET / >95% Aluminum Feedstock Off-Take',
                },
                {
                  value: 'fmcg-epr',
                  label: 'FMCG EPR Audit Trail & Brand Voucher Sponsorship (Decree 08/110)',
                },
                {
                  value: 'campus-cluster',
                  label: 'High-Footfall Campus / 15-Unit Ward Cluster Deployment',
                },
                {
                  value: 'investor-dcf',
                  label: 'Unit Economics, DCF Model & Dow D4C Finalist Technical Deck',
                },
              ]}
            />,
            <NestedCard surface="soft-mist" className="flex flex-col ds-gap-6">
              <MonoLabel tone="obsidian">INCLUDED IN LIVE SESSION</MonoLabel>
              <Text scale="caption" tone="graphite">
                1. Physical RVM de-labeling, YOLOv8n dual optical grading &amp; 800N compaction demo
                at HCMUT. 2. Full 36-month DCF unit economics sheet &amp; EPR audit schema walk-through.
              </Text>
            </NestedCard>,
            <div className="flex items-center justify-end ds-gap-12 ds-pt-8">
              <ActionButton variant="surface-outline-light" onClick={handleResetAndClose}>
                Cancel
              </ActionButton>
              <ActionButton variant="surface-charcoal" type="submit">
                Confirm Demo &amp; Request Deck
              </ActionButton>
            </div>
          )
        )}
      </FlatCard>
    </div>
  )
}
