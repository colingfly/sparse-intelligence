import { Link } from 'react-router-dom'
import Lockup from '../components/Lockup'
import SparseField from '../components/SparseField'
import './landing.css'

const CONTACT = 'hello@sparseintelligence.ai'

const AREAS = [
  {
    tag: '01',
    title: 'Evaluations for agent swarms',
    body: 'Enterprises are starting to run many agents against the same work. We build evaluations that measure what a group of agents actually gets done, where they disagree, and how that changes once they reach production.',
    questions: [
      'How do you score a result that no single agent produced?',
      'What is the smallest eval set that still predicts behavior in production?',
    ],
    glyph: {
      edges: [[10, 10, 28, 32], [28, 32, 44, 14], [28, 32, 18, 46]],
      nodes: [[10, 10], [44, 14], [18, 46], [28, 32]],
    },
  },
  {
    tag: '02',
    title: 'Robotic perception',
    body: 'A robot sees the world as a few strong signals inside a lot of empty space: point clouds, event cameras, depth returns. We work on perception models that treat that sparsity as structure instead of something to fill in.',
    questions: [
      'How much of a scene can be skipped before a robot acts differently?',
      'Can event cameras and LiDAR share one sparse representation?',
    ],
    glyph: {
      edges: [[8, 28, 40, 10], [8, 28, 40, 28], [8, 28, 40, 46]],
      nodes: [[40, 10], [40, 28], [40, 46], [8, 28]],
    },
  },
  {
    tag: '03',
    title: 'GPU performance and telemetry',
    body: 'Every claim about speed should come with a trace. We write kernels for sparse workloads and build tracking that shows where time and memory actually go, across single GPUs and whole clusters.',
    questions: [
      'Where does sparsity pay off on current hardware, and where does it not?',
      'What should a performance regression alert on?',
    ],
    glyph: {
      edges: [],
      nodes: [[8, 8], [20, 20], [32, 20], [20, 32], [44, 44]],
    },
  },
]

const NOTES = [
  {
    id: 'N.001',
    title: 'Diagnosing retrieval failures in multimodal RAG systems',
    tag: '01 evals',
    href: 'https://github.com/colingfly/sparse-eval',
  },
  {
    id: 'N.002',
    title: 'Foundation-model active learning for robot object discovery',
    tag: '02 perception',
    href: 'https://github.com/colingfly/sparse-robotics',
  },
  {
    id: 'N.003',
    title: 'GPU inference benchmarking with opinionated diagnostics',
    tag: '03 kernels',
    href: 'https://github.com/colingfly/sparse-gpu-perf',
  },
]

const GLYPH_GRID = [8, 20, 32, 44]

function Glyph({ edges, nodes }) {
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      <g fill="var(--landing-hair)">
        {GLYPH_GRID.map(x => GLYPH_GRID.map(y => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" />
        )))}
      </g>
      <g stroke="var(--landing-ink)" strokeWidth="1.6">
        {edges.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {nodes.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="var(--landing-ink)" />
      ))}
    </svg>
  )
}

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" aria-label="Sparse Intelligence home">
          <Lockup height={58} />
        </Link>
        <a className="landing-nav-contact" href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </nav>

      <header className="landing-hero">
        <p className="landing-crumb">sparse intelligence / research lab / est. 2026</p>
        <h1>Most of the signal lives<br />in very few places.</h1>
        <p className="landing-hero-sub">
          Sparse Intelligence is a research lab working on evaluations for enterprise
          agent swarms, robotic perception, and the GPU performance underneath both.
        </p>
        <SparseField />
      </header>

      <section className="landing-section" id="research">
        <p className="landing-section-label">§01</p>
        <div className="landing-section-head">
          <h2>Research</h2>
          <span className="landing-section-note">three areas, one method</span>
        </div>
        <div className="landing-areas">
          {AREAS.map(area => (
            <article className="landing-area" key={area.tag}>
              <div className="landing-area-top">
                <div className="landing-glyph"><Glyph {...area.glyph} /></div>
                <span className="landing-tag">{area.tag}</span>
              </div>
              <h3>{area.title}</h3>
              <p>{area.body}</p>
              <p className="landing-questions-label">open questions</p>
              <ul className="landing-questions">
                {area.questions.map(q => <li key={q}>{q}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="notes">
        <p className="landing-section-label">§02</p>
        <div className="landing-section-head">
          <h2>Notes</h2>
          <span className="landing-section-note">working papers and field reports</span>
        </div>
        <div className="landing-notes">
          {NOTES.map(note => (
            <a className="landing-note" key={note.id} href={note.href} target="_blank" rel="noopener noreferrer">
              <span className="landing-tag">{note.id}</span>
              <span className="landing-note-title">{note.title}</span>
              <span className="landing-tag landing-note-tag">{note.tag}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <Lockup height={34} ink="#F6F6F3" sub="#8a8a84" dot="#3a3a37" />
        <div className="landing-footer-right">
          <span>&copy; 2026 Sparse Intelligence</span>
          <span className="landing-footer-sep">&middot;</span>
          <span>compute less, measure more</span>
          <span className="landing-footer-sep">&middot;</span>
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          <span className="landing-footer-sep">&middot;</span>
          <Link to="/login">sign in</Link>
        </div>
      </footer>
    </div>
  )
}
