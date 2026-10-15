# Cleaning Service Full-Stack App

Full-stack cleaning-services website built with Next.js, TypeScript, and Supabase. The product scope and implementation sequence are documented before application scaffolding begins.

## Project documents

- [System design](./SYSTEM-DESIGN.md) — architecture, data model, security, workflows, and implementation slices.
- [Product requirements](./PRD.md) — agreed MVP behavior and decisions to confirm.
- [Development plan](./PLAN.md) — phases, milestones, risks, and validation.
- [Design concept](./Design.md) — the approved MVP visual direction and later refinement goals.
- [Agent instructions](./AGENTS.md) — project-wide engineering and security conventions.
- [Development status](./DEVELOPMENT-STATUS.md) — current checkpoint and next slice.

## Current status

Planning is complete. The Next.js application has not been scaffolded yet. Start with Slice 0 and Slice 1 in `SYSTEM-DESIGN.md`.

## Security

- Never commit `.env.local`, Supabase secrets, or customer data.
- Keep real environment values in the local environment or the host's encrypted settings.
- Use Supabase Row Level Security for data authorization; protecting routes in the UI is not sufficient.
- The public quote form must create inquiries only; it must not expose inquiries or claim to confirm appointments.
- The chatbot is Option A: a predefined FAQ decision tree, with no LLM/API integration.
