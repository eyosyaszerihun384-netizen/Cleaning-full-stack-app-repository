# Development Plan

## Project approach

Build the agreed cleaning-service website from scratch with Next.js, TypeScript, and Supabase. Deliver a secure CMS and inquiry workflow together with **Option A's guided FAQ chatbot only**. Do not implement an AI/LLM chatbot.

The proposal's target is 2–3 weeks. The schedule below follows that target and depends on timely approval of content, page scope, design, and hosting.

## Phase 0 — Project and requirements confirmation

**Target:** Week 1

- Confirm the five page templates, service detail routes, and final navigation.
- Confirm the U.S. city/state, service radius, currency, and any local operating or privacy requirements.
- Gather approved service descriptions, pricing, coverage, contact information, images, testimonials, and brand assets.
- Confirm inquiry fields and whether preferred timing is requested.
- Confirm launch language, admin users, content-publishing responsibilities, and inquiry statuses.
- Confirm privacy/retention expectations, map approach, hosting, domain, and Supabase project.
- Record acceptance criteria and obtain approval of wireframes and visual direction.

**Exit criteria:** Scope and content are approved; outstanding assumptions affecting implementation are resolved or recorded.

## Phase 1 — Foundation and data/security design

**Target:** Week 1–2

- Create the Next.js TypeScript application and establish formatting, linting, and test commands.
- Configure Supabase clients for server and browser contexts using environment variables.
- Design PostgreSQL schema and migrations for editable content, FAQ flow, and inquiries.
- Define Supabase Auth staff access, RLS policies, and Storage policies if media uploads use Storage.
- Add safe loading/error handling and server-side input validation patterns.
- Add `.env.example`; keep real project credentials only in ignored local environment files.

**Exit criteria:** Application runs locally with documented Supabase configuration; migrations and access policies are reviewable and tested.

## Phase 2 — Public website

**Target:** Week 2

- Implement responsive global layout, navigation, footer, and calls to action.
- Build Home, Services, About, Quote/Booking, and Contact areas from approved designs.
- Make service detail content consistent and easy to update.
- Add page metadata, semantic HTML, accessible controls, and responsive image handling.
- Implement the inquiry form with client and server validation and clear pending/success/error states.
- Persist inquiries in Supabase; verify public access cannot read inquiry records.

**Exit criteria:** Visitors can browse all approved pages and successfully submit an inquiry on desktop and mobile.

## Phase 3 — CMS and staff inquiry dashboard

**Target:** Week 2

- Implement staff sign-in/sign-out and protected admin routes.
- Build content editing for approved page copy, service descriptions, and pricing text.
- Add image replacement/upload with file constraints and secure storage rules if applicable.
- Build the inquiry list/detail view and staff-managed statuses.
- Verify authorization at both application and database-policy layers.
- Provide empty, loading, and recoverable error states.

**Exit criteria:** Authorized staff can maintain the approved content and process inquiries; unauthorized users cannot access these functions or records.

## Phase 4 — Option A FAQ chatbot

**Target:** Week 2–2.5

- Map stakeholder-approved questions and answers into a finite button-guided decision tree.
- Implement the launcher, menu, answer, back/restart, dismiss/reopen, and contact/inquiry fallback interactions.
- Make the FAQ answers maintainable through the agreed CMS mechanism or documented configuration process.
- Ensure small-screen and keyboard usability.
- Test all paths and verify no LLM/API integration or paid AI dependency exists.

**Exit criteria:** All approved paths produce the expected answer or fallback and the feature works on supported screen sizes.

## Phase 5 — QA, launch, and handover

**Target:** Week 3

- Run linting, type-checking, unit/integration tests, and a production build.
- Test visitor inquiry submission, admin authorization, RLS behavior, content updates, and FAQ paths.
- Check responsive layouts, keyboard navigation, form errors, metadata, and basic performance.
- Verify production environment variables, Supabase migrations, storage policies, and backup process.
- Configure hosting and domain; deploy and perform smoke tests against production.
- Train staff on content edits, inquiry management, and FAQ answer maintenance.
- Hand over operating instructions and confirm ownership of hosting, domain, and Supabase accounts.

**Exit criteria:** Stakeholder approves the demo; production smoke tests pass; staff can perform core operations; credentials and account ownership are handed over securely.

## Suggested initial milestones

1. **M1 — Scope and design approved:** page count, content, form fields, chatbot content, and designs confirmed.
2. **M2 — Public site and inquiry flow ready:** public pages work and inquiries are securely persisted.
3. **M3 — CMS and FAQ ready:** staff workflows and every approved FAQ path pass review.
4. **M4 — Production launch:** deployment, smoke tests, training, and handover complete.

## Validation checklist

- [ ] Clean install and local startup work with the documented environment variables.
- [ ] Type-check, lint, automated tests, and production build pass.
- [ ] All approved public routes render at mobile and desktop widths.
- [x] Invalid inquiry data is rejected; failed persistence never produces a success message.
- [x] Repeat submissions from the same email within the 10-minute window are rejected without duplicate inquiry rows.
- [x] Public visitors cannot read inquiries or access administrative operations.
- [x] Authorized staff can edit content and update inquiry status.
- [ ] FAQ button flows, back/restart behavior, and fallback are tested.
- [ ] No chatbot LLM credentials, API calls, or AI dependencies are present.
- [ ] Production secrets are configured outside source control.
- [ ] Hosting, domain, Supabase access, backups, and handover responsibilities are confirmed.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Page-count ambiguity expands scope | Agree on page templates and service detail routes before implementation. |
| Content or approvals arrive late | Make content/design sign-off an explicit Week 1 exit criterion. |
| Inquiry data is exposed through a policy gap | Test RLS policies directly and verify both anonymous and authenticated access paths. |
| FAQ answers become inaccurate | Obtain approved answers and assign a staff owner for updates. |
| Hosting/Supabase costs or limits differ from estimates | Confirm providers, quotas, and ownership before production launch. |
| “Booking” is mistaken for a confirmed appointment | Label the form as a request/inquiry and explain that staff will confirm availability. |
