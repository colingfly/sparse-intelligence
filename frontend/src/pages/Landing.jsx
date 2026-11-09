import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

/* Brand lockup as SVG so it recolors on dark surfaces. */
function Lockup({ ink = '#0E0F11', sub = '#55554F', blue = '#2D5BFF', dot = '#CFCDC4', height = 40 }) {
  return (
    <svg height={height} viewBox="0 0 430 120" aria-label="Sparse Intelligence">
      <g fill={dot}>
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => (
            <circle key={`${r}-${c}`} cx={14 + c * 28} cy={18 + r * 28} r="2" />
          ))
        )}
      </g>
      <g stroke={ink} strokeWidth="2.6" fill="none">
        <path d="M 98 22 L 22 78 L 70 98 Z" />
      </g>
      <circle cx="22" cy="78" r="6" fill={ink} />
      <circle cx="70" cy="98" r="6" fill={ink} />
      <circle cx="98" cy="22" r="7" fill={blue} />
      <text x="130" y="68" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="54" fill={ink} letterSpacing="-1">sparse</text>
      <text x="133" y="98" fontFamily="'Space Grotesk', sans-serif" fontWeight="500" fontSize="19" fill={sub} letterSpacing="7">INTELLIGENCE</text>
    </svg>
  )
}

/* Interactive sparse field: 240 nodes, 18 active, one of them blue. */
const FIELD_COLS = 24
const FIELD_ROWS = 10
const FIELD_N = FIELD_COLS * FIELD_ROWS
const FIELD_ACTIVE = 18

function sampleField() {
  const idx = new Set()
  while (idx.size < FIELD_ACTIVE) idx.add(Math.floor(Math.random() * FIELD_N))
  const arr = [...idx]
  return { active: idx, blue: arr[Math.floor(Math.random() * arr.length)] }
}

function SparseField() {
  const [fig, setFig] = useState(0)
  const [field, setField] = useState(() => sampleField())
  const density = (FIELD_ACTIVE / FIELD_N).toFixed(3)

  const dots = useMemo(() => {
    const out = []
    for (let r = 0; r < FIELD_ROWS; r++) {
      for (let c = 0; c < FIELD_COLS; c++) {
        const i = r * FIELD_COLS + c
        const x = 20 + c * 36
        const y = 20 + r * 24
        if (field.active.has(i)) {
          out.push(<circle key={i} cx={x} cy={y} r="4.5" fill={i === field.blue ? '#2D5BFF' : '#0E0F11'} />)
        } else {
          out.push(<circle key={i} cx={x} cy={y} r="1.6" fill="#CFCDC4" />)
        }
      }
    }
    return out
  }, [field])

  return (
    <div className="rl-field">
      <svg viewBox={`0 0 ${40 + (FIELD_COLS - 1) * 36} ${40 + (FIELD_ROWS - 1) * 24}`} role="img"
        aria-label={`${FIELD_ACTIVE} of ${FIELD_N} nodes active`}>
        {dots}
      </svg>
      <div className="rl-field-bar">
        <span>fig. {fig} / {FIELD_ACTIVE} of {FIELD_N} nodes active / density {density}</span>
        <button onClick={() => { setField(sampleField()); setFig(f => f + 1) }}>resample ↻</button>
      </div>
    </div>
  )
}

/* Small scatter glyphs for the three research areas. */
const GLYPHS = {
  evals: (
    <svg viewBox="0 0 56 56">
      <g fill="#CFCDC4">{[8, 20, 32, 44].map(x => [8, 20, 32, 44].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" />))}</g>
      <g stroke="#0E0F11" strokeWidth="1.6" fill="none"><path d="M 10 10 L 28 32 M 28 32 L 44 14 M 28 32 L 18 46" /></g>
      <circle cx="10" cy="10" r="3" fill="#0E0F11" /><circle cx="44" cy="14" r="3" fill="#0E0F11" />
      <circle cx="18" cy="46" r="3" fill="#0E0F11" /><circle cx="28" cy="32" r="3.5" fill="#2D5BFF" />
    </svg>
  ),
  perception: (
    <svg viewBox="0 0 56 56">
      <g fill="#CFCDC4">{[8, 20, 32, 44].map(x => [8, 20, 32, 44].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" />))}</g>
      <g stroke="#0E0F11" strokeWidth="1.6" fill="none"><path d="M 8 28 L 40 10 M 8 28 L 40 28 M 8 28 L 40 46" /></g>
      <circle cx="8" cy="28" r="3.5" fill="#2D5BFF" /><circle cx="40" cy="10" r="3" fill="#0E0F11" />
      <circle cx="40" cy="28" r="3" fill="#0E0F11" /><circle cx="40" cy="46" r="3" fill="#0E0F11" />
    </svg>
  ),
  kernels: (
    <svg viewBox="0 0 56 56">
      <g fill="#CFCDC4">{[8, 20, 32, 44].map(x => [8, 20, 32, 44].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" />))}</g>
      <circle cx="8" cy="8" r="3" fill="#0E0F11" /><circle cx="20" cy="20" r="3" fill="#0E0F11" />
      <circle cx="32" cy="20" r="3" fill="#0E0F11" /><circle cx="20" cy="32" r="3" fill="#0E0F11" />
      <circle cx="44" cy="44" r="3.5" fill="#2D5BFF" />
    </svg>
  ),
}

const AREAS = [
  {
    tag: '§01', key: 'evals', title: 'Evaluations for agent swarms',
    body: 'Enterprises are starting to run many agents against the same work. We build evaluations that measure what a group of agents actually gets done, where they disagree, and how that changes once they reach production.',
    questions: [
      'How do you score a result that no single agent produced?',
      'Which disagreements between agents carry signal and which are noise?',
      'What is the smallest eval set that still predicts behavior in production?',
    ],
  },
  {
    tag: '§02', key: 'perception', title: 'Perception for robots',
    body: 'A robot sees the world as a few strong signals inside a lot of empty space: point clouds, event cameras, depth returns. We work on perception models that treat that sparsity as structure instead of something to fill in.',
    questions: [
      'How much of a scene can be skipped before a robot acts differently?',
      'Can event cameras and LiDAR share one sparse representation?',
      'How should perception be evaluated outside the lab?',
    ],
  },
  {
    tag: '§03', key: 'kernels', title: 'GPU performance and telemetry',
    body: 'Every claim about speed should come with a trace. We write kernels for sparse workloads and build tracking that shows where time and memory actually go, across single GPUs and whole clusters.',
    questions: [
      'Where does sparsity pay off on current hardware, and where does it not?',
      'What should a performance regression alert on?',
      'How do you attribute cost to a single agent inside a swarm?',
    ],
  },
]

const AXIOMS = [
  { n: 'I', title: 'Most of the matrix is zero.', body: 'The useful part of a problem is usually small. Finding it is most of the work.' },
  { n: 'II', title: 'Measure before you optimize.', body: 'An optimization without a trace is a guess.' },
  { n: 'III', title: 'The field is the lab.', body: 'Results count once they hold up on real robots, real clusters and real enterprise workloads.' },
  { n: 'IV', title: 'Publish the method.', body: 'Evals, kernels and tools leave the lab with enough detail for someone else to rerun them.' },
]

const NOTES = [
  { n: 'N.001', title: 'Diagnosing retrieval failures in multimodal RAG systems', tag: '§01 evals', href: 'https://github.com/colingfly/sparse-eval' },
  { n: 'N.002', title: 'Foundation-model active learning for robot object discovery', tag: '§02 perception', href: 'https://github.com/colingfly/sparse-robotics' },
  { n: 'N.003', title: 'GPU inference benchmarking with opinionated diagnostics', tag: '§03 kernels', href: 'https://github.com/colingfly/sparse-gpu-perf' },
]

export default function Landing() {
  return (
    <div className="rl">
      <style>{styles}</style>

      <nav className="rl-nav">
        <Link to="/" className="rl-logo" aria-label="Sparse Intelligence home">
          <Lockup height={36} />
        </Link>
        <div className="rl-nav-links">
          <a href="#research">§ research</a>
          <a href="#axioms">§ axioms</a>
          <a href="#notes">§ notes</a>
          <a href="#join">§ join</a>
        </div>
      </nav>

      <header className="rl-hero">
        <p className="rl-crumb">SPARSE INTELLIGENCE / RESEARCH LAB / EST. 2026</p>
        <h1>Most of the signal lives<br />in very few places.</h1>
        <p className="rl-hero-sub">
          Sparse Intelligence is a research lab working on evaluations for enterprise
          agent swarms, perception for robots, and the GPU performance underneath both.
        </p>
        <div className="rl-hero-actions">
          <a href="#research" className="rl-btn-fill">Read the research areas</a>
          <a href="mailto:hello@sparseintelligence.ai?subject=Working%20together" className="rl-btn-line">Work with us</a>
        </div>
        <SparseField />
      </header>

      <section className="rl-section" id="research">
        <div className="rl-section-head">
          <h2>Research</h2>
          <span className="rl-section-note">three areas, one method</span>
        </div>
        <div className="rl-areas">
          {AREAS.map(a => (
            <div className="rl-area" key={a.key}>
              <div className="rl-area-top">
                <div className="rl-glyph">{GLYPHS[a.key]}</div>
                <span className="rl-tag">{a.tag}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <p className="rl-oq-label">OPEN QUESTIONS</p>
              <ul className="rl-oq">
                {a.questions.map(q => <li key={q}>{q}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rl-section rl-dark" id="axioms">
        <div className="rl-section-head">
          <h2>Axioms</h2>
          <span className="rl-section-note">how the lab works</span>
        </div>
        <div className="rl-axioms">
          {AXIOMS.map(a => (
            <div className="rl-axiom" key={a.n}>
              <span className="rl-tag rl-tag-dark">{a.n}</span>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rl-section" id="notes">
        <div className="rl-section-head">
          <h2>Notes</h2>
          <span className="rl-section-note">working papers and field reports</span>
        </div>
        <div className="rl-notes">
          {NOTES.map(n => (
            <a className="rl-note" key={n.n} href={n.href} target="_blank" rel="noopener noreferrer">
              <span className="rl-note-n">{n.n}</span>
              <span className="rl-note-title">{n.title}</span>
              <span className="rl-note-tag">{n.tag}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="rl-section" id="join">
        <div className="rl-join">
          <p className="rl-tag">§ join</p>
          <h2>We hire a small number of people and give them hard, specific problems.</h2>
          <div className="rl-join-row">
            <p>
              Researchers and engineers in evaluation, robot perception and GPU systems.
              Partners with workloads worth measuring are welcome too.
            </p>
            <a href="mailto:hello@sparseintelligence.ai?subject=Join" className="rl-btn-blue">hello@sparseintelligence.ai</a>
          </div>
        </div>
      </section>

      <footer className="rl-footer">
        <Lockup ink="#F5F4EF" sub="#8a8a84" dot="#3a3a37" height={34} />
        <div className="rl-footer-right">
          <span>© 2026 Sparse Intelligence</span>
          <span className="rl-footer-sep">·</span>
          <span>compute less, measure more</span>
          <span className="rl-footer-sep">·</span>
          <Link to="/login">sign in</Link>
        </div>
      </footer>
    </div>
  )
}

const styles = `
  .rl {
    --paper: #F7F6F1;
    --card: #FBFAF6;
    --ink: #0E0F11;
    --ink-soft: #55554F;
    --blue: #2D5BFF;
    --dot: #CFCDC4;
    --hair: #DEDCD2;
    background: var(--paper);
    color: var(--ink);
    font-family: 'DM Sans', system-ui, sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .rl h1, .rl h2, .rl h3 { font-family: 'Space Grotesk', sans-serif; }
  .rl ::selection { background: var(--blue); color: #fff; }

  .rl-nav {
    display: flex; align-items: center; justify-content: space-between;
    max-width: 1140px; margin: 0 auto;
    padding: 22px 32px;
  }
  .rl-logo { display: block; }
  .rl-nav-links { display: flex; gap: 26px; }
  .rl-nav-links a {
    font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;
    color: var(--ink-soft); text-decoration: none;
  }
  .rl-nav-links a:hover { color: var(--ink); }

  .rl-hero { max-width: 1140px; margin: 0 auto; padding: 60px 32px 40px; }
  .rl-crumb {
    font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
    letter-spacing: 0.14em; color: var(--ink-soft); margin: 0 0 30px;
  }
  .rl-hero h1 {
    font-size: clamp(2.6rem, 6vw, 4.6rem);
    font-weight: 700; letter-spacing: -0.03em; line-height: 1.03;
    margin: 0 0 26px;
  }
  .rl-hero-sub {
    font-size: 1.08rem; line-height: 1.65; color: var(--ink-soft);
    max-width: 560px; margin: 0 0 30px;
  }
  .rl-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 56px; }

  .rl-btn-fill, .rl-btn-line, .rl-btn-blue {
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.92rem;
    text-decoration: none; padding: 11px 20px; border-radius: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .rl-btn-fill { background: var(--ink); color: var(--paper); border: 1px solid var(--ink); }
  .rl-btn-fill:hover { background: #2a2b2e; }
  .rl-btn-line { background: transparent; color: var(--ink); border: 1px solid var(--ink); }
  .rl-btn-line:hover { background: var(--ink); color: var(--paper); }
  .rl-btn-blue { background: var(--blue); color: #fff; border: 1px solid var(--blue); white-space: nowrap; }
  .rl-btn-blue:hover { background: #1f47e0; }

  .rl-field { border: 1px solid var(--hair); background: var(--card); padding: 18px 18px 12px; }
  .rl-field svg { width: 100%; height: auto; display: block; }
  .rl-field-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 10px; gap: 12px; flex-wrap: wrap;
  }
  .rl-field-bar span {
    font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; color: var(--ink-soft);
  }
  .rl-field-bar button {
    font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
    color: var(--ink); background: var(--paper);
    border: 1px solid var(--ink); border-radius: 0;
    padding: 6px 14px; cursor: pointer;
  }
  .rl-field-bar button:hover { background: var(--ink); color: var(--paper); }

  .rl-section { max-width: 1140px; margin: 0 auto; padding: 84px 32px 64px; }
  .rl-section-head {
    display: flex; align-items: baseline; justify-content: space-between;
    border-bottom: 1px solid var(--hair); padding-bottom: 16px; margin-bottom: 0;
  }
  .rl-section-head h2 {
    font-size: clamp(1.7rem, 3vw, 2.3rem); font-weight: 700;
    letter-spacing: -0.02em; margin: 0;
  }
  .rl-section-note {
    font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; color: var(--ink-soft);
  }

  .rl-areas {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 44px;
    padding-top: 34px;
  }
  .rl-area-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 14px;
  }
  .rl-glyph { width: 52px; height: 52px; }
  .rl-glyph svg { width: 100%; height: 100%; }
  .rl-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: var(--ink-soft);
  }
  .rl-tag-dark { color: #8a8a84; }
  .rl-area h3 { font-size: 1.32rem; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 12px; }
  .rl-area p { color: var(--ink-soft); line-height: 1.62; margin: 0 0 10px; font-size: 0.95rem; }
  .rl-oq-label {
    font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.12em;
    color: var(--ink-soft); margin: 22px 0 0 !important;
  }
  .rl-oq { list-style: none; margin: 6px 0 0; padding: 0; }
  .rl-oq li {
    font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; line-height: 1.5;
    color: var(--ink); padding: 10px 0;
    border-top: 1px solid var(--hair);
  }

  .rl-dark { max-width: none; background: var(--ink); color: var(--paper); }
  .rl-dark > * { max-width: 1076px; margin-left: auto; margin-right: auto; }
  .rl-dark .rl-section-head { border-bottom-color: #2a2a28; }
  .rl-dark h2 { color: var(--paper); }
  .rl-axioms {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
    padding-top: 34px;
  }
  .rl-axiom { border-top: 1px solid #2a2a28; padding-top: 14px; }
  .rl-axiom h3 { font-size: 1.12rem; font-weight: 700; margin: 10px 0 10px; color: var(--paper); }
  .rl-axiom p { color: #a7a6a0; line-height: 1.6; font-size: 0.9rem; margin: 0; }

  .rl-notes { padding-top: 10px; }
  .rl-note {
    display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; align-items: baseline;
    padding: 20px 4px; border-bottom: 1px solid var(--hair);
    text-decoration: none; color: var(--ink);
  }
  .rl-note:hover .rl-note-title { color: var(--blue); }
  .rl-note-n, .rl-note-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; color: var(--ink-soft);
  }
  .rl-note-title { font-weight: 600; font-size: 1.02rem; }

  .rl-join {
    border: 1px solid var(--ink); background: var(--card);
    padding: 40px 44px 44px;
  }
  .rl-join .rl-tag { display: block; margin-bottom: 14px; }
  .rl-join h2 {
    font-size: clamp(1.6rem, 3.2vw, 2.4rem); font-weight: 700;
    letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 24px; max-width: 640px;
  }
  .rl-join-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 28px; flex-wrap: wrap;
  }
  .rl-join-row p { color: var(--ink-soft); line-height: 1.6; max-width: 520px; margin: 0; font-size: 0.95rem; }

  .rl-footer { background: var(--ink); margin-top: 40px; }
  .rl-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 30px 32px; gap: 20px; flex-wrap: wrap;
  }
  .rl-footer-right {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; color: #8a8a84;
  }
  .rl-footer-right a { color: #8a8a84; text-decoration: none; }
  .rl-footer-right a:hover { color: var(--paper); }
  .rl-footer-sep { color: #3a3a37; }

  @media (max-width: 940px) {
    .rl-areas { grid-template-columns: 1fr; gap: 36px; }
    .rl-axioms { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .rl-nav { padding: 16px 18px; }
    .rl-nav-links { gap: 14px; }
    .rl-nav-links a { font-size: 0.78rem; }
    .rl-hero { padding: 40px 18px 30px; }
    .rl-section { padding: 60px 18px 44px; }
    .rl-axioms { grid-template-columns: 1fr; }
    .rl-note { grid-template-columns: 64px 1fr; }
    .rl-note-tag { grid-column: 2; }
    .rl-join { padding: 28px 22px 30px; }
  }
`
