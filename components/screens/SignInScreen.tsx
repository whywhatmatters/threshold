"use client";

import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import styles from "./SignInScreen.module.css";

interface Props {
  language: Language;
  onSignIn: () => void;
  loading?: boolean;
  onLanguageChange?: (lang: Language) => void;
}

export function SignInScreen({ language, onSignIn, loading, onLanguageChange }: Props) {
  const copy = t(language);

  return (
    <div className={styles.screen}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div className="rule" />
          <p className="eyebrow">Threshold</p>
        </div>
        {onLanguageChange && (
          <LanguageToggle current={language} onChange={onLanguageChange} />
        )}
      </div>

      <h1 className={`${styles.heading} fell`}>
        {language === "ko" ? "오늘의 문턱과 마주하세요" : "Meet today’s threshold"}
      </h1>
      <p className={`${styles.intro} serif`}>
        {language === "ko"
          ? "로그인하면 성찰 기록과 프롬프트가 기기에 안전하게 저장됩니다."
          : "Sign in to keep your reflections and prompts saved securely."}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className="btn-primary"
          onClick={onSignIn}
          disabled={loading}
        >
          {loading
            ? (language === "ko" ? "연결 중…" : "Connecting…")
            : (language === "ko" ? "Google로 계속하기" : "Continue with Google")}
        </button>
      </div>
    </div>
  );
}
