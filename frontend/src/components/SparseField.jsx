import { useMemo, useState } from 'react'

const COLS = 48
const ROWS = 12
const COUNT = COLS * ROWS
const ACTIVE = 20
const STEP = 24
const PAD = 16
const WIDTH = PAD * 2 + (COLS - 1) * STEP
const HEIGHT = PAD * 2 + (ROWS - 1) * STEP
const SKIPPED = (100 * (1 - ACTIVE / COUNT)).toFixed(1)

function mulberry32(seed) {
  let a = seed
  return () => {
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function sample(seed) {
  const next = mulberry32(seed)
  const active = new Set()
  while (active.size < ACTIVE) active.add(Math.floor(next() * COUNT))
  return [...active].sort((a, b) => a - b)
}

function newSeed() {
  return Math.floor(Math.random() * 2 ** 32)
}

export default function SparseField() {
  const [fig, setFig] = useState(0)
  const [seed, setSeed] = useState(newSeed)
  const active = useMemo(() => sample(seed), [seed])
  const activeSet = useMemo(() => new Set(active), [active])

  function resample() {
    setSeed(newSeed())
    setFig(n => n + 1)
  }

  const dots = []
  for (let i = 0; i < COUNT; i++) {
    const x = PAD + (i % COLS) * STEP
    const y = PAD + Math.floor(i / COLS) * STEP
    dots.push(<circle key={i} cx={x} cy={y} r={activeSet.has(i) ? 5 : 1.1} fill="#000" />)
  }

  const coo = active.map(i => `(${Math.floor(i / COLS)},${i % COLS})`).join(' ')
  const hex = `0x${seed.toString(16).padStart(8, '0')}`

  return (
    <figure className="landing-field">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${ACTIVE} of ${COUNT} lattice nodes active`}>
        {dots}
      </svg>
      <figcaption>
        <div className="landing-field-row">
          <span>
            fig. {fig} / seed {hex} / {ROWS}x{COLS} lattice / {ACTIVE} of {COUNT} values stored / {SKIPPED}% skipped
          </span>
          <button type="button" onClick={resample}>resample</button>
        </div>
        <div>coo (row,col): {coo}</div>
      </figcaption>
    </figure>
  )
}
