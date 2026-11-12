/* global __BUILD_SHA__, __BUILD_DATE__ */
import { Link } from 'react-router-dom'
import Lockup from '../components/Lockup'
import SparseField from '../components/SparseField'
import './landing.css'

const CONTACT = 'hello@sparseintelligence.ai'

const AREAS = [
  {
    n: '01',
    title: 'Evaluations for agent swarms',
    body: 'Enterprises are starting to run many agents against the same work. We build evaluations that measure what a group of agents actually gets done, where they disagree, and how that changes once they reach production.',
    questions: [
      'How do you score a result that no single agent produced?',
      'What is the smallest eval set that still predicts behavior in production?',
    ],
  },
  {
    n: '02',
    title: 'Robotic perception',
    body: 'A robot sees the world as a few strong signals inside a lot of empty space: point clouds, event cameras, depth returns. We work on perception models that treat that sparsity as structure instead of something to fill in.',
    questions: [
      'How much of a scene can be skipped before a robot acts differently?',
      'Can event cameras and LiDAR share one sparse representation?',
    ],
  },
  {
    n: '03',
    title: 'GPU performance and telemetry',
    body: 'Every claim about speed should come with a trace. We write kernels for sparse workloads and build tracking that shows where time and memory actually go, across single GPUs and whole clusters.',
    questions: [
      'Where does sparsity pay off on current hardware, and where does it not?',
      'What should a performance regression alert on?',
    ],
  },
]

const NOTES = [
  {
    id: 'N.001',
    title: 'Diagnosing retrieval failures in multimodal RAG systems',
    area: '01 evals',
    updated: '2026-11-08',
    href: 'https://github.com/colingfly/sparse-eval',
  },
  {
    id: 'N.002',
    title: 'Foundation-model active learning for robot object discovery',
    area: '02 perception',
    updated: '2026-11-08',
    href: 'https://github.com/colingfly/sparse-robotics',
  },
  {
    id: 'N.003',
    title: 'GPU inference benchmarking with opinionated diagnostics',
    area: '03 kernels',
    updated: '2026-11-08',
    href: 'https://github.com/colingfly/sparse-gpu-perf',
  },
]

const dash = n => '-'.repeat(n)
const gap = n => ' '.repeat(n)

const DIAGRAM = [
  `+${dash(27)}+   +${dash(27)}+`,
  `|${' [01] agent swarm evals'.padEnd(27)}|   |${' [02] robotic perception'.padEnd(27)}|`,
  `+${dash(13)}+${dash(13)}+   +${dash(13)}+${dash(13)}+`,
  `${gap(14)}|${gap(31)}|`,
  `+${dash(13)}+${dash(31)}+${dash(13)}+`,
  `|${' [03] gpu performance and telemetry'.padEnd(59)}|`,
  `+${dash(59)}+`,
].join('\n')

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-top">
        <Link to="/" aria-label="Sparse Intelligence home">
          <Lockup height={52} />
        </Link>
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </header>

      <p className="landing-meta">
        <span>sparse intelligence</span>
        <span>research lab</span>
        <span>est. 2026</span>
        <span>updated {__BUILD_DATE__}</span>
        <span>build {__BUILD_SHA__}</span>
      </p>

      <section className="landing-intro">
        <h1>Most of the signal lives in very few places.</h1>
        <p>
          Sparse Intelligence is a research lab working on evaluations for enterprise
          agent swarms, robotic perception, and the GPU performance underneath both.
        </p>
      </section>

      <SparseField />

      <h2 className="landing-bar"><span>[01] RESEARCH</span><span>3 areas</span></h2>
      <figure className="landing-diagram">
        <pre>{DIAGRAM}</pre>
        <figcaption>structure: [01] and [02] are both measured on [03].</figcaption>
      </figure>
      <table className="landing-table landing-research">
        <thead>
          <tr>
            <th scope="col">n</th>
            <th scope="col">area</th>
            <th scope="col">open questions</th>
          </tr>
        </thead>
        <tbody>
          {AREAS.map(area => (
            <tr key={area.n}>
              <td>{area.n}</td>
              <td>
                <h3>{area.title}</h3>
                <p>{area.body}</p>
              </td>
              <td>
                <details open>
                  <summary>{area.questions.length} open</summary>
                  <ul>
                    {area.questions.map(q => <li key={q}>{q}</li>)}
                  </ul>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="landing-bar"><span>[02] NOTES</span><span>{NOTES.length} entries</span></h2>
      <table className="landing-table landing-notes">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">title</th>
            <th scope="col">area</th>
            <th scope="col">updated</th>
          </tr>
        </thead>
        <tbody>
          {NOTES.map(note => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td><a href={note.href} target="_blank" rel="noopener noreferrer">{note.title}</a></td>
              <td>{note.area}</td>
              <td>{note.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="landing-bar"><span>[03] COLOPHON</span><span>this page</span></h2>
      <table className="landing-table landing-colophon">
        <tbody>
          <tr>
            <th scope="row">type</th>
            <td>IBM Plex Mono 14px for everything. Space Grotesk 700 for the headline only.</td>
          </tr>
          <tr>
            <th scope="row">color</th>
            <td>#F6F6F3 background, #000000 text, #2F5BFF for links and the logo node.</td>
          </tr>
          <tr>
            <th scope="row">motion</th>
            <td>none</td>
          </tr>
          <tr>
            <th scope="row">build</th>
            <td>built {__BUILD_DATE__} (utc) from commit {__BUILD_SHA__}</td>
          </tr>
          <tr>
            <th scope="row">contact</th>
            <td><a href={`mailto:${CONTACT}`}>{CONTACT}</a></td>
          </tr>
        </tbody>
      </table>

      <footer className="landing-footer">
        <Lockup height={32} ink="#FFFFFF" sub="#999999" dot="#444444" />
        <p>
          &copy; 2026 Sparse Intelligence / compute less, measure more
          / <a href={`mailto:${CONTACT}`}>{CONTACT}</a> / <Link to="/login">sign in</Link>
        </p>
      </footer>
    </div>
  )
}
