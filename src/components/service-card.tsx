import Link from "next/link";
import {
  getServiceImageUrl,
  getStockServiceImageUrl,
  type PublishedService,
} from "@/lib/services";
import ServiceCardImage from "@/components/service-card-image";

export default function ServiceCard({
  service,
  index,
}: {
  service: PublishedService;
  index: number;
}) {
  return (
    <article className={`service-card crown-service-card${index === 1 ? " featured-card" : ""}`}>
      <ServiceCardImage
        imageUrl={service.image_path ? getServiceImageUrl(service.image_path) : null}
        stockImageUrl={getStockServiceImageUrl(service.category, 1000)}
        title={service.title}
        alt={service.image_alt}
      />
      <div className="crown-service-content">
        <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
        <Link href={`/services/${service.slug}`} className="card-link">
          View service details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
