import type { CSSProperties } from 'react'
import dowLogo from '../assets/logos/dow.png'
import bkiLogo from '../assets/logos/bach-khoa-innovation.png'
import utsLogo from '../assets/logos/uts.png'
import hcmutLogo from '../assets/logos/hcmut.png'

/*
 * Official logos with captions, in required order (UTS immediately before HCMUT).
 * The source PNGs carry large transparent margins, so each logo renders at `imgH`
 * inside a 26px-tall window of width `cropW` that shows only the artwork (no recolor
 * or distortion). With tightly trimmed files, set imgH to 26 and cropW to the logo width.
 */
const LOGOS = [
  { label: 'DOW CHEMICAL', alt: 'Dow Chemical logo', src: dowLogo, imgH: 26, cropW: 74, dy: 0 },
  { label: 'BACH KHOA INNOVATION 2026', alt: 'Bach Khoa Innovation 2026 logo', src: bkiLogo, imgH: 104, cropW: 86, dy: -5 },
  { label: 'UTS (UNIVERSITY OF TECHNOLOGY SYDNEY)', alt: 'UTS — University of Technology Sydney logo', src: utsLogo, imgH: 37, cropW: 28, dy: 0 },
  { label: 'HCMUT (VNU-HCM)', alt: 'HCMUT — Ho Chi Minh City University of Technology logo', src: hcmutLogo, imgH: 38, cropW: 28, dy: 1 },
]

export default function PartnerLogos() {
  return (
    <ul className="ds-logo-strip" aria-label="Partners and institutions">
      {LOGOS.map((logo) => (
        <li key={logo.label} className="ds-logo-badge">
          <span className="ds-logo-crop" style={{ '--crop-w': `${logo.cropW}px`, '--img-h': `${logo.imgH}px`, '--dy': `${logo.dy}px` } as CSSProperties}>
            <img src={logo.src} alt={logo.alt} loading="lazy" draggable={false} />
          </span>
          <span className="ds-logo-label">{logo.label}</span>
        </li>
      ))}
    </ul>
  )
}
