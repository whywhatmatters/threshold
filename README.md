# Threshold

A daily reflection app for people navigating life transitions.

One prompt per day. A short response. A structured reflection artifact.
Calm, minimal, literary. Not therapy. Not coaching.

---

## Setup

**1. Clone and install**

```bash
cd threshold
npm install
```

**2. Add your API key**

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

**3. Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

```
app/
  api/prompt/route.ts     POST /api/prompt   — generates daily prompt server-side
  api/reflect/route.ts    POST /api/reflect  — generates reflection artifact server-side
  layout.tsx
  page.tsx                app shell, screen routing, language state

components/
  screens/
    TodayScreen           daily prompt + response + reflection flow
    JournalScreen         archive of past entries
    AboutScreen           product explanation
    SettingsScreen        language toggle
  ui/
    Header                wordmark + date
    BottomNav             4-tab navigation
    PromptCard            displays the daily prompt
    ResponseForm          textarea + submit/skip
    ReflectionCard        structured reflection output
    JournalList           scrollable entry list
    JournalDetailModal    slide-up sheet for past entries
    LanguageToggle        EN / 한국어 switcher
    LoadingDots           calm loading states

lib/
  anthropic.ts            Anthropic SDK wrapper (server only)
  config.ts               AI model constant
  prompts.ts              system prompts for EN + KO (prompt gen + reflection)
  schema.ts               Zod validation + JSON repair
  storage.ts              localStorage abstraction (swap for Supabase here)
  i18n.ts                 all UI copy in EN + KO
  dates.ts                date helpers

types/
  index.ts                Language, DailyPrompt, Reflection, JournalEntry
```

## Language support

- EN and KO are not translations of each other — each is written natively
- Prompts and reflections are generated directly in the selected language
- Journal entries are stored per-language (switching language shows that language's archive)
- Prompt cache is keyed by date + language

## Persistence

All data is in `localStorage` via `lib/storage.ts`. To migrate to Supabase or Firebase, replace the function implementations in that file only — no component changes needed.

## Deployment

```bash
npm run build
```

Deploy to Vercel. Set `ANTHROPIC_API_KEY` in your Vercel environment variables.

The API key is only ever used server-side in `/api/prompt` and `/api/reflect`. It is never sent to the browser.
