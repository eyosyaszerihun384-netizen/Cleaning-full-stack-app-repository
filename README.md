# Cleaning Service Full-Stack App

Full-stack cleaning-services website built with Next.js, TypeScript, and Supabase. The application foundation is in place; backend integration will be developed in slices.

## Project documents

- [System design](./SYSTEM-DESIGN.md) — architecture, data model, security, workflows, and implementation slices.
- [Product requirements](./PRD.md) — agreed MVP behavior and decisions to confirm.
- [Development plan](./PLAN.md) — phases, milestones, risks, and validation.
- [Design concept](./Design.md) — the approved MVP visual direction and later refinement goals.
- [Agent instructions](./AGENTS.md) — project-wide engineering and security conventions.
- [Development status](./DEVELOPMENT-STATUS.md) — current checkpoint and next slice.

## Current status

Slice 1 is complete: the Next.js App Router app and responsive demo-inspired home page are in place. Supabase, inquiry persistence, CMS, and staff authentication are not connected yet. See `DEVELOPMENT-STATUS.md` for the active checkpoint.

## Local development

Requirements: Node.js LTS and npm.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Useful checks:

```powershell
npm run lint
npm run typecheck
npm run build
```

The current homepage is a development preview. The quote form intentionally does not collect or save information until the Supabase inquiry slice is implemented.

## Security

- Never commit `.env.local`, Supabase secrets, or customer data.
- Keep real environment values in the local environment or the host's encrypted settings.
- Use Supabase Row Level Security for data authorization; protecting routes in the UI is not sufficient.
- The public quote form must create inquiries only; it must not expose inquiries or claim to confirm appointments.
- The chatbot is Option A: a predefined FAQ decision tree, with no LLM/API integration.
