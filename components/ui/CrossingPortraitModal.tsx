"use client";

import { useState } from "react";
import type { CrossingPortrait, JournalEntry, Language } from "@/types";
import { t } from "@/lib/i18n";
import styles from "./JournalDetailModal.module.css";

interface Props {
  language: Language;
  entries: JournalEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const PORTRAIT_KEY = "threshold_crossing_portrait_latest";

export function CrossingPortraitModal({ language, entries, isOpen, onClose }: Props) {
  const [portrait, setPortrait] = useState<CrossingPortrait | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = t(language);

  if (!isOpen) return null;

  async function generatePortrait() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crossing-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, entries }),
      });
      const data = await res.json();
      if (data.portrait) {
        setPortrait(data.portrait);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            PORTRAIT_KEY,
            JSON.stringify({ createdAt: new Date().toISOString(), portrait: data.portrait }),
          );
        }
      } else {
        setError(data.error ?? "portrait_failed");
      }
    } catch (err) {
      console.error("[CrossingPortraitModal] failed:", err);
      setError("portrait_failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!portrait || typeof navigator === "undefined" || !navigator.clipboard) return;
    const text = portrait.full_text;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  function handleSaveAgain() {
    if (!portrait || typeof window === "undefined") return;
    window.localStorage.setItem(
      PORTRAIT_KEY,
      JSON.stringify({ createdAt: new Date().toISOString(), portrait }),
    );
  }

  function handleStartNewCrossing() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("threshold_journal");
      window.localStorage.removeItem(PORTRAIT_KEY);
      window.localStorage.removeItem("threshold_prompt_v3_en");
      window.localStorage.removeItem("threshold_prompt_v3_ko");
      window.location.reload();
    }
  }

  const hasPortrait = Boolean(portrait);

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet}>
        <div className={styles.sheetHeader}>
          <span className="eyebrow">
            {language === "ko" ? "Crossing Portrait" : "Crossing Portrait"}
          </span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!hasPortrait && !loading && (
          <div>
            <p className="serif" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              {language === "ko"
                ? "30일 동안의 기록을 바탕으로, 지금의 문턱을 요약하는 짧은 초상을 만들어 봅니다."
                : "Using your 30 days of reflections, we’ll create a short portrait of this crossing."}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={generatePortrait}
              disabled={loading}
            >
              {language === "ko" ? "Crossing Portrait 생성하기" : "Generate Crossing Portrait"}
            </button>
          </div>
        )}

        {loading && (
          <p className="serif" style={{ fontSize: 14, lineHeight: 1.7 }}>
            {language === "ko" ? "Crossing Portrait를 준비하고 있습니다..." : "Preparing your Crossing Portrait..."}
          </p>
        )}

        {error && (
          <p className="serif" style={{ fontSize: 13, color: "var(--error)", marginTop: 16 }}>
            {language === "ko"
              ? "지금은 Crossing Portrait를 만들 수 없습니다. 잠시 후 다시 시도해 주세요."
              : "We can’t create your Crossing Portrait right now. Please try again later."}
          </p>
        )}

        {hasPortrait && portrait && (
          <div style={{ marginTop: 16 }}>
            <p className="serif" style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {portrait.full_text}
            </p>

            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" className="btn-ghost" onClick={handleCopy}>
                {language === "ko" ? "Portrait 복사" : "Copy Portrait"}
              </button>
              <button type="button" className="btn-ghost" onClick={handleSaveAgain}>
                {language === "ko" ? "Portrait 저장" : "Save Portrait"}
              </button>
              <button type="button" className="btn-primary" onClick={handleStartNewCrossing}>
                {language === "ko" ? "새로운 Crossing 시작하기" : "Start a New Crossing"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

