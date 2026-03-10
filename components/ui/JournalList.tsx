"use client";

import type { JournalEntry, Language } from "@/types";
import { t, formatDateShort } from "@/lib/i18n";
import styles from "./JournalList.module.css";

interface Props {
  entries: JournalEntry[];
  language: Language;
  onSelect: (entry: JournalEntry) => void;
}

export function JournalList({ entries, language, onSelect }: Props) {
  const copy = t(language).journal;

  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>◌</span>
        <p className="serif">{copy.empty}</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {entries.map((entry) => (
        <button
          key={`${entry.date}-${entry.language}`}
          className={styles.entry}
          onClick={() => onSelect(entry)}
        >
          <div className={styles.meta}>
            <span className="eyebrow">{formatDateShort(entry.date, language)}</span>
            <span className={styles.theme}>{entry.prompt.theme}</span>
          </div>
          <p className={`${styles.title} fell`}>{entry.reflection.border_title}</p>
          <p className={`${styles.preview} serif`}>{entry.reflection.threshold_statement || entry.reflection.reflection_summary}</p>
        </button>
      ))}
    </div>
  );
}
