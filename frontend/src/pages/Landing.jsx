import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* The logo mark, recreated as SVG so it scales and recolors anywhere.
   Geometry mirrors the brand PNG: dot grid, three connected nodes, blue apex. */
function Mark({ size = 220, dot = '#C9C6BC', ink = '#141414', blue = '#2D5BFF', animate = false }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 360 360"
      className={animate ? 'si-mark si-mark-animate' : 'si-mark'}
      aria-hidden="true"
    >
      <g fill={dot}>
        {[0, 1, 2, 3, 4, 5, 6].map(r =>
          [0, 1, 2, 3, 4, 5, 6].map(c => (
            <circle key={`${r}-${c}`} cx={36 + c * 48} cy={36 + r * 48} r="3.2" />
          ))
        )}
      </g>
      <g stroke={ink} strokeWidth="4" fill="none" className="si-mark-edges">
        <path d="M 276 84 L 84 228" />
        <path d="M 84 228 L 204 276" />
        <path d="M 204 276 L 276 84" />
      </g>
      <circle cx="84" cy="228" r="11" fill={ink} />
      <circle cx="204" cy="276" r="11" fill={ink} />
      <circle cx="276" cy="84" r="13" fill={blue} className="si-mark-apex" />
    </svg>
  )
}

/* Full lockup in SVG, usable on dark backgrounds where the PNG cannot go. */
function Lockup({ ink = '#141414', sub = '#4a4a46', blue = '#2D5BFF', dot = '#C9C6BC', height = 56 }) {
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
      <text x="130" y="68" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="56" fill={ink} letterSpacing="-1">sparse</text>
      <text x="133" y="98" fontFamily="Outfit, sans-serif" fontWeight="500" fontSize="19" fill={sub} letterSpacing="7">INTELLIGENCE</text>
    </svg>
  )
}

/* Small node-graph glyphs, one per service, same visual language as the mark. */
const GLYPHS = {
  audit: (
    <svg viewBox="0 0 48 48"><g stroke="#141414" strokeWidth="2" fill="none"><path d="M 12 36 L 24 14 L 36 30" /></g>
      <circle cx="12" cy="36" r="4" fill="#141414" /><circle cx="36" cy="30" r="4" fill="#141414" /><circle cx="24" cy="14" r="4.5" fill="#2D5BFF" /></svg>
  ),
  docs: (
    <svg viewBox="0 0 48 48"><g stroke="#141414" strokeWidth="2" fill="none"><path d="M 10 14 L 38 14 M 10 24 L 30 24 M 10 34 L 24 34" /></g>
      <circle cx="38" cy="14" r="4.5" fill="#2D5BFF" /><circle cx="10" cy="24" r="3.5" fill="#141414" /><circle cx="24" cy="34" r="3.5" fill="#141414" /></svg>
  ),
  flow: (
    <svg viewBox="0 0 48 48"><g stroke="#141414" strokeWidth="2" fill="none"><path d="M 8 24 L 20 24 L 28 12 M 20 24 L 28 36" /></g>
      <circle cx="8" cy="24" r="3.5" fill="#141414" /><circle cx="28" cy="12" r="4.5" fill="#2D5BFF" /><circle cx="28" cy="36" r="3.5" fill="#141414" /></svg>
  ),
  chat: (
    <svg viewBox="0 0 48 48"><g stroke="#141414" strokeWidth="2" fill="none"><path d="M 12 32 Q 8 32 8 26 L 8 16 Q 8 10 14 10 L 34 10 Q 40 10 40 16 L 40 26 Q 40 32 34 32 L 22 32 L 14 40 Z" /></g>
      <circle cx="18" cy="21" r="2.5" fill="#141414" /><circle cx="26" cy="21" r="2.5" fill="#141414" /><circle cx="34" cy="21" r="2.5" fill="#2D5BFF" /></svg>
  ),
  measure: (
    <svg viewBox="0 0 48 48"><g stroke="#141414" strokeWidth="2" fill="none"><path d="M 10 38 L 10 24 M 24 38 L 24 14 M 38 38 L 38 30" /></g>
      <circle cx="10" cy="24" r="3.5" fill="#141414" /><circle cx="24" cy="14" r="4.5" fill="#2D5BFF" /><circle cx="38" cy="30" r="3.5" fill="#141414" /></svg>
  ),
  train: (
    <svg viewBox="0 0 48 48"><g stroke="#141414" strokeWidth="2" fill="none"><path d="M 12 16 L 36 16 M 12 16 L 12 34 M 12 34 L 36 34 M 36 16 L 36 34 M 12 25 L 36 25" opacity="0.35" /><path d="M 12 34 L 24 16 L 36 34" /></g>
      <circle cx="24" cy="16" r="4.5" fill="#2D5BFF" /><circle cx="12" cy="34" r="3.5" fill="#141414" /><circle cx="36" cy="34" r="3.5" fill="#141414" /></svg>
  ),
}

const SERVICES = [
  { glyph: 'audit', title: 'AI opportunity audit', body: 'We map how your business runs and identify where AI actually saves time or money. You get a prioritized plan with cost and effort estimates, not a pitch deck.' },
  { glyph: 'docs', title: 'Document intelligence', body: 'Ask questions across your contracts, SOPs, invoices, and records. Answers cite their sources so your team can verify instead of guessing.' },
  { glyph: 'flow', title: 'Workflow automation', body: 'Intake, scheduling, follow-ups, reporting. We automate the recurring work your team does by hand, and leave humans in the loop where it matters.' },
  { glyph: 'chat', title: 'Customer-facing assistants', body: 'Chat on your website that answers from your real business information, in your voice, with limits on what it is allowed to say.' },
  { glyph: 'measure', title: 'Measurement and reliability', body: 'Everything we ship is tested and scored before it touches a customer. You see the accuracy numbers and decide what is good enough.' },
  { glyph: 'train', title: 'Team training', body: 'We train your staff to use AI tools well: what to trust, what to check, and how to get consistent results day to day.' },
]

export default function Landing() {
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('lp-visible')
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    const els = containerRef.current?.querySelectorAll('.lp-reveal')
    els?.forEach(el => observer.observe(el))
    return () => els?.forEach(el => observer.unobserve(el))
  }, [])

  return (
    <div ref={containerRef} className="lp">
      <style>{landingStyles}</style>

      <nav className="lp-nav">
        <Link to="/" className="lp-logo" aria-label="Sparse Intelligence home">
          <Lockup height={40} />
        </Link>
        <div className="lp-nav-links">
          <a href="#services">services</a>
          <a href="#process">process</a>
          <a href="#about">about</a>
          <a href="#contact">contact</a>
          <Link to="/login" className="lp-nav-cta">client sign in</Link>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <div className="lp-kicker lp-reveal"><span className="lp-node lp-node-blue" />ai consultancy for small business</div>
            <h1 className="lp-reveal">
              A few well-chosen<br />systems. <span className="lp-blue">Measured.</span><br />Nothing else.
            </h1>
            <p className="lp-hero-sub lp-reveal">
              Most businesses do not need an AI transformation. They need sparse AI:
              the two or three places where it genuinely saves hours, built properly,
              with accuracy you can see before it touches a customer.
            </p>
            <div className="lp-hero-actions lp-reveal">
              <a href="mailto:hello@sparseintelligence.ai?subject=Consultation%20request" className="lp-btn-fill">
                Book a free consultation
              </a>
              <a href="#services" className="lp-btn-ghost">What we do</a>
            </div>
            <p className="lp-hero-note lp-reveal">
              30 minutes, no cost. If AI is not worth it for your business, we say so.
            </p>
          </div>
          <div className="lp-hero-mark lp-reveal">
            <Mark size={430} animate />
          </div>
        </div>
      </section>

      <div className="lp-rule" aria-hidden="true">
        <span className="lp-node" /><span className="lp-rule-line" /><span className="lp-node lp-node-blue" /><span className="lp-rule-line" /><span className="lp-node" />
      </div>

      <section className="lp-section" id="services">
        <div className="lp-section-inner">
          <div className="lp-section-head lp-reveal">
            <span className="lp-index">01</span>
            <h2>what we do</h2>
          </div>
          <p className="lp-section-sub lp-reveal">
            Every engagement starts with your operations, not with a tool we want to sell.
          </p>
          <div className="lp-cards">
            {SERVICES.map(s => (
              <div className="lp-card lp-reveal" key={s.glyph}>
                <div className="lp-glyph">{GLYPHS[s.glyph]}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-dark" id="process">
        <div className="lp-section-inner">
          <div className="lp-section-head lp-reveal">
            <span className="lp-index lp-index-dark">02</span>
            <h2>how an engagement works</h2>
          </div>
          <div className="lp-timeline lp-reveal" aria-hidden="true">
            <span className="lp-tl-node lp-tl-blue" /><span className="lp-tl-line" /><span className="lp-tl-node" /><span className="lp-tl-line" /><span className="lp-tl-node" />
          </div>
          <div className="lp-steps">
            <div className="lp-step lp-reveal">
              <h3><span className="lp-step-k">discovery</span></h3>
              <p>Free, 30 minutes. We learn how your business runs and tell you where AI fits. If it does not fit, we say so.</p>
            </div>
            <div className="lp-step lp-reveal">
              <h3><span className="lp-step-k">pilot</span></h3>
              <p>One workflow, two to four weeks, fixed price. We build it, test it against your real cases, and show you the numbers.</p>
            </div>
            <div className="lp-step lp-reveal">
              <h3><span className="lp-step-k">scale</span></h3>
              <p>What works gets rolled out and maintained. What does not gets cut. You keep ownership of your data and systems either way.</p>
            </div>
          </div>
          <div className="lp-dark-foot lp-reveal">
            <p>Every pilot ends with an evaluation report: accuracy against your real cases, measured on the same open-source tooling we publish.</p>
          </div>
        </div>
      </section>

      <section className="lp-section" id="about">
        <div className="lp-section-inner">
          <div className="lp-section-head lp-reveal">
            <span className="lp-index">03</span>
            <h2>why sparse intelligence</h2>
          </div>
          <div className="lp-about-grid">
            <div className="lp-about-item lp-reveal">
              <span className="lp-node lp-node-blue" />
              <div>
                <h3>We build on our own platform</h3>
                <p>The document search, agents, and evaluation systems we deploy for clients run on infrastructure we built and operate ourselves. We are not reselling someone else's product with a markup.</p>
              </div>
            </div>
            <div className="lp-about-item lp-reveal">
              <span className="lp-node" />
              <div>
                <h3>Measured, not promised</h3>
                <p>Our evaluation pipeline scores every system against real examples from your business before launch. Accuracy is a number you see, not an adjective in a proposal.</p>
              </div>
            </div>
            <div className="lp-about-item lp-reveal">
              <span className="lp-node" />
              <div>
                <h3>Research background</h3>
                <p>Founded by Colin Gibbons-Fly as a spinout of research at the Frost Institute for Data Science and Computing, including published work on diagnosing failures in retrieval systems.</p>
              </div>
            </div>
            <div className="lp-about-item lp-reveal">
              <span className="lp-node" />
              <div>
                <h3>Built for smaller teams</h3>
                <p>You do not need a data team or an enterprise budget. Pilots are fixed price, scoped to one workflow, and designed to pay for themselves.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-contact" id="contact">
        <div className="lp-contact-inner lp-reveal">
          <Mark size={120} />
          <h2>Tell us what eats your team's time.</h2>
          <p>We will tell you whether AI can fix it, and what it would cost to find out for sure.</p>
          <a href="mailto:hello@sparseintelligence.ai?subject=Consultation%20request" className="lp-btn-fill lp-btn-big">
            hello@sparseintelligence.ai
          </a>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <Lockup ink="#F4F2EB" sub="#8a887f" dot="#3a3a37" height={46} />
          <div className="lp-footer-links">
            <a href="#services">services</a>
            <a href="#process">process</a>
            <a href="#contact">contact</a>
            <Link to="/login">client sign in</Link>
          </div>
          <p>&copy; 2026 Sparse Intelligence LLC</p>
        </div>
      </footer>
    </div>
  )
}

const landingStyles = `
  .lp {
    --cream: #F4F2EB;
    --cream-deep: #EAE7DC;
    --card: #FBFAF5;
    --ink: #141414;
    --ink-soft: #52524d;
    --blue: #2D5BFF;
    --blue-deep: #1f47e0;
    --dot: #C9C6BC;
    background: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', system-ui, sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  .lp h1, .lp h2, .lp h3 { font-family: 'Outfit', system-ui, sans-serif; }
  .lp .lp-blue { color: var(--blue); }

  .lp-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 56px;
    position: sticky; top: 0; z-index: 100;
    background: rgba(244, 242, 235, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--cream-deep);
  }
  .lp-logo { display: block; }
  .lp-nav-links { display: flex; align-items: center; gap: 30px; }
  .lp-nav-links a {
    color: var(--ink-soft); text-decoration: none;
    font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 0.98rem;
  }
  .lp-nav-links a:hover { color: var(--ink); }
  .lp-nav-cta {
    color: var(--ink) !important;
    border: 1.5px solid var(--ink); border-radius: 999px;
    padding: 8px 20px; font-weight: 600;
    transition: background 0.15s, color 0.15s;
  }
  .lp-nav-cta:hover { background: var(--ink); color: var(--cream) !important; }

  .lp-hero { padding: 90px 56px 70px; position: relative; }
  .lp-hero-grid {
    max-width: 1180px; margin: 0 auto;
    display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 40px; align-items: center;
  }
  .lp-kicker {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Outfit', sans-serif; font-weight: 600;
    font-size: 0.85rem; letter-spacing: 0.22em; text-transform: lowercase;
    color: var(--ink-soft);
    border: 1px solid var(--cream-deep); border-radius: 999px;
    background: var(--card);
    padding: 8px 18px; margin-bottom: 28px;
  }
  .lp-hero h1 {
    font-size: clamp(2.6rem, 5.2vw, 4.3rem);
    font-weight: 700; letter-spacing: -0.025em; line-height: 1.04;
    margin: 0 0 26px;
  }
  .lp-hero-sub {
    font-size: 1.18rem; line-height: 1.65; color: var(--ink-soft);
    max-width: 540px; margin: 0 0 34px;
  }
  .lp-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .lp-hero-note { margin-top: 20px; font-size: 0.92rem; color: var(--ink-soft); }
  .lp-hero-mark { display: flex; justify-content: center; }

  .si-mark-animate .si-mark-edges path {
    stroke-dasharray: 400; stroke-dashoffset: 400;
    animation: si-draw 1.1s ease forwards;
  }
  .si-mark-animate .si-mark-edges path:nth-child(2) { animation-delay: 0.35s; }
  .si-mark-animate .si-mark-edges path:nth-child(3) { animation-delay: 0.7s; }
  @keyframes si-draw { to { stroke-dashoffset: 0; } }
  .si-mark-animate .si-mark-apex { animation: si-pulse 2.6s ease-in-out 1.4s infinite; transform-origin: 276px 84px; }
  @keyframes si-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.25); }
  }

  .lp-btn-fill {
    background: var(--blue); color: #fff; text-decoration: none;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 1.02rem;
    padding: 14px 30px; border-radius: 999px;
    box-shadow: 0 6px 18px rgba(45, 91, 255, 0.25);
    transition: background 0.15s, transform 0.15s;
  }
  .lp-btn-fill:hover { background: var(--blue-deep); transform: translateY(-1px); }
  .lp-btn-big { font-size: 1.15rem; padding: 17px 38px; }
  .lp-btn-ghost {
    color: var(--ink); text-decoration: none;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 1.02rem;
    padding: 14px 30px; border-radius: 999px; border: 1.5px solid var(--ink);
    transition: background 0.15s, color 0.15s;
  }
  .lp-btn-ghost:hover { background: var(--ink); color: var(--cream); }

  .lp-node {
    display: inline-block; width: 9px; height: 9px; border-radius: 50%;
    background: var(--ink); flex-shrink: 0;
  }
  .lp-node-blue { background: var(--blue); }
  .lp-rule {
    display: flex; align-items: center; justify-content: center; gap: 0;
    padding: 10px 0 0;
  }
  .lp-rule-line { width: 140px; height: 1.5px; background: var(--dot); }

  .lp-section { padding: 100px 56px; }
  .lp-section-inner { max-width: 1120px; margin: 0 auto; }
  .lp-section-head { display: flex; align-items: baseline; gap: 18px; margin-bottom: 14px; }
  .lp-index {
    font-family: 'JetBrains Mono', monospace; font-size: 0.95rem;
    color: var(--blue); font-weight: 500;
  }
  .lp-index-dark { color: #7a95ff; }
  .lp-section h2 {
    font-size: clamp(1.9rem, 3.6vw, 2.8rem);
    font-weight: 700; letter-spacing: -0.02em; margin: 0;
  }
  .lp-section-sub { color: var(--ink-soft); font-size: 1.1rem; margin: 0 0 20px; }

  .lp-cards {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 22px; margin-top: 46px;
  }
  .lp-card {
    background: var(--card);
    border: 1px solid var(--cream-deep); border-radius: 18px;
    padding: 30px 28px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .lp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 34px rgba(20, 20, 20, 0.08);
    border-color: var(--dot);
  }
  .lp-glyph { width: 48px; height: 48px; margin-bottom: 18px; }
  .lp-glyph svg { width: 100%; height: 100%; }
  .lp-card h3 { font-size: 1.14rem; font-weight: 600; margin: 0 0 10px; }
  .lp-card p { color: var(--ink-soft); line-height: 1.62; margin: 0; font-size: 0.98rem; }

  .lp-dark { background: var(--ink); color: var(--cream); }
  .lp-dark h2 { color: var(--cream); }
  .lp-timeline {
    display: flex; align-items: center; margin: 54px 0 26px; padding: 0 8px;
  }
  .lp-tl-node {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--cream); flex-shrink: 0;
  }
  .lp-tl-blue { background: var(--blue); box-shadow: 0 0 0 6px rgba(45, 91, 255, 0.25); }
  .lp-tl-line { flex: 1; height: 2px; background: #3a3a37; }
  .lp-steps {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px;
  }
  .lp-step h3 { margin: 0 0 10px; }
  .lp-step-k {
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.3rem;
    letter-spacing: 0.01em; color: var(--cream);
  }
  .lp-step p { color: #b9b7ae; line-height: 1.65; margin: 0; font-size: 0.98rem; }
  .lp-dark-foot {
    margin-top: 60px; padding-top: 32px; border-top: 1px solid #2c2c29;
  }
  .lp-dark-foot p {
    color: #b9b7ae; font-size: 1.05rem; max-width: 640px; margin: 0; line-height: 1.65;
  }

  .lp-about-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 38px 56px; margin-top: 50px;
  }
  .lp-about-item { display: flex; gap: 18px; align-items: flex-start; }
  .lp-about-item .lp-node { margin-top: 7px; }
  .lp-about-item h3 { font-size: 1.14rem; font-weight: 600; margin: 0 0 9px; }
  .lp-about-item p { color: var(--ink-soft); line-height: 1.66; margin: 0; font-size: 0.99rem; }

  .lp-contact {
    padding: 110px 56px;
    background-image: radial-gradient(var(--dot) 1.5px, transparent 1.5px);
    background-size: 34px 34px;
  }
  .lp-contact-inner { max-width: 660px; margin: 0 auto; text-align: center; }
  .lp-contact h2 {
    font-size: clamp(1.9rem, 3.8vw, 2.9rem);
    font-weight: 700; letter-spacing: -0.02em; margin: 26px 0 16px;
  }
  .lp-contact p { color: var(--ink-soft); font-size: 1.14rem; margin: 0 0 34px; line-height: 1.6; }
  .lp-contact .lp-btn-fill { display: inline-block; }

  .lp-footer { background: var(--ink); padding: 54px 56px; }
  .lp-footer-inner {
    max-width: 1120px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    gap: 28px; flex-wrap: wrap;
  }
  .lp-footer-links { display: flex; gap: 26px; flex-wrap: wrap; }
  .lp-footer-links a {
    color: #b9b7ae; text-decoration: none;
    font-family: 'Outfit', sans-serif; font-size: 0.95rem;
  }
  .lp-footer-links a:hover { color: var(--cream); }
  .lp-footer p { color: #8a887f; font-size: 0.85rem; margin: 0; }

  .lp-reveal {
    opacity: 0; transform: translateY(18px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .lp-reveal.lp-visible { opacity: 1; transform: none; }

  @media (max-width: 960px) {
    .lp-hero-grid { grid-template-columns: 1fr; }
    .lp-hero-mark { order: -1; }
    .lp-hero-mark svg { width: 250px; height: 250px; }
    .lp-steps { grid-template-columns: 1fr; }
    .lp-timeline { display: none; }
    .lp-about-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 720px) {
    .lp-nav { padding: 12px 20px; }
    .lp-nav-links { gap: 14px; }
    .lp-nav-links a:not(.lp-nav-cta) { display: none; }
    .lp-logo svg { height: 34px; }
    .lp-hero { padding: 50px 20px 50px; }
    .lp-section { padding: 70px 20px; }
    .lp-contact { padding: 80px 20px; }
    .lp-footer { padding: 44px 20px; }
    .lp-footer-inner { flex-direction: column; align-items: flex-start; }
  }
`
