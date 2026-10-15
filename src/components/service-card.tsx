import Link from "next/link";
import ServiceIcon, {
  getServicePresentation,
} from "@/components/service-icon";
import { getServiceImageUrl, type PublishedService } from "@/lib/services";

export default function ServiceCard({
  service,
  index,
}: {
  service: PublishedService;
  index: number;
}) {
  const presentation = getServicePresentation(service.category);

  return (
    <article className={`service-card${index === 1 ? " featured-card" : ""}`}>
      {service.image_path ? (
        <div
          className="service-photo"
          role="img"
          aria-label={service.image_alt ?? service.title}
          style={{
            backgroundImage: `url("${getServiceImageUrl(service.image_path)}")`,
          }}
        />
      ) : (
      <div className={`service-icon ${presentation.iconClass}`}>
        <ServiceIcon category={service.category} />
      </div>
      )}
      <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      <Link href={`/services/${service.slug}`} className="card-link">
        View service details <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
