-- ─────────────────────────────────────────────────────────────────────────────
-- Threshold — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Safe to re-run: uses IF NOT EXISTS / CREATE POLICY IF NOT EXISTS
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── journal_entries ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date           DATE        NOT NULL,
  language       TEXT        NOT NULL CHECK (language IN ('en', 'ko')),

  -- Program context
  program_day    INTEGER,

  -- Prompt
  prompt_theme   TEXT,
  prompt_text    TEXT,

  -- User's written response
  response_text  TEXT,

  -- Reflection — individual queryable columns
  summary_title       TEXT,   -- reflection.border_title
  summary_body        TEXT,   -- reflection.reflection_summary
  leaving_text        TEXT,   -- reflection.what_im_leaving
  entering_text       TEXT,   -- reflection.what_im_entering
  emerging_text       TEXT,   -- reflection.what_wants_to_emerge
  next_step_text      TEXT,   -- reflection.next_courageous_step
  threshold_statement TEXT,   -- reflection.threshold_statement
  mood_tags           TEXT[], -- reflection.mood_tags

  -- Full reflection object (lossless, used for reading back)
  reflection_json     JSONB,

  created_at     TIMESTAMPTZ DEFAULT NOW(),

  -- Required for upsert to work in storage.ts (onConflict: "user_id,date,language")
  UNIQUE (user_id, date, language)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- SELECT: users can only read their own entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'journal_entries' AND policyname = 'Users can select own entries'
  ) THEN
    CREATE POLICY "Users can select own entries"
      ON journal_entries FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- INSERT: users can only insert entries for themselves
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'journal_entries' AND policyname = 'Users can insert own entries'
  ) THEN
    CREATE POLICY "Users can insert own entries"
      ON journal_entries FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- UPDATE: users can only update their own entries (needed for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'journal_entries' AND policyname = 'Users can update own entries'
  ) THEN
    CREATE POLICY "Users can update own entries"
      ON journal_entries FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ─── Index for common queries ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date
  ON journal_entries (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_language
  ON journal_entries (user_id, language, date DESC);
