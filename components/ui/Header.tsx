"use client";

import type { Language } from "@/types";
import { t, formatDate } from "@/lib/i18n";
import { todayKey } from "@/lib/dates";
import styles from "./Header.module.css";

interface Props {
  language: Language;
}

export function Header({ language }: Props) {
  const copy = t(language);
  return (
    <header className={styles.header}>
      <span className={`${styles.wordmark} fell`}>{copy.appName}</span>
      <span className={`${styles.date} eyebrow`}>{formatDate(todayKey(), language)}</span>
    </header>
  );
}
