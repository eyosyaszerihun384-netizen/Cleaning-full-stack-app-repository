import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getActiveServiceAreas } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About Us | BrightNest Cleaning",
  description:
    "Learn about the BrightNest Cleaning concept and check the service areas currently published by the business.",
};

export default async function AboutPage() {
  const serviceAreas = await getActiveServiceAreas();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-hero section">
          <div className="container">
            <Link className="back-link" href="/">← Back to home</Link>
            <div className="eyebrow"><span className="eyebrow-dot" /> About BrightNest</div>
            <h1>A little more care<br /><span>in every clean.</span></h1>
            <p className="page-lead">
              BrightNest is the working name for this cleaning-service website
              demo. The business story and operating details will be added
              after they are confirmed by the owner.
            </p>
          </div>
        </section>
        <section className="section about-page-section">
          <div className="container about-page-grid">
            <article className="about-story">
              <div className="eyebrow">The idea</div>
              <h2>More breathing room for the things that matter.</h2>
              <p>
                The site is designed to make it easy to explore cleaning
                options, understand the next steps, and contact the team.
                Service scope and availability are confirmed directly with the
                business; this demo does not make promises on its behalf.
              </p>
              <Link className="button button-outline" href="/services">
                Explore services <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <aside className="service-area-panel" aria-labelledby="service-area-heading">
              <span className="eyebrow">Where we work</span>
              <h2 id="service-area-heading">Service areas</h2>
              {serviceAreas.length > 0 ? (
                <>
                  <p>These locations are currently listed by the business:</p>
                  <ul className="area-list">
                    {serviceAreas.map((area) => (
                      <li key={area.id}>
                        <span>{area.city}, {area.state}</span>
                        {area.postal_codes.length > 0 && (
                          <small>ZIP codes: {area.postal_codes.join(", ")}</small>
                        )}
                        {area.map_url && (
                          <a href={area.map_url} target="_blank" rel="noreferrer">
                            View map <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>
                  Coverage has not been confirmed yet. No service areas are
                  currently published.
                </p>
              )}
              <Link className="text-link" href="/contact">
                Ask about your location <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
