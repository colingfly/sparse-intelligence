import { useState } from 'react'

const COLS = 24
const ROWS = 10
const COUNT = COLS * ROWS
const ACTIVE = 18
const SPACING_X = 36
const SPACING_Y = 24
const PAD = 20
const WIDTH = PAD * 2 + (COLS - 1) * SPACING_X
const HEIGHT = PAD * 2 + (ROWS - 1) * SPACING_Y
const DENSITY = (ACTIVE / COUNT).toFixed(3)

function sample() {
  const active = new Set()
  while (active.size < ACTIVE) active.add(Math.floor(Math.random() * COUNT))
  const ids = [...active]
  return { active, highlight: ids[Math.floor(Math.random() * ids.length)] }
}

export default function SparseField() {
  const [fig, setFig] = useState(0)
  const [field, setField] = useState(sample)

  function resample() {
    setField(sample())
    setFig(n => n + 1)
  }

  const dots = []
  for (let i = 0; i < COUNT; i++) {
    const x = PAD + (i % COLS) * SPACING_X
    const y = PAD + Math.floor(i / COLS) * SPACING_Y
    if (field.active.has(i)) {
      dots.push(
        <circle key={i} cx={x} cy={y} r="4.5" fill={i === field.highlight ? 'var(--landing-accent)' : 'var(--landing-ink)'} />
      )
    } else {
      dots.push(<circle key={i} cx={x} cy={y} r="1.6" fill="var(--landing-dot)" />)
    }
  }

  return (
    <figure className="landing-field">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${ACTIVE} of ${COUNT} nodes active`}>
        {dots}
      </svg>
      <figcaption>
        <span>fig. {fig} / {ACTIVE} of {COUNT} nodes active / density {DENSITY}</span>
        <button type="button" onClick={resample}>resample &#8635;</button>
      </figcaption>
    </figure>
  )
}
