"use client";

import { useState } from "react";
import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import styles from "./ResponseForm.module.css";

interface Props {
  language: Language;
  onSubmit: (text: string) => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function ResponseForm({ language, onSubmit, onSkip, disabled }: Props) {
  const [value, setValue] = useState("");
  const copy = t(language).today;

  return (
    <div className={styles.form}>
      <textarea
        className={`${styles.textarea} serif`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={copy.placeholder}
        maxLength={2000}
        rows={6}
        disabled={disabled}
      />
      <p className={styles.hint}>{copy.charHint}</p>
      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={() => value.trim() && onSubmit(value.trim())}
          disabled={!value.trim() || disabled}
        >
          {copy.submitBtn}
        </button>
        <button className="btn-ghost" onClick={onSkip} disabled={disabled}>
          {copy.skipBtn}
        </button>
      </div>
    </div>
  );
}
