import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryEditor from "@/app/admin/inquiries/[id]/inquiry-editor";
import SignOutButton from "@/app/admin/sign-out-button";
import { signOutStaff } from "@/app/admin/actions";
import { requireInquiryStaff } from "@/lib/staff-auth";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Inquiry details | BrightNest Cleaning",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, user } = await requireInquiryStaff();
  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .select(
      "id, customer_name, email, phone, city, state, postal_code, property_type, size_or_room_count, preferred_date, message, service_slug_snapshot, status, staff_notes, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load inquiry details.", { cause: error });
  }

  if (!inquiry) {
    notFound();
  }

  const { data: events, error: eventError } = await supabase
    .from("inquiry_events")
    .select("event_type, old_status, new_status, created_at")
    .eq("inquiry_id", inquiry.id)
    .order("created_at", { ascending: false });

  if (eventError) {
    throw new Error("Unable to load inquiry history.", { cause: eventError });
  }

  const details = [
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["City", inquiry.city],
    ["State", inquiry.state],
    ["Postal code", inquiry.postal_code],
    ["Property type", inquiry.property_type],
    ["Size / rooms", inquiry.size_or_room_count],
    ["Preferred date", inquiry.preferred_date],
    ["Service", inquiry.service_slug_snapshot],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <main id="main" className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/">
          BrightNest <span className="brand-light">staff</span>
        </Link>
        <div className="admin-user">
          <span>{user.email}</span>
          <SignOutButton action={signOutStaff} />
        </div>
      </header>
      <section className="admin-content">
        <Link className="back-link" href="/admin">← Back to inquiries</Link>
        <div className="inquiry-detail-grid">
          <article className="admin-card">
            <div className="admin-title-row">
              <div>
                <div className="eyebrow">Customer request</div>
                <h1>{inquiry.customer_name}</h1>
                <p>Received {formatDate(inquiry.created_at)}</p>
              </div>
              <span className={`status-pill status-${inquiry.status}`}>{inquiry.status}</span>
            </div>
            <dl className="inquiry-details">
              {details.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
            <section className="inquiry-message">
              <h2>Customer message</h2>
              <p>{inquiry.message || "No additional message was provided."}</p>
            </section>
          </article>
          <aside className="admin-card">
            <h2>Staff follow-up</h2>
            <InquiryEditor
              id={inquiry.id}
              status={inquiry.status}
              staffNotes={inquiry.staff_notes}
            />
          </aside>
        </div>
        <section className="admin-card inquiry-history">
          <h2>Activity history</h2>
          {events.length ? (
            <ol>
              {events.map((event, index) => (
                <li key={`${event.created_at}-${index}`}>
                  <strong>
                    {event.event_type === "created"
                      ? "Inquiry received"
                      : event.event_type === "status_changed"
                        ? `Status changed from ${event.old_status} to ${event.new_status}`
                        : "Staff note updated"}
                  </strong>
                  <time dateTime={event.created_at}>{formatDate(event.created_at)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <p>No activity recorded.</p>
          )}
        </section>
      </section>
    </main>
  );
}
