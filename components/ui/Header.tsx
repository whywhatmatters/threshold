"use client";

import type { Language } from "@/types";
import { t, formatDate } from "@/lib/i18n";
import { todayKey } from "@/lib/dates";
import styles from "./Header.module.css";

interface Props {
  language: Language;
  userEmail?: string | null;
}

export function Header({ language, userEmail }: Props) {
  const copy = t(language);
  return (
    <header className={styles.header}>
      <span className={`${styles.wordmark} fell`}>{copy.appName}</span>
      <div style={{ textAlign: "right" }}>
        <span className={`${styles.date} eyebrow`}>{formatDate(todayKey(), language)}</span>
        {userEmail && (
          <div className="eyebrow" style={{ marginTop: 4, fontSize: 10 }}>
            {userEmail}
          </div>
        )}
      </div>
    </header>
  );
}
