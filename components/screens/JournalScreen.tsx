"use client";

import { useState, useEffect } from "react";
import type { Language, JournalEntry } from "@/types";
import { t } from "@/lib/i18n";
import { getEntriesForLanguage, getEntriesForLanguageAsync } from "@/lib/storage";
import { JournalList } from "@/components/ui/JournalList";
import { JournalDetailModal } from "@/components/ui/JournalDetailModal";
import styles from "./JournalScreen.module.css";

interface Props {
  language: Language;
  uid: string | null;
}

export function JournalScreen({ language, uid }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const copy = t(language).journal;

  useEffect(() => {
    if (uid !== null) {
      getEntriesForLanguageAsync(language, uid).then(setEntries);
    } else {
      setEntries(getEntriesForLanguage(language));
    }
  }, [language, uid]);

  return (
    <div className={styles.screen}>
      <div className="rule" />
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className={`${styles.heading} fell`}>{copy.heading}</h1>

      <JournalList
        entries={entries}
        language={language}
        onSelect={setSelected}
      />

      <JournalDetailModal
        entry={selected}
        language={language}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
