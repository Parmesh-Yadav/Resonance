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
│   ├── features/       # Feature modules: dashboard, text-to-speech, voices
│   │   └── voices/     # Voice library, search, playback, upload, and recording flows
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

## 🧭 Current State Snapshot (2026-06-21)

This section reflects the current working tree, including unstaged changes in this workspace.

- **Framework & runtime:** Next.js 16.2.4 App Router, React 19.2.4, TypeScript, Clerk, Prisma 7.8.0, tRPC, Nuqs, Tailwind CSS v4.
- **Dev workflow:** `npm run dev` currently uses `next dev --webpack`. A `next.config.js` file now carries the Next.js config, and `next.config.ts` is no longer used in this workspace.
- **App shell updates:** The root layout now wraps the app with `ClerkProvider`, `TRPCReactProvider`, `NuqsAdapter`, and the Sonner toaster. Metadata is defined in `src/app/layout.tsx`.
- **Voices feature:** A full voices library now exists under `src/app/(dashboard)/voices/` and `src/features/voices/`. It includes search, split views for custom and built-in voices, playback controls, deletion for custom voices, and a create flow that supports both file upload and microphone recording.
- **Voice creation pipeline:** Custom voices are created through `/api/voices/create`, validated for name/category/language, limited to 20MB, and required to be at least 10 seconds long before being uploaded to Cloudflare R2 and persisted in Prisma.
- **Voice playback pipeline:** `/api/voices/[voiceId]` now serves signed audio for both system and custom voices, with access control enforced for organization-owned custom voices.
- **Recording support:** `recordrtc` and `@types/recordrtc` were added, along with `src/hooks/use-audio-playback.ts` and `src/features/voices/hooks/use-audio-recorder.ts`, to support in-browser microphone capture and preview.
- **Shared utilities:** `src/lib/utils.ts` now includes `formatFileSize`, which is used across the voice upload and recording UI.
- **tRPC integration:** `voicesRouter` now powers `getAll` and `delete`, and the voices page prefetches and hydrates the query state with Nuqs search params.
- **Dependencies & install behavior:** Prisma generation still runs on `postinstall`, so `npm install` must continue to succeed with a valid Prisma schema and environment.

### Notable scripts (from package.json)

```bash
npm run dev        # next dev --webpack
npm run build      # next build
npm run start      # next start (production)
npm run lint       # run ESLint
npm run postinstall # prisma generate (runs automatically after install)
npm run sync-api   # custom sync script via tsx
```

### Local development checklist

1. Ensure Node.js v20+ is installed.
2. Create a local `.env` with `DATABASE_URL`, Clerk keys, and R2/S3 credentials (see `src/lib/env.ts` for required keys).
3. Install deps: `npm install` (this will run `prisma generate` via `postinstall`).
4. Apply database state: `npx prisma db push` (or run migrations with `npx prisma migrate dev`).
5. Open `/voices` to review the current library experience, or `/text-to-speech` to test generation with a selected voice.
6. Run: `npm run dev` and open http://localhost:3000.

### Current notes

- The TTS preview and voice library both depend on audio playback support in the browser, so microphone permissions and autoplay restrictions can affect local testing.
- If you need a quick sanity check on custom voices, create one from the voices page, verify it appears in the custom list, then test playback and deletion from the card menu.
- The current repository state includes uncommitted work, so this README intentionally documents the live workspace rather than a clean release snapshot.
