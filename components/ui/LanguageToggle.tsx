"use client";

import type { Language } from "@/types";
import styles from "./LanguageToggle.module.css";

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export function LanguageToggle({ current, onChange }: Props) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.option} ${current === "en" ? styles.active : ""}`}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <span className={styles.divider}>·</span>
      <button
        className={`${styles.option} ${current === "ko" ? styles.active : ""}`}
        onClick={() => onChange("ko")}
      >
        한국어
      </button>
    </div>
  );
}
