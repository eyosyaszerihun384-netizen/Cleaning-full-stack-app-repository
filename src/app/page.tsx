import FaqChat from "@/components/faq-chat";
import InquiryForm from "@/components/inquiry-form";
import ServiceCard from "@/components/service-card";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getPublishedFaqTree } from "@/lib/faq";
import { getPublishedServices } from "@/lib/services";
import { getPublicHomeCopy } from "@/lib/site-content";

export default async function Home() {
  const [services, faqNodes, homeCopy] = await Promise.all([
    getPublishedServices(),
    getPublishedFaqTree(),
    getPublicHomeCopy(),
  ]);

  return (
    <>
      <SiteHeader />

      <main id="main">
        <section className="hero section" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> {homeCopy.eyebrow}</div>
              <h1>{homeCopy.headline}</h1>
              <p className="hero-text">{homeCopy.introduction}</p>
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
              {services.length > 0 ? (
                services.map((service, index) => {
                  return (
                    <ServiceCard key={service.id} service={service} index={index} />
                  );
                })
              ) : (
                <p className="service-empty">
                  Service details are being prepared. Please check back soon.
                </p>
              )}
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
              <p>Share a few details about what you’re looking for. The team will follow up to discuss your needs and confirm availability.</p>
              <p className="demo-note">A request is not a confirmed appointment. This development preview is for test data only.</p>
            </div>
            <InquiryForm services={services} />
          </div>
        </section>

        <section className="about-band" id="about">
          <div className="container about-inner"><span className="about-flower" aria-hidden="true">✳</span><p>More than a clean.<br /><strong>A little more <em>you</em>-time.</strong></p><a href="#quote" className="button button-light">Let’s get started <span aria-hidden="true">↗</span></a></div>
        </section>
      </main>

      <SiteFooter />

      <FaqChat publishedNodes={faqNodes} />
    </>
  );
}
