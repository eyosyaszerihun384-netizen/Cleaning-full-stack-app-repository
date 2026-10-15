import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getPublicContactDetails } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact | BrightNest Cleaning",
  description:
    "Find the confirmed contact options for BrightNest Cleaning or learn how to request an estimate.",
};

export default async function ContactPage() {
  const contact = await getPublicContactDetails();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="page-hero section">
          <div className="container">
            <Link className="back-link" href="/">← Back to home</Link>
            <div className="eyebrow"><span className="eyebrow-dot" /> Get in touch</div>
            <h1>We’d be glad<br /><span>to hear from you.</span></h1>
            <p className="page-lead">
              Reach out with questions about services or coverage. A request is
              not a confirmed appointment; the business must follow up.
            </p>
          </div>
        </section>
        <section className="section contact-section">
          <div className="container contact-grid">
            <article className="contact-panel">
              <span className="eyebrow">Contact details</span>
              <h2>Talk with the team.</h2>
              {contact.email || contact.phone ? (
                <ul className="contact-methods">
                  {contact.email && (
                    <li>
                      <span className="contact-method-icon" aria-hidden="true">✉</span>
                      <span>
                        <small>Email</small>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </span>
                    </li>
                  )}
                  {contact.phone && (
                    <li>
                      <span className="contact-method-icon" aria-hidden="true">☎</span>
                      <span>
                        <small>Phone</small>
                        <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>{contact.phone}</a>
                      </span>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="contact-pending">
                  Business email and phone details have not been confirmed or
                  published yet. Please check back later.
                </p>
              )}
            </article>
            <aside className="contact-panel contact-next-step">
              <span className="eyebrow">Need a quote?</span>
              <h2>Tell us what you’re looking for.</h2>
              <p>
                Send an estimate request and the team can follow up to discuss
                your needs. A request does not confirm an appointment.
              </p>
              <Link className="button button-dark" href="/#quote">
                Request an estimate <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
