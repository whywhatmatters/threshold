"use client";

import type { JournalEntry, Language } from "@/types";
import { t, formatDate } from "@/lib/i18n";
import { ReflectionCard } from "./ReflectionCard";
import styles from "./JournalDetailModal.module.css";

interface Props {
  entry: JournalEntry | null;
  language: Language;
  onClose: () => void;
}

export function JournalDetailModal({ entry, language, onClose }: Props) {
  if (!entry) return null;
  const copy = t(language);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.sheet}>
        <div className={styles.sheetHeader}>
          <span className="eyebrow">{formatDate(entry.date, language)}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label={copy.modal.close}>✕</button>
        </div>

        {/* Original prompt */}
        <p className={`${styles.promptEcho} serif`}>{entry.prompt.prompt}</p>

        {/* User response */}
        {entry.userResponse && (
          <div className={styles.userResponseBlock}>
            <p className={`${styles.userResponseLabel} eyebrow`}>{copy.modal.yourResponse}</p>
            <p className={`${styles.userResponseText} serif`}>{entry.userResponse}</p>
          </div>
        )}

        <ReflectionCard reflection={entry.reflection} language={language} />
      </div>
    </div>
  );
}
