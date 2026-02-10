# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuizBells (퀴즈벨) is a Korean-language Next.js web app that aggregates daily quiz answers from popular Korean "app-tech" apps (Toss, Cashwalk, Shinhan, Kakao Bank, NH Bank, etc.). It includes a blog/tips section, URL shortener, push notifications, and a serverless crawler system.

## Commands

```bash
npm run dev          # Dev server with Turbopack (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint (flat config v9)
```

No test framework is configured.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style, Radix UI)
- **State**: Zustand (`src/store/`)
- **Database**: Supabase (PostgreSQL) — clients in `src/lib/supabase.ts`
- **Push Notifications**: Firebase Cloud Messaging — config in `src/lib/firebase.ts`, `src/lib/firebase-admin.ts`
- **Deployment**: Cloudflare Pages (Edge Functions for API routes)
- **Font**: Pretendard (Korean-optimized, loaded via CDN in `globals.css`)

## Architecture

### Path alias
`@/*` maps to `./src/*` (tsconfig).

### App Router structure (`src/app/`)
- `/quiz/[type]/[date]` — Core feature: quiz answers by app type and date
- `/posts/[id]`, `/tips/[id]` — Blog content
- `/s/[code]` — Short URL redirect handler
- `/admin/users` — Admin dashboard
- `/api/` — 26+ Edge API route handlers (quiz CRUD, users, feedback, email, URL shortener, etc.)
- `/sitemap*.xml/`, `/feed.xml/` — SEO routes

### Client vs Server components
- Page components are mostly server components with metadata exports
- Interactive components (`QuizComponent`, `QuizFeedback`, `AlarmSetting`, etc.) are client components in `src/components/`
- UI primitives live in `src/components/ui/` (shadcn/ui)

### State management
- `src/store/useAppStore.ts` — Login info, date navigation state
- `src/store/settingsStore.ts` — App settings
- Auth tokens stored in localStorage under `quizbells-auth`

### Crawler system (`crawl/`)
Separate Node.js project using Serverless Framework. Scrapes quiz data from external sources (bntnews, ppomppu, etc.) and has its own Firebase config (`devupbox.json`). Independent from the main Next.js app.

### Key data tables (Supabase)
`quizbells_answer`, `quizbells_users`, `quizbells_feedback`, `quizbells_email_subscribers`, `email_logs`

### Quiz items registry
Quiz app definitions (names, icons, routes, colors) are in `src/utils/utils.ts`. This is the central config for supported quiz types.

## Environment Variables

**Public** (client-accessible): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BASE_URL`, Firebase `NEXT_PUBLIC_FIREBASE_*` vars.

**Server-only**: `SUPABASE_SERVICE_ROLE_KEY`, `PROJECT_ID`, `CLIENT_EMAIL`, `PRIVATE_KEY` (Firebase Admin).

## ESLint Overrides

Several strict rules are disabled in `eslint.config.mjs`: `@typescript-eslint/no-explicit-any`, various `@next/next/*` rules, and `react-hooks/rules-of-hooks` purity checks. Follow existing patterns rather than tightening lint rules.
