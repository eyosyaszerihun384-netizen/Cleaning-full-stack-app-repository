import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SignOutButton from "@/app/admin/sign-out-button";
import { signOutStaff } from "@/app/admin/actions";
import { requireInquiryStaff } from "@/lib/staff-auth";

export const metadata: Metadata = {
  title: "Inquiry dashboard | BrightNest Cleaning",
  robots: { index: false, follow: false },
};

const statuses = [
  "new",
  "contacted",
  "quoted",
  "scheduled",
  "closed",
] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { supabase, user, role } = await requireInquiryStaff();
  const params = await searchParams;
  const selectedStatus = statuses.find((status) => status === params.status);
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = 25;

  let query = supabase
    .from("inquiries")
    .select(
      "id, customer_name, email, phone, city, service_slug_snapshot, status, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (selectedStatus) {
    query = query.eq("status", selectedStatus);
  }

  const { data: inquiries, error, count } = await query;

  if (error) {
    throw new Error("Unable to load inquiries.", { cause: error });
  }

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));

  if (page > totalPages) {
    notFound();
  }

  return (
    <main id="main" className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/">
          BrightNest <span className="brand-light">staff</span>
        </Link>
        <div className="admin-user">
          <span>{user.email} · {role.replace("_", " ")}</span>
          {role === "admin" && <Link className="button button-small button-outline" href="/admin/content">Manage site content</Link>}
          <SignOutButton action={signOutStaff} />
        </div>
      </header>
      <section className="admin-content">
        <div className="admin-title-row">
          <div>
            <div className="eyebrow">Staff workspace</div>
            <h1>Inquiries</h1>
            <p>Customer requests are private and visible only to inquiry staff.</p>
          </div>
          <strong className="admin-count">{count ?? 0} total</strong>
        </div>
        <nav className="status-filters" aria-label="Filter inquiries by status">
          <Link
            className={!selectedStatus ? "is-selected" : ""}
            href="/admin"
            aria-current={!selectedStatus ? "page" : undefined}
          >
            All
          </Link>
          {statuses.map((status) => (
            <Link
              className={selectedStatus === status ? "is-selected" : ""}
              href={`/admin?status=${status}`}
              aria-current={selectedStatus === status ? "page" : undefined}
              key={status}
            >
              {status}
            </Link>
          ))}
        </nav>
        {inquiries.length ? (
          <div className="inquiry-table-wrap">
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Service</th>
                  <th scope="col">Status</th>
                  <th scope="col">Received</th>
                  <th scope="col"><span className="sr-only">Open inquiry</span></th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <strong>{inquiry.customer_name}</strong>
                      <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                      {inquiry.phone && <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>}
                      {inquiry.city && <span>{inquiry.city}</span>}
                    </td>
                    <td>{inquiry.service_slug_snapshot ?? "Not specified"}</td>
                    <td><span className={`status-pill status-${inquiry.status}`}>{inquiry.status}</span></td>
                    <td>{formatDate(inquiry.created_at)}</td>
                    <td>
                      <Link
                        className="text-link"
                        href={`/admin/inquiries/${inquiry.id}`}
                        aria-label={`Open inquiry from ${inquiry.customer_name}`}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">
            {selectedStatus
              ? `There are no ${selectedStatus} inquiries.`
              : "There are no inquiries yet."}
          </p>
        )}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="Inquiry pages">
            {page > 1 && (
              <Link href={`/admin?page=${page - 1}${selectedStatus ? `&status=${selectedStatus}` : ""}`}>
                ← Newer
              </Link>
            )}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link href={`/admin?page=${page + 1}${selectedStatus ? `&status=${selectedStatus}` : ""}`}>
                Older →
              </Link>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
