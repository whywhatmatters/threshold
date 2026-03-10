"use client";

import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import { useAuth } from "@/components/providers/AuthProvider";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import styles from "./SettingsScreen.module.css";

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  uid: string | null;
}

export function SettingsScreen({ language, onLanguageChange, uid }: Props) {
  const { signOut } = useAuth();
  const copy = t(language).settings;

  return (
    <div className={styles.screen}>
      <div className="rule" />
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className={`${styles.heading} fell`}>{copy.heading}</h1>

      <div className={styles.row}>
        <div>
          <p className={styles.label}>{copy.languageLabel}</p>
          <p className={`${styles.note} serif`}>{copy.languageNote}</p>
        </div>
        <LanguageToggle current={language} onChange={onLanguageChange} />
      </div>

      {uid && (
        <div className={styles.row} style={{ marginTop: 24 }}>
          <button type="button" className="btn-ghost" onClick={() => signOut()}>
            {copy.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
