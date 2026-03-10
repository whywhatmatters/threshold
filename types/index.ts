// ─── Language ──────────────────────────────────────────────────────────────────
export type Language = "en" | "ko";

// ─── Daily Prompt ─────────────────────────────────────────────────────────────
export interface DailyPrompt {
  theme: string;
  prompt: string;
  language: Language;
  date: string; // YYYY-MM-DD
}

// ─── Reflection ───────────────────────────────────────────────────────────────
export interface Reflection {
  border_title: string;
  today_prompt: string;
  detected_threshold: string;
  reflection_summary: string;
  what_im_leaving: string;
  what_im_entering: string;
  what_wants_to_emerge: string;
  symbol_from_today: string;
  next_courageous_step: string;
  threshold_statement: string;
  mood_tags: string[];
}

// ─── Crossing Portrait ────────────────────────────────────────────────────────
export interface CrossingPortrait {
  leaving: string;
  entering: string;
  symbols_or_patterns: string;
  emerging: string;
  full_text: string;
}

// ─── Journal Entry ────────────────────────────────────────────────────────────
export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  language: Language;
  prompt: DailyPrompt;
  userResponse: string;
  reflection: Reflection;
  createdAt: string; // ISO timestamp
}

// ─── API Payloads ─────────────────────────────────────────────────────────────
export interface PromptRequest {
  language: Language;
  date?: string;
}

export interface PromptResponse {
  prompt: DailyPrompt;
  error?: string;
}

export interface ReflectRequest {
  language: Language;
  prompt: string;
  response: string;
}

export interface ReflectResponse {
  reflection: Reflection;
  error?: string;
}

// ─── Crossing Portrait API ────────────────────────────────────────────────────
export interface CrossingPortraitRequest {
  language: Language;
  entries: JournalEntry[];
}

export interface CrossingPortraitResponse {
  portrait: CrossingPortrait;
  error?: string;
}

