# CLAUDE.md

## Branch: `design_2` — Design Experimentation Only

**This branch is a sandbox for visual/design experiments. It will be merged into `main` at some point. Do NOT make changes that would break the live website.**

### Rules for this branch

- All changes must be safe to merge into `main` without breaking existing functionality.
- Do not remove, rename, or restructure pages, routes, components, or services that already exist and work on `main`.
- Do not touch backend integrations (Supabase, Stripe, Supabase Edge Functions in `supabase/functions/`) unless the user explicitly asks.
- Do not modify environment variable names or config that the deployment depends on.
- Design changes should be additive or visually isolated — prefer updating styles, layouts, and component props rather than gutting and rewriting working logic.
- If a change is risky or could break something on `main`, say so clearly before proceeding and ask for confirmation.

### Project Overview

- **Stack:** React 19 + TypeScript, Vite, Tailwind CSS, Framer Motion, Lenis (smooth scroll)
- **Backend:** Supabase (auth + database), Stripe (payments via Supabase Edge Functions)
- **Pages:** `Accueil` (home), `Merch`, `PromGotham`, `PromRestaurant`, `Admin`
- **Hosting:** Static build, deployed via GitHub Actions (see `.github/workflows/`)
- **Dev server:** `npm run dev` — Build: `npm run build`

### What belongs in this branch

- Layout redesigns, spacing, typography, color changes
- New UI components or visual sections
- Animation and motion experiments
- Responsive/mobile improvements

### What does NOT belong here without explicit user approval

- Logic changes to cart, checkout, auth, or admin flows
- Database schema or RLS changes
- Changes to existing API surface (Supabase function calls, Stripe integration)
- Renaming or deleting files that exist on `main`
