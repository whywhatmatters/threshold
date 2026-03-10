import { z } from "zod";
import type { Reflection, DailyPrompt, CrossingPortrait } from "@/types";

export const ReflectionSchema = z.object({
  border_title:          z.string().min(1),
  today_prompt:          z.string().min(1),
  detected_threshold:    z.string().min(1),
  reflection_summary:    z.string().min(1),
  what_im_leaving:       z.string().min(1),
  what_im_entering:      z.string().min(1),
  what_wants_to_emerge:  z.string().min(1),
  symbol_from_today:     z.string().min(1),
  next_courageous_step:  z.string().min(1),
  threshold_statement:   z.string().min(1),
  mood_tags:             z.array(z.string()).min(1).max(7),
});

export const DailyPromptSchema = z.object({
  theme:  z.string().min(1),
  prompt: z.string().min(1),
});

export const CrossingPortraitSchema = z.object({
  leaving:            z.string().min(1),
  entering:           z.string().min(1),
  symbols_or_patterns:z.string().min(1),
  emerging:           z.string().min(1),
  full_text:          z.string().min(1),
});

function stripFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function attemptRepair(raw: string): string {
  return raw
    .replace(/,\s*([}\]])/g, "$1")       // trailing commas
    .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":'); // unquoted keys
}

export function parseReflection(raw: string): Reflection {
  const cleaned = stripFences(raw);
  try {
    return ReflectionSchema.parse(JSON.parse(cleaned));
  } catch {
    return ReflectionSchema.parse(JSON.parse(attemptRepair(cleaned)));
  }
}

export function parseDailyPrompt(raw: string): Omit<DailyPrompt, "language" | "date"> {
  const cleaned = stripFences(raw);
  try {
    return DailyPromptSchema.parse(JSON.parse(cleaned));
  } catch {
    return DailyPromptSchema.parse(JSON.parse(attemptRepair(cleaned)));
  }
}

export function parseCrossingPortrait(raw: string): CrossingPortrait {
  const cleaned = stripFences(raw);
  try {
    return CrossingPortraitSchema.parse(JSON.parse(cleaned));
  } catch {
    return CrossingPortraitSchema.parse(JSON.parse(attemptRepair(cleaned)));
  }
}

