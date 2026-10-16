/**
 * Official GreenGuard horizontal lockup.
 * The symbol is cropped from /brand/greenguard-horizontal.png and its black backdrop is keyed out
 * with an SVG colour matrix so the three original greens sit cleanly on any surface.
 * The wordmark is live type so it can switch between white (dark) and Guard Deep Green (light).
 */
export default function BrandLogo({ surface = 'dark' }: { surface?: 'dark' | 'light' }) {
  return (
    <span className="ds-logo inline-flex items-center">
      <svg className="ds-logo-filter" aria-hidden="true" focusable="false">
        <filter id="gg-symbol-key" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -3 4 -2 0 -0.55" />
        </filter>
      </svg>
      <span className="ds-logo-symbol" aria-hidden="true">
        <img src="/brand/greenguard-horizontal.png" alt="" draggable={false} />
      </span>
      <span className={`ds-logo-wordmark ${surface === 'dark' ? 'ds-text-white' : 'ds-text-guard-green'}`}>GREENGUARD</span>
      <span className="sr-only">GreenGuard</span>
    </span>
  )
}
