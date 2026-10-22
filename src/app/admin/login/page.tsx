import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/app/admin/login/login-form";
import SiteHeader from "@/components/site-header";
import { getStaffSession } from "@/lib/staff-auth";

export const metadata: Metadata = {
  title: "Staff sign in | Crown Cleaning Solutions",
  robots: { index: false, follow: false },
};

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { user, role } = await getStaffSession();

  if (user && role === "content_editor") {
    redirect("/admin/content");
  }

  if (user && (role === "admin" || role === "inquiry_manager")) {
    redirect("/admin");
  }

  const params = await searchParams;

  return (
    <>
      <SiteHeader />
      <main id="main" className="staff-page">
        <section className="staff-panel">
          <Link className="back-link" href="/">← Back to website</Link>
          <div className="eyebrow">Authorized staff</div>
          <h1>Staff sign in</h1>
          <p>
            Sign in with an account provisioned by the administrator. Public
            account registration is disabled.
          </p>
          {params.error === "access" && (
            <p className="form-status form-error" role="alert">
              This account does not have inquiry-management access.
            </p>
          )}
          {params.error === "content" && (
            <p className="form-status form-error" role="alert">
              This account does not have permission to manage site content.
            </p>
          )}
          <LoginForm />
        </section>
      </main>
    </>
  );
}
