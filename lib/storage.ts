/**
 * Storage abstraction layer.
 * - For signed-out users: everything lives in localStorage.
 * - For signed-in users: journal entries are stored in Supabase, with
 *   localStorage as a lightweight cache / fallback.
 */

import type { JournalEntry, Language, DailyPrompt, Reflection } from "@/types";
import { getSupabaseClient } from "@/lib/supabase";
import { getProgramDayIndex } from "@/lib/journey";

const JOURNAL_KEY = "threshold_journal";
// Bump prompt cache prefix so older prompts are not reused.
const PROMPT_KEY_PREFIX = "threshold_prompt_v4";
const LANGUAGE_KEY = "threshold_language";
const START_DATE_KEY = "threshold_start_date";

function promptCacheKey(date: string, language: Language): string {
  return `${PROMPT_KEY_PREFIX}_${date}_${language}`;
}

// ─── Language ─────────────────────────────────────────────────────────────────

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === "ko" || stored === "en" ? stored : "en";
}

export function setStoredLanguage(language: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, language);
}

// ─── User Start Date ──────────────────────────────────────────────────────────

export function getStartDate(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(START_DATE_KEY);
}

export function setStartDate(date: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(START_DATE_KEY, date);
}

// ─── Daily Prompt Cache ───────────────────────────────────────────────────────

export function getCachedPrompt(date: string, language: Language): DailyPrompt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(promptCacheKey(date, language));
    if (!raw) return null;
    return JSON.parse(raw) as DailyPrompt;
  } catch {
    return null;
  }
}

export function setCachedPrompt(prompt: DailyPrompt): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(promptCacheKey(prompt.date, prompt.language), JSON.stringify(prompt));
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export function getAllEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") as JournalEntry[];
  } catch {
    return [];
  }
}

export function getEntriesForLanguage(language: Language): JournalEntry[] {
  return getAllEntries().filter((e) => e.language === language);
}

export function getEntryByDate(date: string, language: Language): JournalEntry | null {
  return getAllEntries().find((e) => e.date === date && e.language === language) ?? null;
}

export function saveEntry(entry: JournalEntry): void {
  if (typeof window === "undefined") return;
  const entries = getAllEntries().filter(
    (e) => !(e.date === entry.date && e.language === entry.language)
  );
  entries.unshift(entry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

// ─── Supabase helpers (journal) ───────────────────────────────────────────────

function reflectionToColumns(reflection: Reflection) {
  return {
    summary_title: reflection.border_title,
    summary_body: reflection.reflection_summary,
    leaving_text: reflection.what_im_leaving,
    entering_text: reflection.what_im_entering,
    emerging_text: reflection.what_wants_to_emerge,
    next_step_text: reflection.next_courageous_step,
    threshold_statement: reflection.threshold_statement,
    mood_tags: reflection.mood_tags,
    reflection_json: reflection,
  };
}

function rowToJournalEntry(row: any): JournalEntry {
  let reflection: Reflection;
  if (row.reflection_json) {
    reflection = row.reflection_json as Reflection;
  } else {
    reflection = {
      border_title: row.summary_title ?? "",
      today_prompt: row.prompt_text ?? "",
      detected_threshold: row.summary_body ?? "",
      reflection_summary: row.summary_body ?? "",
      what_im_leaving: row.leaving_text ?? "",
      what_im_entering: row.entering_text ?? "",
      what_wants_to_emerge: row.emerging_text ?? "",
      symbol_from_today: "", // symbol not stored separately in fallback
      next_courageous_step: row.next_step_text ?? "",
      threshold_statement: row.threshold_statement ?? "",
      mood_tags: Array.isArray(row.mood_tags) ? row.mood_tags : [],
    };
  }

  const language: Language = row.language === "ko" ? "ko" : "en";
  const date: string = row.date;

  return {
    id: `${date}-${language}`,
    date,
    language,
    prompt: {
      theme: row.prompt_theme,
      prompt: row.prompt_text,
      language,
      date,
    },
    userResponse: row.response_text,
    reflection,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

// ─── Async API (Supabase for authed users, localStorage fallback) ─────────────

export async function getStoredLanguageAsync(_uid: string | null): Promise<Language> {
  return getStoredLanguage();
}

export async function setStoredLanguageAsync(
  language: Language,
  _uid: string | null
): Promise<void> {
  setStoredLanguage(language);
}

export async function getCachedPromptAsync(
  date: string,
  language: Language,
  _uid: string | null
): Promise<DailyPrompt | null> {
  return getCachedPrompt(date, language);
}

export async function setCachedPromptAsync(
  prompt: DailyPrompt,
  _uid: string | null
): Promise<void> {
  setCachedPrompt(prompt);
}

export async function getAllEntriesAsync(_uid: string | null): Promise<JournalEntry[]> {
  if (!_uid) return getAllEntries();
  if (typeof window === "undefined") return [];

  const supabase = getSupabaseClient();
  if (!supabase) return getAllEntries();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("date", { ascending: false });

  if (error || !data) {
    console.error("[storage] getAllEntriesAsync error:", error);
    return getAllEntries();
  }

  return (data as any[]).map(rowToJournalEntry);
}

export async function getEntriesForLanguageAsync(
  language: Language,
  uid: string | null
): Promise<JournalEntry[]> {
  if (!uid) return getEntriesForLanguage(language);
  if (typeof window === "undefined") return [];

  const supabase = getSupabaseClient();
  if (!supabase) return getEntriesForLanguage(language);

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("language", language)
    .order("date", { ascending: false });

  if (error || !data) {
    console.error("[storage] getEntriesForLanguageAsync error:", error);
    return getEntriesForLanguage(language);
  }

  return (data as any[]).map(rowToJournalEntry);
}

export async function getEntryByDateAsync(
  date: string,
  language: Language,
  uid: string | null
): Promise<JournalEntry | null> {
  if (!uid) return getEntryByDate(date, language);
  if (typeof window === "undefined") return null;

  const supabase = getSupabaseClient();
  if (!supabase) return getEntryByDate(date, language);

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("date", date)
    .eq("language", language)
    .maybeSingle();

  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      console.error("[storage] getEntryByDateAsync error:", error);
    }
    return getEntryByDate(date, language);
  }

  return rowToJournalEntry(data);
}

export async function saveEntryAsync(
  entry: JournalEntry,
  uid: string | null,
  startDate: string
): Promise<void> {
  // Always keep a local copy for offline access.
  saveEntry(entry);

  if (!uid || typeof window === "undefined") return;

  const supabase = getSupabaseClient();
  if (!supabase) return;

  const programDay = getProgramDayIndex(entry.date, startDate) + 1;
  const base = {
    user_id: uid,
    date: entry.date,
    language: entry.language,
    program_day: programDay,
    prompt_theme: entry.prompt.theme,
    prompt_text: entry.prompt.prompt,
    response_text: entry.userResponse,
  };

  const reflectionCols = reflectionToColumns(entry.reflection);

  const { error } = await supabase
    .from("journal_entries")
    .upsert(
      {
        ...base,
        ...reflectionCols,
      },
      { onConflict: "user_id,date,language" },
    );

  if (error) {
    console.error("[storage] saveEntryAsync upsert error:", error);
    throw new Error(`Failed to save entry to Supabase: ${error.message}`);
  }
}

