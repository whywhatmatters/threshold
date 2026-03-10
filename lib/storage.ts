/**
 * Storage abstraction layer.
 * All persistence currently lives in the browser (localStorage).
 * Async helpers mirror the sync API for convenience.
 */

import type { JournalEntry, Language, DailyPrompt } from "@/types";

const JOURNAL_KEY = "threshold_journal";
// Bump prompt cache prefix so older prompts (including English fallbacks under ko) are not reused.
const PROMPT_KEY_PREFIX = "threshold_prompt_v3";
const LANGUAGE_KEY = "threshold_language";

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

// ─── Async mirrors ────────────────────────────────────────────────────────────

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
  return getAllEntries();
}

export async function getEntriesForLanguageAsync(
  language: Language,
  _uid: string | null
): Promise<JournalEntry[]> {
  return getEntriesForLanguage(language);
}

export async function getEntryByDateAsync(
  date: string,
  language: Language,
  _uid: string | null
): Promise<JournalEntry | null> {
  return getEntryByDate(date, language);
}

export async function saveEntryAsync(
  entry: JournalEntry,
  _uid: string | null
): Promise<void> {
  saveEntry(entry);
}

