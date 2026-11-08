import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('lp-visible')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    const els = containerRef.current?.querySelectorAll('.lp-reveal')
    els?.forEach(el => observer.observe(el))
    return () => els?.forEach(el => observer.unobserve(el))
  }, [])

  return (
    <div ref={containerRef} className="lp">
      <style>{landingStyles}</style>

      {/* Nav */}
      <nav className="lp-nav">
        <Link to="/" className="lp-logo">
          <img src="/logo.png" alt="Sparse Intelligence" />
        </Link>
        <div className="lp-nav-links">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="lp-nav-cta">Client sign in</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <h1 className="lp-reveal">
            Practical AI for small<br />and mid-sized businesses.
          </h1>
          <p className="lp-hero-sub lp-reveal">
            Sparse Intelligence is a consultancy. We find the places in your
            business where AI saves real hours, build the systems, and measure
            the results. No hype, no retainers that go nowhere.
          </p>
          <div className="lp-hero-actions lp-reveal">
            <a href="mailto:hello@sparseintelligence.ai?subject=Consultation%20request" className="lp-btn-fill">
              Book a free consultation
            </a>
            <a href="#services" className="lp-btn-ghost">See what we do</a>
          </div>
          <p className="lp-hero-note lp-reveal">
            Free 30 minute call. We tell you honestly whether AI is worth it for your business.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="lp-section" id="services">
        <div className="lp-section-inner">
          <h2 className="lp-reveal">What we do</h2>
          <p className="lp-section-sub lp-reveal">
            Every engagement starts with your operations, not with a tool we want to sell.
          </p>
          <div className="lp-cards">
            <div className="lp-card lp-reveal">
              <h3>AI opportunity audit</h3>
              <p>We map how your business runs and identify where AI actually saves time or money. You get a prioritized plan with cost and effort estimates, not a pitch deck.</p>
            </div>
            <div className="lp-card lp-reveal">
              <h3>Document intelligence</h3>
              <p>Ask questions across your contracts, SOPs, invoices, and records. Answers cite their sources so your team can verify instead of guessing.</p>
            </div>
            <div className="lp-card lp-reveal">
              <h3>Workflow automation</h3>
              <p>Intake, scheduling, follow-ups, reporting. We automate the recurring work your team does by hand, and leave humans in the loop where it matters.</p>
            </div>
            <div className="lp-card lp-reveal">
              <h3>Customer-facing assistants</h3>
              <p>Chat on your website that answers from your real business information, in your voice, with limits on what it is allowed to say.</p>
            </div>
            <div className="lp-card lp-reveal">
              <h3>Measurement and reliability</h3>
              <p>Everything we ship is tested and scored before it touches a customer. You see the accuracy numbers and decide what is good enough.</p>
            </div>
            <div className="lp-card lp-reveal">
              <h3>Team training</h3>
              <p>We train your staff to use AI tools well: what to trust, what to check, and how to get consistent results day to day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="lp-section lp-section-alt" id="process">
        <div className="lp-section-inner">
          <h2 className="lp-reveal">How an engagement works</h2>
          <div className="lp-steps">
            <div className="lp-step lp-reveal">
              <div className="lp-step-num">1</div>
              <h3>Discovery call</h3>
              <p>Free, 30 minutes. We learn how your business runs and tell you where AI fits. If it does not fit, we say so.</p>
            </div>
            <div className="lp-step lp-reveal">
              <div className="lp-step-num">2</div>
              <h3>Pilot</h3>
              <p>One workflow, two to four weeks, fixed price. We build it, test it against your real cases, and show you the numbers.</p>
            </div>
            <div className="lp-step lp-reveal">
              <div className="lp-step-num">3</div>
              <h3>Scale</h3>
              <p>What works gets rolled out and maintained. What does not gets cut. You keep ownership of your data and systems either way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="lp-section" id="about">
        <div className="lp-section-inner lp-about">
          <h2 className="lp-reveal">Why Sparse Intelligence</h2>
          <div className="lp-about-grid">
            <div className="lp-reveal">
              <h3>We build on our own platform</h3>
              <p>The document search, agents, and evaluation systems we deploy for clients run on infrastructure we built and operate ourselves. We are not reselling someone else's product with a markup.</p>
            </div>
            <div className="lp-reveal">
              <h3>Measured, not promised</h3>
              <p>Our evaluation pipeline scores every system against real examples from your business before launch. Accuracy is a number you see, not an adjective in a proposal.</p>
            </div>
            <div className="lp-reveal">
              <h3>Research background</h3>
              <p>Founded by Colin Gibbons-Fly as a spinout of research at the Frost Institute for Data Science and Computing, including published work on diagnosing failures in retrieval systems.</p>
            </div>
            <div className="lp-reveal">
              <h3>Built for smaller teams</h3>
              <p>You do not need a data team or an enterprise budget. Pilots are fixed price, scoped to one workflow, and designed to pay for themselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="lp-section lp-section-alt" id="contact">
        <div className="lp-section-inner lp-contact">
          <h2 className="lp-reveal">Talk to us</h2>
          <p className="lp-reveal">
            Tell us what eats your team's time. We will tell you whether AI can fix it.
          </p>
          <a href="mailto:hello@sparseintelligence.ai?subject=Consultation%20request" className="lp-btn-fill lp-reveal">
            hello@sparseintelligence.ai
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <img src="/logo.png" alt="Sparse Intelligence" className="lp-footer-logo" />
        <div className="lp-footer-links">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
          <Link to="/login">Client sign in</Link>
        </div>
        <p>&copy; 2026 Sparse Intelligence LLC</p>
      </footer>
    </div>
  )
}

const landingStyles = `
  .lp {
    --cream: #F4F2EB;
    --cream-deep: #ECE9DF;
    --ink: #141414;
    --ink-soft: #4a4a46;
    --blue: #2D5BFF;
    --dot: #C9C6BC;
    background: var(--cream);
    color: var(--ink);
    font-family: 'DM Sans', system-ui, sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .lp h1, .lp h2, .lp h3, .lp .lp-logo, .lp-nav-cta, .lp-btn-fill, .lp-btn-ghost {
    font-family: 'Outfit', system-ui, sans-serif;
  }

  .lp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 48px;
    position: sticky;
    top: 0;
    background: rgba(244, 242, 235, 0.92);
    backdrop-filter: blur(8px);
    z-index: 100;
    border-bottom: 1px solid var(--cream-deep);
  }
  .lp-logo img { height: 44px; display: block; margin: -4px 0; }
  .lp-nav-links { display: flex; align-items: center; gap: 28px; }
  .lp-nav-links a {
    color: var(--ink-soft);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
  }
  .lp-nav-links a:hover { color: var(--ink); }
  .lp-nav-cta {
    color: var(--ink) !important;
    border: 1.5px solid var(--ink);
    padding: 8px 18px;
    border-radius: 999px;
    font-weight: 600;
  }
  .lp-nav-cta:hover { background: var(--ink); color: var(--cream) !important; }

  .lp-hero {
    padding: 110px 48px 90px;
    background-image: radial-gradient(var(--dot) 1.5px, transparent 1.5px);
    background-size: 34px 34px;
  }
  .lp-hero-inner { max-width: 880px; margin: 0 auto; text-align: center; }
  .lp-hero h1 {
    font-size: clamp(2.4rem, 5.4vw, 4.2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.08;
    margin: 0 0 24px;
  }
  .lp-hero-sub {
    font-size: 1.2rem;
    line-height: 1.6;
    color: var(--ink-soft);
    max-width: 640px;
    margin: 0 auto 36px;
  }
  .lp-hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .lp-btn-fill {
    background: var(--blue);
    color: #fff;
    padding: 14px 30px;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.02rem;
  }
  .lp-btn-fill:hover { background: #1f47e0; }
  .lp-btn-ghost {
    color: var(--ink);
    padding: 14px 30px;
    border-radius: 999px;
    border: 1.5px solid var(--ink);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.02rem;
  }
  .lp-btn-ghost:hover { background: var(--ink); color: var(--cream); }
  .lp-hero-note { margin-top: 22px; font-size: 0.92rem; color: var(--ink-soft); }

  .lp-section { padding: 90px 48px; }
  .lp-section-alt { background: var(--cream-deep); }
  .lp-section-inner { max-width: 1060px; margin: 0 auto; }
  .lp-section h2 {
    font-size: clamp(1.8rem, 3.4vw, 2.6rem);
    font-weight: 700;
    letter-spacing: -0.015em;
    margin: 0 0 14px;
  }
  .lp-section-sub { color: var(--ink-soft); font-size: 1.08rem; margin: 0 0 44px; }

  .lp-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 20px;
    margin-top: 36px;
  }
  .lp-card {
    background: var(--cream);
    border: 1px solid var(--cream-deep);
    border-radius: 14px;
    padding: 28px 26px;
    box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04);
  }
  .lp-section .lp-card { background: #FBFAF6; }
  .lp-card h3 { font-size: 1.12rem; font-weight: 600; margin: 0 0 10px; }
  .lp-card p { color: var(--ink-soft); line-height: 1.6; margin: 0; font-size: 0.98rem; }

  .lp-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 28px;
    margin-top: 40px;
  }
  .lp-step h3 { font-size: 1.15rem; font-weight: 600; margin: 16px 0 10px; }
  .lp-step p { color: var(--ink-soft); line-height: 1.6; margin: 0; }
  .lp-step-num {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--ink);
    color: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
  }
  .lp-step:first-child .lp-step-num { background: var(--blue); color: #fff; }

  .lp-about-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 36px 48px;
    margin-top: 40px;
  }
  .lp-about-grid h3 { font-size: 1.12rem; font-weight: 600; margin: 0 0 10px; }
  .lp-about-grid p { color: var(--ink-soft); line-height: 1.65; margin: 0; }

  .lp-contact { text-align: center; max-width: 620px; }
  .lp-contact p { color: var(--ink-soft); font-size: 1.12rem; margin: 0 0 30px; }
  .lp-contact .lp-btn-fill { display: inline-block; }

  .lp-footer {
    padding: 48px;
    text-align: center;
    border-top: 1px solid var(--cream-deep);
  }
  .lp-footer-logo { height: 40px; margin-bottom: 18px; }
  .lp-footer-links { display: flex; gap: 24px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
  .lp-footer-links a { color: var(--ink-soft); text-decoration: none; font-size: 0.92rem; }
  .lp-footer-links a:hover { color: var(--ink); }
  .lp-footer p { color: var(--ink-soft); font-size: 0.85rem; margin: 0; }

  .lp-reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .lp-reveal.lp-visible { opacity: 1; transform: none; }

  @media (max-width: 720px) {
    .lp-nav { padding: 14px 20px; }
    .lp-nav-links { gap: 16px; }
    .lp-nav-links a:not(.lp-nav-cta) { display: none; }
    .lp-hero { padding: 70px 20px 60px; }
    .lp-section { padding: 60px 20px; }
  }
`
