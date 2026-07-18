# Lucía Barz — Terapeuta Holística

A professional Spanish-language landing page for Lucía Barz, a holistic therapist, aromatherapist, and Pranic Healing Master.

## Run & Operate

- `pnpm --filter @workspace/lucia-barz run dev` — run the landing page (port 5000)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `SESSION_SECRET` — session secret for Express

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion
- Typography: Cormorant Garamond (serif headings) + Lato (body)
- Forms: react-hook-form + zod validation
- API: Express 5 (api-server artifact)
- DB: PostgreSQL + Drizzle ORM

## Where things live

- `artifacts/lucia-barz/` — main landing page React app
  - `src/pages/Home.tsx` — all 8-9 sections of the landing page
  - `src/index.css` — earth-tone CSS variables and global styles
  - `vite.config.ts` — Vite config (PORT defaults to 5000, BASE_PATH defaults to "/")
- `artifacts/api-server/` — Express API backend
- `.replit-artifact/artifact.toml` — port/path routing config per artifact

## Architecture decisions

- Single-page landing (no router needed) — all content in `Home.tsx` with scroll sections
- PORT is optional in vite.config.ts (defaults to 5000) to tolerate env injection timing issues in the Replit workflow system
- Artifact workflow restart uses `restartWorkflow()` sandbox callback (not the `restart_workflow` tool) — the tool has a timing issue with artifact-managed workflows
- Earth tone palette defined as CSS custom properties in `index.css`

## Product

- Spanish-language only holistic therapy landing page
- Sections: Hawaii 2025 availability banner, Hero, El Sistema, ¿Para quién es?, Temas del Proceso, Presencia en Hawái, Cómo Funciona, Contact form, Footer
- Free initial virtual meeting offered; client covers travel for in-person sessions
- Spanish-speaking clients only notice included

## User preferences

- Zen, elegant, minimalist design with earth-tone palette
- Cormorant Garamond for headings, Lato for body text
- Fully responsive layout

## Gotchas

- **Always use `restartWorkflow()` in code_execution** to restart `artifacts/lucia-barz: web` — the `restart_workflow` tool times out with DIDNT_OPEN_A_PORT for this artifact
- vite.config.ts must NOT throw on missing PORT (use defaults instead)
- `[services.env]` in artifact.toml must come BEFORE `[services.production]` to parse correctly

## Pointers

- See the `pnpm-workspace` skill for workspace structure and TypeScript setup
- See the `react-vite` skill for Vite artifact conventions
