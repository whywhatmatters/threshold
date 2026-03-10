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
  getCachedPromptAsync,
  setCachedPromptAsync,
  getEntryByDateAsync,
  saveEntryAsync,
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

export function TodayScreen({ language, idToken, uid }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [showPortraitModal, setShowPortraitModal] = useState(false);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);

  const copy = t(language).today;
  const date = todayKey();
  const useAsync = uid !== null;

  const loadPrompt = useCallback(async () => {
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
        body: JSON.stringify({ language, date }),
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(INTRO_SEEN_KEY);
    if (seen === "1") {
      loadPrompt();
    } else {
      setPhase("intro");
    }
  }, [loadPrompt]);

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
      if (data.reflection) {
        const entry: JournalEntry = {
          id: `${date}-${language}`,
          date,
          language,
          prompt,
          userResponse,
          reflection: data.reflection,
          createdAt: new Date().toISOString(),
        };
        if (useAsync) await saveEntryAsync(entry, uid);
        else saveEntry(entry);
        setAllEntries((prev) => {
          const existing = prev.filter((e) => e.id !== entry.id);
          return [entry, ...existing];
        });
        setReflection(data.reflection);
        setPhase("reflection");
      } else {
        throw new Error(data.error ?? "no reflection returned");
      }
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
      } else {
        loadPrompt();
      }
    }
  }

  function handleBeginDayOne() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INTRO_SEEN_KEY, "1");
    }
    loadPrompt();
  }

  const isDay30 = getProgramDayIndex(date) === 29;

  return (
    <div className={styles.screen}>
      {phase === "intro" ? (
        <>
          <div className="rule" />
          <p className="eyebrow">The Crossing</p>
          <h1 className="fell" style={{ fontSize: 26, marginBottom: 20 }}>
            The Crossing
          </h1>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
            You are about to begin a 30-day reflection journey.
          </p>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
            Each day offers one question. A few lines is enough.
          </p>
          <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            There is no need to finish perfectly. Just return when you can.
          </p>
          <button type="button" className="btn-primary" onClick={handleBeginDayOne}>
            Begin Day 1
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
        isOpen={showPortraitModal}
        onClose={() => setShowPortraitModal(false)}
      />
    </div>
  );
}
