import { useEffect, useState } from 'react'
import DotGrid from './DotGrid'

// WebGL needs literal colors, so resolve palette tokens from the CSS at runtime.
function useTokenColor(name: string, fallback: string) {
  const [color, setColor] = useState(fallback)
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    if (v) setColor(v)
  }, [name])
  return color
}

export default function DotBackdrop() {
  const base = useTokenColor('--color-forest-sovereignty', '#113821')
  const active = useTokenColor('--color-guard-green', '#085e24')
  return (
    <div className="ds-dot-backdrop" aria-hidden="true">
      <DotGrid baseColor={base} activeColor={active} shape="circle" dotSize={3} gap={11} proximity={95} strength={0.5} bounce={0.1} tension={0.4} returnDuration={1.4} shockRadius={320} shockStrength={5} swell={0.4} stretch={0.05} glow={0.25} fade={0.5} intro={false} clickShock={false} />
    </div>
  )
}
