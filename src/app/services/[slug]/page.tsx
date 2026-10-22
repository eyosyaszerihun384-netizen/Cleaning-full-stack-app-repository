import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ServiceCardImage from "@/components/service-card-image";
import {
  getPublishedService,
  getServiceImageUrl,
  getStockServiceImageUrl,
  getStringList,
} from "@/lib/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedService(slug);

  if (!service) {
    return { title: "Service not found | Crown Cleaning Solutions" };
  }

  return {
    title: `${service.title} | Crown Cleaning Solutions`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getPublishedService(slug);

  if (!service) {
    notFound();
  }

  const inclusions = getStringList(service.inclusions);
  const exclusions = getStringList(service.exclusions);

  return (
    <div className="crown-site">
      <SiteHeader />
      <main id="main">
        <section className="page-hero section">
          <div className="container">
            <Link className="back-link" href="/services">← All services</Link>
            <div className="eyebrow"><span className="eyebrow-dot" /> Service details</div>
            <h1>{service.title}</h1>
            <p className="page-lead">{service.summary}</p>
          </div>
        </section>
        <section className="section service-detail-section">
          <div className="container service-detail-grid">
            <article className="service-detail-copy">
              <ServiceCardImage
                imageUrl={service.image_path ? getServiceImageUrl(service.image_path) : null}
                stockImageUrl={getStockServiceImageUrl(service.category, 1200)}
                title={service.title}
                alt={service.image_alt}
                className="service-detail-photo crown-service-image crown-detail-image"
              />
              <h2>About this service</h2>
              <p>{service.description}</p>
              {inclusions.length > 0 && (
                <div className="detail-list">
                  <h3>What may be included</h3>
                  <ul>
                    {inclusions.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              )}
              {exclusions.length > 0 && (
                <div className="detail-list">
                  <h3>What may not be included</h3>
                  <ul>
                    {exclusions.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              )}
            </article>
            <aside className="service-detail-aside">
              <span className="eyebrow">Next step</span>
              <h2>Let’s talk about your space.</h2>
              <p>
                Pricing and availability have not been provided for this page.
                Send an estimate request to discuss your needs with the team.
              </p>
              {service.pricing_display && (
                <p className="service-pricing">{service.pricing_display}</p>
              )}
              <Link className="button button-dark" href="/#quote">
                Request an estimate <span aria-hidden="true">↗</span>
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
