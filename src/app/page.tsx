import FaqChat from "@/components/faq-chat";
import MobileNavigation from "@/components/mobile-navigation";

const services = [
  {
    number: "01",
    title: "Residential cleaning",
    description:
      "Thoughtful cleaning for the place you call home. Service details will be confirmed with the business.",
    icon: "home",
    iconClass: "icon-home",
  },
  {
    number: "02",
    title: "Commercial cleaning",
    description:
      "A cleaner workplace, with scope and availability tailored to your business needs.",
    icon: "commercial",
    iconClass: "icon-key",
  },
  {
    number: "03",
    title: "Deep cleaning",
    description:
      "A more detailed refresh for the areas that need extra attention.",
    icon: "sparkle",
    iconClass: "icon-sparkle",
  },
  {
    number: "04",
    title: "Move-in cleaning",
    description:
      "A fresh start for your next space. Ask us about move-out service availability too.",
    icon: "key",
    iconClass: "icon-key",
  },
];

function ServiceIcon({ kind }: { kind: string }) {
  if (kind === "home") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="m7 22 17-14 17 14v18H7V22Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M19 40V27h10v13" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M34 8h4v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "sparkle") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="m23 5 4.4 13.6L41 23l-13.6 4.4L23 41l-4.4-13.6L5 23l13.6-4.4L23 5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="m38 32 1.8 5.2L45 39l-5.2 1.8L38 46l-1.8-5.2L31 39l5.2-1.8L38 32Z" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "commercial") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 40V14l16-7v33m0-22h16v22M5 40h38" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M14 18h3m-3 7h3m-3 7h3m13-7h3m-3 7h3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="17" cy="24" r="9" stroke="currentColor" strokeWidth="2.2" />
      <path d="m24 30 14 14m-5-19 6 6m-12-1 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 21v6m-3-3h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="BrightNest Cleaning home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M6 18.5 20 7l14 11.5v14H6v-14Z" fill="currentColor" />
                <path d="M15 32.5V22h10v10.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m29 7 .8 2.2L32 10l-2.2.8L29 13l-.8-2.2L26 10l2.2-.8L29 7Z" fill="#F5AE69" />
              </svg>
            </span>
            <span>brightnest<span className="brand-light">cleaning</span></span>
          </a>
          <MobileNavigation />
        </div>
      </header>

      <main id="main">
        <section className="hero section" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> A little more breathing room</div>
              <h1>Come home to<br />a <span>brighter</span> kind<br />of clean.</h1>
              <p className="hero-text">Thoughtful home cleaning that gives you back your time—and makes your space feel like your favorite place.</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#quote">Get your free estimate <span aria-hidden="true">↗</span></a>
                <a className="text-link" href="#services">Explore our services <span aria-hidden="true">→</span></a>
              </div>
              <div className="social-proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span className="avatar avatar-one">J</span><span className="avatar avatar-two">M</span><span className="avatar avatar-three">A</span>
                </div>
                <div><div className="stars" aria-label="Decorative five-star illustration">★★★★★</div><span className="proof-caption">A demo design made for happy homes</span></div>
              </div>
            </div>
            <div className="hero-art" aria-label="Illustration of a bright, tidy living room" role="img">
              <div className="art-sun" />
              <div className="art-window"><span /><span /><i /></div>
              <div className="art-picture"><span /></div>
              <div className="art-plant"><i /><i /><i /><i /><b /></div>
              <div className="art-rug" />
              <div className="art-sofa"><div className="sofa-back" /><div className="sofa-seat" /><div className="sofa-arm left" /><div className="sofa-arm right" /><div className="sofa-leg left" /><div className="sofa-leg right" /><div className="sofa-cushion" /></div>
              <div className="art-table"><span /></div>
              <div className="art-sparkle sparkle-one">✦</div><div className="art-sparkle sparkle-two">✧</div>
              <div className="art-note"><span className="note-check">✓</span><span><strong>Your happy place</strong><small>Fresh, calm, and all yours</small></span></div>
            </div>
          </div>
          <div className="container trust-strip">
            <span>THE LITTLE THINGS, DONE RIGHT</span>
            <div><b>✳</b> Thoughtful teams</div><div><b>⌂</b> Your home, respected</div><div><b>♡</b> Care in every corner</div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div><div className="eyebrow">A clean for every kind of day</div><h2>Make room for<br /><span>what matters.</span></h2></div>
              <p>Whether you need a regular reset or a little extra care, we’ll help you find the right clean for your home or workplace.</p>
            </div>
            <div className="service-grid">
              {services.map((service, index) => (
                <article className={`service-card${index === 1 ? " featured-card" : ""}`} key={service.number}>
                  <div className={`service-icon ${service.iconClass}`}>
                    <ServiceIcon kind={service.icon} />
                  </div>
                  <span className="card-number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#quote" className="card-link">Request an estimate <span>↗</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="how-it-works">
          <div className="container process-grid">
            <div className="process-intro">
              <div className="eyebrow">Easy does it</div>
              <h2>Three little steps.<br /><span>One big exhale.</span></h2>
              <p>Getting a little help at home should feel easy from the very first hello.</p>
              <a className="button button-outline" href="#quote">Let’s get started <span aria-hidden="true">↗</span></a>
            </div>
            <div className="steps">
              <article className="step"><div className="step-count">01</div><div><h3>Tell us about your home</h3><p>Share a few details and the kind of clean you are looking for.</p></div><span className="step-symbol">⌂</span></article>
              <article className="step"><div className="step-count">02</div><div><h3>Get a personal estimate</h3><p>The team follows up to learn what matters and confirm availability.</p></div><span className="step-symbol">✳</span></article>
              <article className="step"><div className="step-count">03</div><div><h3>Enjoy your fresh start</h3><p>A request is not an appointment until the business confirms it.</p></div><span className="step-symbol">♡</span></article>
            </div>
          </div>
        </section>

        <section className="section quote-section" id="quote">
          <div className="container quote-grid">
            <div className="quote-copy">
              <div className="eyebrow">Your fresh start is one hello away</div>
              <h2>Let’s find your<br /><span>kind of clean.</span></h2>
              <p>We’re preparing the secure estimate request form. Once it’s connected, you’ll be able to share your needs and receive a follow-up from the team.</p>
              <p className="demo-note">This development preview does not accept or store customer information.</p>
            </div>
            <div className="quote-form" aria-labelledby="estimate-heading">
              <div className="form-heading"><h3 id="estimate-heading">Estimate requests are coming soon</h3><span>Secure form setup is next</span></div>
              <p className="form-privacy">The form will be enabled after Supabase is configured and the inquiry workflow is tested. Please do not send real customer information to this preview.</p>
              <a className="button button-dark submit-button" href="#services">Explore cleaning services <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className="about-band" id="about">
          <div className="container about-inner"><span className="about-flower" aria-hidden="true">✳</span><p>More than a clean.<br /><strong>A little more <em>you</em>-time.</strong></p><a href="#quote" className="button button-light">Let’s get started <span aria-hidden="true">↗</span></a></div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="container footer-main">
          <a className="brand footer-brand" href="#home"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M6 18.5 20 7l14 11.5v14H6v-14Z" fill="currentColor" /><path d="M15 32.5V22h10v10.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M29 7l.8 2.2L32 10l-2.2.8L29 13l-.8-2.2L26 10l2.2-.8L29 7Z" fill="#F5AE69" /></svg></span><span>brightnest<span className="brand-light">cleaning</span></span></a>
          <p>A brighter kind of clean.<br />A demo concept for a U.S.-based service.</p>
          <span className="footer-link">Business contact details will be added after confirmation.</span>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} BrightNest Cleaning. Development preview.</span><span>Made with a little extra care <b>✳</b></span></div>
      </footer>

      <FaqChat />
    </>
  );
}
