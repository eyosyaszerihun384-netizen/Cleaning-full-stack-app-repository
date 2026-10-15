# Development status

**Last updated:** 2026-10-16
**Project root:** Current Copilot chat workspace
**Status:** Slices 1–3 implemented; Slice 4 inquiry workflow implemented with end-to-end submission verification deferred; Slice 5 staff login and inquiry dashboard implemented with role-matrix checks pending; Slice 6 CMS implemented and in live verification, with service, homepage, contact, service-area, and image workflows checked as an admin. FAQ publication/visitor-flow checks remain.

## Resume here

- **Repository:** `https://github.com/eyosyaszerihun384-netizen/Cleaning-full-stack-app-repository` (`main`). The app source and recent implementation have been developed in this workspace; commit/push the current local work before treating GitHub as the complete checkpoint.
- **Working stack:** Next.js App Router, TypeScript, Supabase Auth/Postgres/Storage; guided button-based FAQ only (no AI/LLM).
- **Run locally:** use Node.js and npm, provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in a private `.env.local`, then run `npm install` and `npm run dev`. Do not copy credentials into GitHub, documentation, or chat. Current owner preview uses `http://localhost:3000`.
- **Verified in the current development project:** Admin login/CMS access; service draft create/edit/delete and public draft invisibility; homepage copy persistence/display; contact settings persistence/display; service-area create/edit, publish/display, then deactivate/hide; image upload and replacement on a synthetic draft. Lint, type-check, production build, and public route smoke checks pass.
- **Synthetic CMS data intentionally remaining:** one inactive service-area row named `CMS Verification Test Updated, ZZ`. It is not published and should not be activated except for an explicitly approved test. The temporary image-test service was deleted; the outcome of deleting its Storage object was not independently inspected.
- **Next:** verify FAQ editor publication order, graph validation, published visitor flow, and demo fallback; then verify content-editor/inquiry-manager/no-role authorization and complete the deferred anonymous inquiry submission test before final QA.
- **Pre-launch blockers:** supply owner-approved business identity/content/pricing/coverage/privacy-retention details, complete access checks, confirm production hosting/domain and backup operations, then run production smoke tests. This is still a development preview, not production-ready.

## Current checkpoint

- Product choices: Next.js + TypeScript + Supabase; U.S.-oriented English; proposal services; Option A FAQ only; preserve the demo design for the MVP.
- System blueprint: `SYSTEM-DESIGN.md`
- Product requirements: `PRD.md`
- Delivery plan: `PLAN.md`
- Visual concept: `Design.md`
- Project instructions: `AGENTS.md`
- Static demo: `index.html`, `styles.css`, and `script.js`
- Next.js app: `src/app/page.tsx`, `src/app/layout.tsx`, and `src/components/`
- Dependency audit: 0 reported vulnerabilities after replacing the generated Next-specific ESLint preset.
- Supabase SSR/browser clients, generated database types, and three version-controlled schema/content migrations are present locally.

## Repository and tooling

- Full-stack app is intended for a **new public GitHub repository**, separate from the static demo repository.
- Git repository initialized on `main` and `origin` set to `https://github.com/eyosyaszerihun384-netizen/Cleaning-full-stack-app-repository.git`.
- Baseline commits `fbc7438` and `fb3d52b` contain the system blueprint and GitHub connection checkpoint; the user confirmed the initial push succeeded and GitHub `main` contains the project documents.
- Local Git author identity and credential helper are configured.
- The baseline commit contains the project docs and safe environment template. `.env.local` is ignored. The standalone demo files remain separate from the tracked full-stack repository baseline.
- Git 2.55.0, Node.js `v24.22.0`, and npm `11.19.1` are available.
- A Supabase development project is linked; the URL and publishable key are configured locally and `.env.local` is ignored by Git.
- Docker/Podman are unavailable, so local Supabase services cannot run in this environment.

## Open prerequisites

- Confirm real U.S. business identity, location/service area, approved content/pricing, and operational policies before production publication.

## Completed slice 1 — Next.js foundation and design shell

- Created an App Router TypeScript application with server-rendered homepage content and client components for mobile navigation and FAQ chat.
- Reused the approved demo visual language and adapted service cards for four proposal categories.
- Kept U.S.-specific business details unclaimed and made the estimate section explicitly inactive; it does not collect or store information.
- Added FAQ topic branches with a simulated three-second thinking animation and non-AI disclosure.
- Kept the standalone demo excluded from the full-stack Git repository.
- Added local development commands to the README and updated the Supabase public key variable placeholder.

**Validation:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit` (0 vulnerabilities), `.env.local` ignore check, and HTTP smoke check (200 with expected page content).

**Not connected yet:** Inquiry persistence, CMS, staff authentication, backups, and production deployment.

## Slice 2 — Supabase connection and schema foundation (complete)

- Added Zod-validated Supabase URL/publishable-key configuration and SSR/browser client helpers.
- Added an initial migration for staff roles, proposal services, editable page content/settings/service areas, inquiries and events, FAQ decision-tree data, RLS, explicit table grants, and the public site-media bucket.
- Anonymous inquiry inserts are limited to approved columns; the database derives the service slug snapshot from a currently published service.
- Set the Supabase CLI project ID to a stable app slug and disabled automatic seed-file loading.
- Documented remote development-project setup, migration application, and first-admin provisioning in `README.md`.
- Confirmed the initial migration is applied to the linked Supabase project and generated TypeScript database definitions from its live schema; both Supabase clients now use those types.
- Applied all three migrations to the linked Supabase project; `npx supabase migration list --linked` confirms local and remote versions `202610150001`, `202610150002`, and `202610150003` match.
- The security advisor no longer flags the app-owned `has_staff_role` and `record_inquiry_event` functions after they were moved to the non-exposed `private` schema. It still flags `public.rls_auto_enable()` as executable by `anon` and `authenticated`. Its definition shows a `SECURITY DEFINER` PostgreSQL event-trigger helper that automatically enables RLS for newly created tables in `public`; it is not an app RPC or business function. Leave it unchanged.

**Anonymous API checks:** Published-service SELECT returned HTTP 200 with four demo rows; draft-service SELECT returned HTTP 200 with zero rows. Anonymous SELECT from inquiries returned HTTP 401. Anonymous PATCH to services returned HTTP 401. A synthetic inquiry with reserved `.invalid` email was accepted with HTTP 201; anonymous SELECT of that inquiry returned HTTP 401; an insert attempting to set `status` and `staff_notes` was rejected with HTTP 401.

**Authenticated admin check:** The owner verified `assigned_role = admin` and zero remaining rows for both rollback-test records and the earlier anonymous synthetic inquiry. The transaction SQL returned the expected inquiry status/note when testing the admin update policy. This confirms the transaction's synthetic tests were rolled back and the inquiry update policy worked for the admin role. Editor and inquiry-manager role matrices are not yet tested and belong with staff authentication/CMS implementation.

**Exit checks:** Migrations apply and are recorded on the linked development project; anonymous access returns only published services; anonymous inquiry SELECT and content UPDATE are denied; anonymous inquiry INSERT is restricted to allowed fields; authenticated admin inquiry management works; all test data was rolled back/deleted. `rls_auto_enable()` is a PostgreSQL event-trigger helper and is left unchanged.

**Validation:** `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit` (0 vulnerabilities), `git diff --check`, anonymous REST permission tests, authenticated admin transaction test, and homepage HTTP smoke test pass. `.env.local` remains ignored by Git. Local Supabase is unavailable because Docker/Podman are not installed.

## Slice 3 — Public content integration (in progress)

- Replaced hard-coded homepage service cards with a server-side query for published Supabase services; query errors are explicit and an empty result shows a clear preparation message.
- Added `/services` and `/services/[slug]` routes backed by the same published-service query, including details, optional inclusion/exclusion lists, clear pricing/availability caveat, and 404 for unpublished or unknown slugs.
- Extracted reusable site header/footer, service card, and category icon components; navigation links work across routes.
- Added `/about` with active service areas from Supabase and `/contact` with only explicitly public contact settings. Empty/unconfirmed data is described without inventing a location or contact method.
- Added and applied migration `202610150003_add_demo_services.sql` with four demo records and no prices or unverified operational promises.
- Verified an anonymous REST request returns all four published services and local production-build HTTP smoke tests return HTTP 200 for the homepage, listing, detail, About, and Contact routes; unknown service routes return HTTP 404.
- Local production preview at `http://localhost:3100` was stopped at the user's request.

## Slice 4 — Visitor inquiry submission (in progress)

- Replaced the inactive estimate placeholder with a provisional form for name and email (required), plus optional phone, city, service, and message; stakeholder approval of the exact fields is still pending.
- Added server-side Zod validation, published-service validation, and an insert limited to visitor-provided inquiry fields; staff-only status/notes are not accepted from the form.
- Added field-level validation feedback, pending/error/success states, and clear language that a request is not an appointment.
- Added a honeypot as a basic spam deterrent. It is not rate limiting or CAPTCHA and does not protect the anonymous Supabase insert endpoint from direct automated requests.
- The visible data-use notice is explicitly a development draft; business approval of privacy/retention terms and production-grade abuse protection remain launch prerequisites.

**Deferred verification:** After the remaining feature slices, run one synthetic `.invalid` submission through the website, confirm it persists and is not readable anonymously, then delete that test row. The database's anonymous insert/read policies were tested separately in Slice 2. Do not use real customer details or count the form as fully verified yet.

## Slice 5 — Staff authentication and inquiry dashboard (in progress)

- Added the `/admin/login` Supabase Auth password sign-in flow; there is no public account registration.
- Added Next.js `proxy.ts` session refresh for staff routes and server-side session plus `staff_roles` checks for protected pages and mutations.
- Limited inquiry dashboard access to `admin` and `inquiry_manager`; `content_editor` cannot read or modify inquiries.
- Added a paginated and status-filtered inquiry list, inquiry detail view, contact details, staff notes, status updates, and database-triggered activity history.
- Kept Supabase RLS as the final data boundary; server actions validate status/notes and set the actor ID from the authenticated user.
- Updated lint to include `proxy.ts`.

**Code and route checks:** `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` pass. A production HTTP smoke test confirmed `/admin/login` returns HTTP 200 and an unauthenticated `/admin` request redirects to `/admin/login`; its temporary server was stopped.

**Verification still required:** With the owner-provisioned development Auth account, open a test inquiry, save a status/note update, and confirm the activity history. Then verify an account with no staff role is denied, an `inquiry_manager` can manage inquiries, and a `content_editor` cannot read or update them. No password or credentials were accessed here.

## Slice 6 — CMS, media, and FAQ editor (in progress)

- Added `/admin/content` protected for `admin` and `content_editor` roles, with a content link for admins and a role-aware post-login redirect for editors.
- Added a validated, plain-text homepage hero-copy editor backed by public `site_settings`; the homepage uses safe default copy until an approved CMS value is saved.
- Added service create/edit controls for title, slug, category, descriptions, inclusion/exclusion lists, approved pricing label, ordering, and publication status. Published service changes revalidate the homepage/listing/detail paths. Permanent service deletion is admin-only, requires browser confirmation, removes the public route, attempts to clean up its image, and redirects with a persistent success or cleanup-warning notice; existing inquiries retain their saved service-name snapshot while the live service relation is cleared.
- Added controlled public contact settings and service-area create/edit forms; coverage remains hidden until explicitly enabled.
- Added a FAQ question/choice editor backed by existing `faq_nodes` and `faq_options`, plus a public FAQ reader that uses a complete published database decision tree and retains the existing demo flow if no valid published tree exists.
- FAQ questions can be published leaf-first and root-last; publishing checks one root, at least one choice per published node, links only to published nodes, graph reachability, and absence of loops. The public reader independently rejects incomplete or malformed published graphs and falls back to the demo flow.
- Added authorized service-image upload using the existing `site-media` bucket, file-type and signature checks, a 5 MB limit, descriptive alt text, safe generated storage paths, metadata updates, and replacement-file cleanup. Next Server Actions body limit is configured to 6 MB for these checked uploads.
- Added a factual CMS note that backup behavior is determined by the Supabase plan and owner settings; the app does not claim to verify or create backups.

**Code and route checks:** `npm run lint`, `npm run typecheck`, and `npm run build` pass with the current CMS and deletion-feedback changes. Local smoke tests return 200 for `/`, `/about`, `/contact`, `/services`, and `/admin/login`; anonymous `/admin/content` redirects with HTTP 307. Both deletion notice variants render correctly. `git diff --check` passes. The development server on port 3000 remains available for owner-led review.

**Verified live with the signed-in admin:** Created a unique synthetic draft service, edited and reloaded it to confirm persistence, verified it stayed unpublished (absent from `/services` and returned 404 at its detail URL), opened and canceled the delete confirmation, then the owner permanently deleted it. A subsequent CMS reload confirmed the test service was gone. Existing services and inquiries were not changed.
The homepage copy save was also tested using the existing values without changing the public copy; the values persisted after reload and matched the eyebrow, headline, and introduction rendered on `/`.
Existing public contact settings were saved without changing their values, persisted after reload, and matched the contact links on `/contact`. A clearly labeled synthetic service area was created and edited; its values persisted, and `/about` hid it while inactive. With owner approval, it was temporarily activated and appeared on `/about`; it was then deactivated, persisted as inactive, and disappeared from the public page. The synthetic record `CMS Verification Test Updated, ZZ` remains in the CMS as inactive. The CMS currently has no delete control for service areas.
Uploaded a generated tiny PNG to a separate synthetic draft service, then replaced it with another; the updated alt text and image-present state persisted after reload, and the service remained unpublished. Replacement completed without a cleanup warning. The image-replacement action now reports a clear partial-success message if Supabase cannot remove the previous image. With owner approval, the image-test service was permanently deleted and is absent from the CMS. The delete action was subsequently updated to show a persistent success/cleanup-warning notice; both notice variants were tested. The actual storage-cleanup outcome for the already-deleted test image was not independently inspected.

**Verification still required:** FAQ publication and visitor display, and admin/content-editor authorization. If desired, directly inspect Supabase Storage for any orphan left by the earlier image-test deletion, which occurred before the persistent cleanup-warning notice was added. No FAQ seed or unapproved real business copy is added; editors must enter approved content. Editor role/RLS checks remain in the Slice 5 checklist.

**Next action:** Continue Slice 6 verification with safe test data, then complete the remaining Slice 5 role checks and deferred Slice 4 submission verification before final QA.
