# Project Overview (Simple & Sweet)

This is a friendly, simple overview of the project in this workspace. It explains what the app does, the main folders, how to run it, and where to look next — all in plain language.

---

## What is this?

A Next.js app that manages and shares event photos. It has:
- A public gallery for guests.
- An admin area for event managers to upload photos, view storage, and handle download requests.
- API routes for uploads, downloads, and analytics.

The project uses modern tools like Next.js (app router), Tailwind CSS, Prisma for DB, and Cloudinary for images.

---

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

---

## Important environment variables

You may need to set these in a `.env` file (or in your platform settings):

- `DATABASE_URL` — your database connection (Prisma).
- `NEXTAUTH_SECRET` — secret for authentication.
- `NEXTAUTH_URL` — URL of the app in dev/prod.
- `CLOUDINARY_URL` or Cloudinary keys — for image uploads.
- Any other keys referenced in `lib/auth.ts` or `lib/cloudinary.ts`.

---

## Where to find things (simple folder map)

- `app/` — main Next.js pages and routes.
  - `app/admin/` — admin UI (dashboard, events, login, storage).
  - `app/api/` — server API routes (upload, photos, events, auth).
  - `app/gallery/` — public gallery pages.
  - `app/download/` and `app/login/` — public entry points.

- `components/` — React UI components used across the site.
  - `components/admin/` — admin-specific components (sidebar, dashboards).
  - `components/gallery/` — gallery UI (photo grid, modals, slideshow).
  - `components/ui/` — small UI pieces like `Button` and `Modal`.

- `lib/` — helpers and integrations:
  - `lib/prisma.ts` — Prisma client & DB helpers.
  - `lib/cloudinary.ts` — Cloudinary helpers for uploads.
  - `lib/auth.ts` — auth helpers.

- `hooks/` — React hooks such as `useEvent.ts` and `usePhotos.ts`.

- `providers/` — React context providers: session, theme, queries.

- `prisma/` — database schema (`schema.prisma`) and seed script.

- `public/uploads/` — static upload folders (used for local uploads).

- `types/` — TypeScript types used across the app.

---

## Key files to check first

- `next.config.js` — Next.js config.
- `package.json` — scripts and dependencies.
- `prisma/schema.prisma` — DB models.
- `app/api/` — API route implementations.
- `lib/prisma.ts`, `lib/cloudinary.ts`, `lib/auth.ts` — important logic.
- `components/gallery/PhotoGrid.tsx` and `components/gallery/PhotoModal.tsx` — core gallery UI.

---

## Typical flows (what the app does)

- Guest view: visitors open the gallery, browse photos, and can request downloads.
- Admin view: event managers log in, upload photos, view storage, and approve download requests.
- API: endpoints handle uploads, likes, download requests, and analytics.

---

## Testing and database

- Use Prisma to manage the database. Typical commands:

```bash
npx prisma migrate dev
npx prisma db seed
```

- Look at `prisma/seed.ts` for sample data.

---

## Tips for editing

- UI components live in `components/` and are small — change them to affect the app quickly.
- Hooks in `hooks/` handle data fetching — tweak them if APIs change.
- API routes are under `app/api/` — changing them updates server behavior.

---

## Next steps (if you want me to help)

- I can generate a short `README.md` tailored for deployment (Vercel, Fly.io).
- I can add a `.env.example` listing required environment variables.
- I can create quick developer notes for running migrations and seeds.

If you want any of these, tell me which one and I'll add it.

---

Made simple and sweet — ask me to change tone or add details.
