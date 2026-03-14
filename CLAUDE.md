# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm start        # start production server
```

No lint or test scripts are configured.

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...                  # required for AI features
NEXT_PUBLIC_SUPABASE_URL=https://...          # optional — enables auth + cloud storage
NEXT_PUBLIC_SUPABASE_ANON_KEY=...             # optional — enables auth + cloud storage
```

Without Supabase vars, the app runs in unauthenticated mode (localStorage only). With them, users see Google sign-in and data syncs to Supabase.

## Architecture

**Next.js 15 App Router** — all screens live in `app/page.tsx` as a single-page shell. Navigation between `today | journal | about | settings` is client-side state, not routing.

### Auth & data modes

`components/providers/AuthProvider.tsx` checks if Supabase env vars are set (`configured` flag). When configured, users must sign in via Google OAuth before seeing any content. When unconfigured, the app bypasses auth entirely.

`uid` and `idToken` (Supabase access token) are threaded from `AuthProvider` → `page.tsx` → screen components → API calls (`Authorization: Bearer <token>` header).

### Storage layer (`lib/storage.ts`)

Every storage operation has two variants:
- **Sync** (`getEntryByDate`, `saveEntry`, …) — reads/writes localStorage directly
- **Async** (`getEntryByDateAsync`, `saveEntryAsync`, …) — uses Supabase when `uid` is present, falls back to localStorage

Components always call the async variants when `uid !== null`. The local copy is always written first for offline access.

Supabase table: `journal_entries`, unique on `(user_id, date, language)`.

### 30-day program (`lib/journey.ts`)

The core content is a fixed 30-day "Border Crossing" sequence in English and Korean (`BORDER_CROSSING_WEEKS_EN` / `BORDER_CROSSING_WEEKS_KO`). Day index is computed from the user's personal `startDate` (stored as `threshold_start_date` in localStorage). The start date is derived on first load from the earliest journal entry, or set to today for brand-new users. It is clamped to `[0, 29]` — day 30 is the last prompt and stays there permanently. `getProgramDayIndex(dateStr, anchorDate)` and `getBorderCrossingPromptForDate(language, date, anchorDate)` both require the anchor to be passed explicitly.

### AI API routes

| Route | Purpose |
|---|---|
| `POST /api/prompt` | Generates (or retrieves cached) daily prompt |
| `POST /api/reflect` | Generates structured reflection JSON from user response |
| `POST /api/crossing-portrait` | Synthesizes a 4-sentence portrait from all journal entries |

All routes call `lib/anthropic.ts` (server-only). The model and token limits are configured in `lib/config.ts`. API responses are raw JSON strings validated by `lib/schema.ts`, which includes Zod schemas and a basic repair pass for malformed JSON (trailing commas, unquoted keys).

### Language support

`Language = "en" | "ko"`. The two languages are independent — not translations. Each has its own prompt sequence (`BORDER_CROSSING_WEEKS_KO`) and UI copy (`lib/i18n.ts`). Prompt cache keys are `threshold_prompt_v3_{date}_{language}`, so switching language loads a separate prompt.

### Database schema & migrations

Schema lives in `supabase/migrations/`. Each migration is a numbered SQL file (`001_...`, `002_...`).

**To apply a migration:**
```bash
export SUPABASE_ACCESS_TOKEN=sbp_...
./supabase/migrate.sh supabase/migrations/002_your_migration.sql
```

**Safe schema change rules — never break user data:**
- ✅ `ADD COLUMN IF NOT EXISTS` — always safe
- ✅ `CREATE INDEX IF NOT EXISTS` — always safe
- ❌ `DROP COLUMN` — permanently destroys data
- ❌ `DROP TABLE` — destroys everything
- ❌ `RENAME COLUMN` — breaks existing code
- ❌ `ALTER COLUMN TYPE` — can corrupt data

`reflection_json JSONB` stores the full Reflection object as a safety net. Individual columns (`leaving_text`, `summary_title`, etc.) are for querying; the JSON is the source of truth for reading back entries.

### Key files

- `lib/config.ts` — change the AI model here only
- `lib/i18n.ts` — all UI copy (EN + KO)
- `lib/prompts.ts` — system prompts for the AI (reflection + prompt generation)
- `lib/schema.ts` — Zod validation + JSON repair for all AI responses
- `lib/journey.ts` — 30-day sequence data and day-index calculation
- `types/index.ts` — `Language`, `DailyPrompt`, `Reflection`, `JournalEntry`, `CrossingPortrait`
