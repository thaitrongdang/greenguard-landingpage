import { useState } from 'react'
import tuongImg from '../assets/team/tuong-huynh.jpg'
import minhImg from '../assets/team/minh-huynh.jpg'
import vinhImg from '../assets/team/vinh-nguyen.jpg'
import dangImg from '../assets/team/dang-thai.jpg'
import khoaImg from '../assets/team/khoa-vi.jpg'
import nhatImg from '../assets/team/nhat-luong.jpg'

type Social = 'LinkedIn' | 'GitHub' | 'Email'

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  focus: string
  /** Add real profile URLs (or mailto:) here; icons without a URL render as non-interactive. */
  links?: Partial<Record<Social, string>>
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Huynh Khanh Tuong', role: 'PROJECT LEAD', bio: 'System architecture, firmware & commercial execution.', image: tuongImg, focus: '50% 12%' },
  { name: 'Huynh Hoa Minh', role: 'EMBEDDED SOFTWARE ENGINEER', bio: 'Offline-first SQLite database & real-time telemetry.', image: minhImg, focus: '50% 38%' },
  { name: 'Nguyen Trong Vinh', role: 'MECHANICAL ENGINEER', bio: '800N electric actuator mechanism & compaction dynamics.', image: vinhImg, focus: '50% 30%' },
  { name: 'Thai Trong Dang', role: 'MACHINE LEARNING ENGINEER', bio: 'Dual YOLOv8n models with >94.5% purity verification.', image: dangImg, focus: '50% 30%' },
  { name: 'Vi Tuan Khoa', role: 'SOFTWARE DEVELOPER', bio: 'GreenPoint consumer rewards & dynamic QR scoring engine.', image: khoaImg, focus: '50% 22%' },
  { name: 'Luong Thanh Nhat', role: 'FACULTY MENTOR', bio: 'Mechanical engineering faculty supervision & kinematic validation.', image: nhatImg, focus: '50% 20%' },
]

const SOCIALS: Social[] = ['LinkedIn', 'GitHub', 'Email']

function SocialGlyph({ kind }: { kind: Social }) {
  if (kind === 'LinkedIn')
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-1.8 3.39-1.8 3.63 0 4.25 2.2 4.25 5.05v6.25h-4v-5.5c0-1.32-.03-3-1.83-3-1.83 0-2.12 1.43-2.12 2.9v5.6h-4v-11Z" />
      </svg>
    )
  if (kind === 'GitHub')
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function TeamGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
      <circle cx="17" cy="9" r="2.7" />
      <path d="M16.5 14.6c2.6.2 4.4 2 5 4.9" />
    </svg>
  )
}

function Avatar({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="ds-team-avatar">
      {failed ? (
        <span className="ds-team-initials" role="img" aria-label={member.name}>{member.name.split(' ').map((p) => p[0]).join('').slice(0, 3)}</span>
      ) : (
        <img src={member.image} alt={member.name} loading="lazy" draggable={false} style={{ objectPosition: member.focus }} onError={() => setFailed(true)} />
      )}
    </div>
  )
}

export default function TeamSection() {
  return (
    <div className="ds-team ds-reveal">
      <span className="ds-team-mark"><TeamGlyph /></span>
      <h2 className="ds-team-title">Our Team</h2>
      <p className="ds-team-subtitle">
        The multidisciplinary engineering team from Ho Chi Minh City University of Technology (HCMUT) pioneering automated recycling infrastructure.
      </p>
      <div className="ds-team-grid ds-stagger">
        {TEAM_MEMBERS.map((m) => (
          <article key={m.name} className="ds-team-member">
            <Avatar member={m} />
            <span className="ds-team-role">{m.role}</span>
            <h3 className="ds-team-name">{m.name}</h3>
            <p className="ds-team-bio">{m.bio}</p>
            <div className="ds-team-socials">
              {SOCIALS.map((kind) => {
                const href = m.links?.[kind]
                return href ? (
                  <a key={kind} className="ds-team-social" href={href} target={kind === 'Email' ? undefined : '_blank'} rel="noopener noreferrer" aria-label={`${m.name} on ${kind}`}>
                    <SocialGlyph kind={kind} />
                  </a>
                ) : (
                  <span key={kind} className="ds-team-social" title={`${kind} — link not yet added`} aria-hidden="true">
                    <SocialGlyph kind={kind} />
                  </span>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
