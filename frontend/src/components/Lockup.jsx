const GRID = [0, 1, 2, 3]

export default function Lockup({ height = 36, ink = '#111111', sub = '#5F5F58', dot = '#DCDCD5', accent = '#2F5BFF' }) {
  return (
    <svg height={height} viewBox="0 0 430 120" aria-label="Sparse Intelligence">
      <g fill={dot}>
        {GRID.map(r => GRID.map(c => (
          <circle key={`${r}${c}`} cx={14 + c * 28} cy={18 + r * 28} r="2" />
        )))}
      </g>
      <path d="M98 22 22 78l48 20z" stroke={ink} strokeWidth="2.6" fill="none" />
      <circle cx="22" cy="78" r="6" fill={ink} />
      <circle cx="70" cy="98" r="6" fill={ink} />
      <circle cx="98" cy="22" r="7" fill={accent} />
      <text x="130" y="68" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="54" letterSpacing="-1" fill={ink}>sparse</text>
      <text x="133" y="98" fontFamily="'Space Grotesk', sans-serif" fontWeight="500" fontSize="19" letterSpacing="7" fill={sub}>INTELLIGENCE</text>
    </svg>
  )
}
