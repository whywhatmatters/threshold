"use client";

import { useState, useEffect, useCallback } from "react";
import type { Language, DailyPrompt, Reflection, JournalEntry } from "@/types";
import { t } from "@/lib/i18n";
import { todayKey } from "@/lib/dates";
import {
  getCachedPrompt,
  setCachedPrompt,
  getEntryByDate,
  saveEntry,
  getAllEntries,
  getCachedPromptAsync,
  setCachedPromptAsync,
  getEntryByDateAsync,
  saveEntryAsync,
  getAllEntriesAsync,
  getStartDate,
  setStartDate,
} from "@/lib/storage";
import { getProgramDayIndex } from "@/lib/journey";
import { CrossingPortraitModal } from "@/components/ui/CrossingPortraitModal";
import { PromptCard } from "@/components/ui/PromptCard";
import { ResponseForm } from "@/components/ui/ResponseForm";
import { ReflectionCard } from "@/components/ui/ReflectionCard";
import { LoadingDots } from "@/components/ui/LoadingDots";
import styles from "./TodayScreen.module.css";

interface Props {
  language: Language;
  idToken: string | null;
  uid: string | null;
}

type Phase =
  | "intro"
  | "loading-prompt"
  | "prompt"
  | "skipped"
  | "loading-reflection"
  | "reflection"
  | "error";

const INTRO_SEEN_KEY = "threshold_intro_seen";

function makeFallbackReflection(promptText: string, language: Language): Reflection {
  return {
    border_title: "",
    today_prompt: promptText,
    detected_threshold: "",
    reflection_summary: "",
    what_im_leaving: "",
    what_im_entering: "",
    what_wants_to_emerge: "",
    symbol_from_today: "",
    next_courageous_step: "",
    threshold_statement: "",
    mood_tags: [],
  };
}

export function TodayScreen({ language, idToken, uid }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [showPortraitModal, setShowPortraitModal] = useState(false);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  // Start date for the user's personal 30-day program. null = not yet determined.
  const [startDate, setStartDateState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getStartDate();
  });

  const copy = t(language).today;
  const introCopy = t(language).intro;
  const date = todayKey();
  const useAsync = uid !== null;

  // On mount (or uid change): if start date not yet in localStorage, derive it from
  // the earliest journal entry. If no entries exist, use today as the start date.
  // Also loads all entries for the CrossingPortraitModal.
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function initStartDate() {
      let entries: JournalEntry[];
      if (useAsync) {
        entries = await getAllEntriesAsync(uid);
      } else {
        entries = getAllEntries();
      }
      setAllEntries(entries);

      // Only set start date if not already stored.
      if (getStartDate()) return;

      let anchor = date; // default: today
      if (entries.length > 0) {
        // Use the earliest entry's date as the personal anchor.
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        anchor = sorted[0].date;
      }
      setStartDate(anchor);
      setStartDateState(anchor);
    }

    initStartDate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const loadPrompt = useCallback(async (anchor: string) => {
    setPhase("loading-prompt");

    const existing = useAsync
      ? await getEntryByDateAsync(date, language, uid)
      : getEntryByDate(date, language);
    if (existing) {
      setPrompt(existing.prompt);
      setReflection(existing.reflection);
      setPhase("reflection");
      return;
    }

    const cached = useAsync
      ? await getCachedPromptAsync(date, language, uid)
      : getCachedPrompt(date, language);
    if (cached) {
      setPrompt(cached);
      setPhase("prompt");
      return;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers,
        body: JSON.stringify({ language, date, startDate: anchor }),
      });
      const data = await res.json();
      if (data.prompt) {
        if (useAsync) await setCachedPromptAsync(data.prompt, uid);
        else setCachedPrompt(data.prompt);
        setPrompt(data.prompt);
        setPhase("prompt");
      } else {
        throw new Error(data.error ?? "no prompt returned");
      }
    } catch (err) {
      console.error("[TodayScreen] prompt fetch failed:", err);
      setErrorMsg(copy.errorMessage);
      setPhase("error");
    }
  }, [language, date, copy.errorMessage, useAsync, uid, idToken]);

  // Fire loadPrompt once startDate is known (and intro has been seen).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (startDate === null) return; // wait until start date is resolved
    const seen = window.localStorage.getItem(INTRO_SEEN_KEY);
    if (seen === "1") {
      loadPrompt(startDate);
    } else {
      setPhase("intro");
    }
  }, [startDate, loadPrompt]);

  async function handleSubmit(userResponse: string) {
    if (!prompt) return;
    setLastResponse(userResponse);
    setPhase("loading-reflection");

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers,
        body: JSON.stringify({ language, prompt: prompt.prompt, response: userResponse }),
      });
      const data = await res.json();
      const reflectionResult = data.reflection ?? makeFallbackReflection(prompt.prompt, language);
      const entry: JournalEntry = {
        id: `${date}-${language}`,
        date,
        language,
        prompt,
        userResponse,
        reflection: reflectionResult,
        createdAt: new Date().toISOString(),
      };

      // Save locally first (always succeeds), then sync to Supabase separately
      // so a Supabase failure never blocks the user from seeing their reflection.
      if (useAsync) {
        saveEntryAsync(entry, uid, startDate ?? date).catch((err) => {
          console.error("[TodayScreen] Supabase save failed:", err);
        });
      } else {
        saveEntry(entry);
      }

      setAllEntries((prev) => {
        const existing = prev.filter((e) => e.id !== entry.id);
        return [entry, ...existing];
      });
      setReflection(reflectionResult);

      if (!data.reflection) {
        throw new Error(data.error ?? "no reflection returned");
      }

      setPhase("reflection");
    } catch (err) {
      console.error("[TodayScreen] reflect fetch failed:", err);
      setErrorMsg(copy.errorMessage);
      setPhase("error");
    }
  }

  function handleSkip() {
    setPhase("skipped");
  }

  function handleRetry() {
    if (phase === "error" && !reflection) {
      if (lastResponse && prompt) {
        // Retry reflection
        handleSubmit(lastResponse);
      } else if (startDate) {
        loadPrompt(startDate);
      }
    }
  }

  function handleBeginDayOne() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INTRO_SEEN_KEY, "1");
      // Set start date to today when the user explicitly begins the program.
      const anchor = date;
      setStartDate(anchor);
      setStartDateState(anchor);
      loadPrompt(anchor);
    }
  }

  const isDay30 = startDate !== null && getProgramDayIndex(date, startDate) === 29;

  return (
    <div className={styles.screen}>
      {phase === "intro" ? (
        <>
          <div className="rule" />
          {introCopy.eyebrow && <p className="eyebrow">{introCopy.eyebrow}</p>}
          <h1 className="fell" style={{ fontSize: 26, marginBottom: 20 }}>
            {introCopy.title}
          </h1>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
            {introCopy.line1}
          </p>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
            {introCopy.line2}
          </p>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            {introCopy.line3}
          </p>
          <button type="button" className="btn-primary" onClick={handleBeginDayOne}>
            {introCopy.cta}
          </button>
        </>
      ) : (
        <>
          <div className="rule" />
          <p className="eyebrow">{copy.eyebrow}</p>

          {phase === "loading-prompt" && (
            <LoadingDots message={copy.preparingPrompt} />
          )}

          {(phase === "prompt" || phase === "loading-reflection") && prompt && (
            <>
              <PromptCard prompt={prompt} />
              {phase === "prompt" && (
                <ResponseForm
                  language={language}
                  onSubmit={handleSubmit}
                  onSkip={handleSkip}
                />
              )}
              {phase === "loading-reflection" && (
                <LoadingDots message={copy.holdingResponse} />
              )}
            </>
          )}

          {phase === "skipped" && (
            <p className={`${styles.waitingMsg} serif`}>{copy.waitingMessage}</p>
          )}

          {phase === "reflection" && reflection && prompt && (
            <>
              <PromptCard prompt={prompt} />
              <ReflectionCard reflection={reflection} language={language} />
              {isDay30 && (
                <div style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowPortraitModal(true)}
                  >
                    {language === "ko"
                      ? "나의 Crossing Portrait 만들기"
                      : "Create my Crossing Portrait"}
                  </button>
                </div>
              )}
            </>
          )}

          {phase === "error" && (
            <div>
              <div className="error-block">{errorMsg}</div>
              <button className="btn-ghost" onClick={handleRetry}>{copy.tryAgain}</button>
            </div>
          )}
        </>
      )}
      <CrossingPortraitModal
        language={language}
        entries={allEntries}
        uid={uid}
        isOpen={showPortraitModal}
        onClose={() => setShowPortraitModal(false)}
        onReset={() => {
          setAllEntries([]);
          setPhase("loading-prompt");
          if (startDate) loadPrompt(startDate);
        }}
      />
    </div>
  );
}
