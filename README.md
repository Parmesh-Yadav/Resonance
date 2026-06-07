# 🎙️ Resonance - Full Stack AI Voice SaaS

![Resonance](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596be?style=for-the-badge&logo=trpc&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_V4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Resonance is a modern, production-grade AI Voice SaaS platform. It allows users to manage and synthesize speech using state-of-the-art Voice Cloning & Text-to-Speech (TTS) models. Built with Next.js App Router, tRPC, Prisma, and Cloudflare R2, it features comprehensive enterprise functionalities like organizational accounts (via Clerk).

## 🚀 Key Features

- **Text-to-Speech Synthesis:** Generate high-quality voice audio from text with parameter controls (temperature, top-P, top-K, repetition penalty).
- **Voice Management System:** Browse system defaults or create custom cloned AI voices.
- **Multi-tenant Organization Auth:** Full organization and user authentication support powered by Clerk.
- **Cloud Object Storage:** Stores synthesized audio generations reliably using Cloudflare R2 SDK integration (AWS S3 compatible).
- **End-to-End Type Safety:** Type-safe API communication between server and client via tRPC & Zod.
- **Beautiful & Modern UI:** Responsive and accessible interface built with Shadcn UI, Radix, Base-UI, and Tailwind CSS v4.
- **Form Management:** Type-safe, validated forms utilizing TanStack React Form.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (Version 16 - App Router)
- **Library:** [React](https://react.dev/) 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Components:** [Shadcn UI](https://ui.shadcn.com/) / Radix UI / Vaul
- **Forms & State:** [TanStack React Form](https://tanstack.com/form/latest) & [TanStack Query](https://tanstack.com/query/latest)

### Backend
- **API Engine:** [tRPC](https://trpc.io/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (pg + Prisma Postgres adapter)
- **Object Storage:** Cloudflare R2 (via [@aws-sdk/client-s3](https://docs.aws.amazon.com/sdk-for-javascript/))
- **Environment Validation:** [@t3-oss/env-nextjs](https://env.t3.gg/) with Zod

---

## ⚙️ Getting Started

### Prerequisites

To run this project, make sure you have the following installed and set up:
- **Node.js** (v20+)
- **npm / yarn / pnpm / bun**
- **Clerk Account** (for authentication)
- **PostgreSQL Database** (e.g., local, Supabase, Neon, or Railway)
- **Cloudflare R2 Account** (or standard AWS S3 bucket)

### 1. Clone the repository

```bash
git clone https://github.com/Parmesh-Yadav/resonance.git
cd resonance
```

### 2. Install dependencies

```bash
npm install
# or yarn install / pnpm install / bun install
```

### 3. Environment Setup

Create a `.env` file at the root of the application by referencing the required keys found in `src/lib/env.ts`.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/resonance"

# App
APP_URL="http://localhost:3000"

# Clerk Authentication (Get these from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Cloudflare R2 Storage (or AWS S3)
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="resonance_audio_assets"

# Environment Validation config
# SKIP_ENV_VALIDATION=true # Uncomment if building without env vars
```

### 4. Database Setup

Push the Prisma schema to your PostgreSQL database and generate the Prisma Client.

```bash
npx prisma db push
# or to generate artifacts directly:
npm run postinstall
```

*(Optional: populate system voices with `npm run seed-system-voices` if you have a seeding script configured).*

### 5. Start the development server

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

Resonance uses a feature-based architecture to encapsulate specific domain logic:

```txt
resonance/
├── prisma/             # Database schema and migrations (schema.prisma)
├── src/
│   ├── app/            # Next.js App Router layout, pages, and API routes
│   ├── components/     # Global and generic shared UI elements (Shadcn components)
│   ├── features/       # Feature modules: (dashboard, text-to-speech, voices)
│   ├── generated/      # Prisma output
│   ├── hooks/          # Shared custom React Hooks
│   ├── lib/            # Configuration utilities (env.ts, db.ts, r2.ts, utils.ts)
│   └── trpc/           # tRPC setup, queries context, and API routers
└── public/             # Static assets
```

---

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles Next.js for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Analyzes the codebase using ESLint.
- `npm run postinstall`: Generates the Prisma client automatically after dependency installation.

---

## ☁️ Deployment

For optimal performance, we recommend deploying to [Vercel](https://vercel.com/) (frontend) paired with a robust Postgres provider like [Railway](https://cwa.run/railway), [Neon](https://neon.tech/), or [Supabase](https://supabase.com/).

Make sure to map all respective `.env` variables into your deployment portal settings prior to spinning up a production build.

---

*This application is constantly evolving. Contributions, pull requests, and forks are welcome!*

## 🧭 Current Status (2026-06-07)

The following notes reflect the repository's current implementation details, recent fixes, and recommended local workflows. This is intended to help contributors and maintainers get up-to-speed quickly.

- **Framework & runtime:** Next.js 16 (App Router), React 19, TypeScript.
- **Key dependencies present:** `wavesurfer.js` (audio preview), `@prisma/client` / `prisma` (ORM & migrations), `@aws-sdk/client-s3` (R2/S3), `@clerk/nextjs` (auth). See `package.json` for the full list of runtime and dev dependencies.
- **Text-to-Speech feature:** Implemented under `src/features/text-to-speech/`. The player UI and controls are in `src/features/text-to-speech/components/voice-preview-panel.tsx` and audio rendering is handled by the `use-wavesurfer` hook at `src/features/text-to-speech/hooks/use-wavesurfer.ts`.
- **Audio preview/player:** The preview supports play/pause, seek (±10s), visual waveform (WaveSurfer), and direct download of the generated WAV file via the Download button.
- **Recent bug fix (time formatting):** The time display in the preview previously used `date-fns` to format a synthetic `Date`, which could show incorrect minutes due to local timezone offsets (e.g. always showing `30:01 / 30:01` or an offset). This has been replaced with a pure duration formatter in `src/features/text-to-speech/components/voice-preview-panel.tsx` so durations render consistently as `mm:ss`.
- **Prisma / Migrations:** The `prisma/` folder contains the schema and migration history. Use `npx prisma migrate deploy` in production or `npx prisma db push` for a quick local sync. The project runs `prisma generate` on `postinstall` to keep the client up-to-date.
- **Seed & helper scripts:** There are helper scripts in `scripts/` including `seed-system-voices.ts` and a `system-voices/` directory for seeded assets. Use `tsx scripts/seed-system-voices.ts` or wire into an npm script if needed.

### Notable scripts (from package.json)

```bash
npm run dev       # next dev
npm run build     # next build
npm run start     # next start (production)
npm run lint      # run ESLint
npm run postinstall # prisma generate (runs automatically after install)
npm run sync-api   # custom sync script via tsx
```

### Local development checklist

1. Ensure Node.js v20+ is installed.
2. Create a local `.env` with `DATABASE_URL`, Clerk keys, and R2/S3 credentials (see `src/lib/env.ts` for required keys).
3. Install deps: `npm install` (this will run `prisma generate` via `postinstall`).
4. Apply database state: `npx prisma db push` (or run migrations with `npx prisma migrate dev`).
5. (Optional) Seed system voices: `tsx scripts/seed-system-voices.ts`.
6. Run: `npm run dev` and open http://localhost:3000.

### Troubleshooting & notes

- If audio waveform or playback is missing, verify `wavesurfer.js` is installed (present in `package.json`) and that the `use-wavesurfer` hook receives a valid `audioUrl`.
- If you see incorrect durations in the UI, update to the latest `voice-preview-panel.tsx` (the file now uses a duration-based formatter rather than `date-fns` on a synthetic Date).
- If the build fails due to missing environment variables, you can bypass strict validation locally by temporarily setting `SKIP_ENV_VALIDATION=true` (not recommended for production).
- Consider removing unused dependencies (for example `date-fns`) if no other code paths rely on it — the time-formatting fix removed the local `date-fns` usage in the preview component.

### Next suggested steps for maintainers

- Add a small integration test to validate the `voice-preview-panel` duration output for several sample durations.
- Add a documented npm script for seeding system voices (if frequently used): e.g. `seed-system-voices`.
- Audit dependencies and remove unused ones to reduce bundle size.

If you'd like, I can open a PR that adds the integration test and the `seed-system-voices` npm script.
