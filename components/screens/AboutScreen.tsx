import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import { useAuth } from "@/components/providers/AuthProvider";
import styles from "./AboutScreen.module.css";

interface Props {
  language: Language;
}

export function AboutScreen({ language }: Props) {
  const copy = t(language).about;
  const fields = copy.fields;
  const { user, configured } = useAuth();
  const isSignedIn = configured && Boolean(user);

  return (
    <div className={styles.screen}>
      <div className="rule" />
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className={`${styles.heading} fell`}>{copy.heading}</h1>

      <div className={styles.intro}>
        <p className="serif">{copy.p1}</p>
        <p className="serif">{copy.p2}</p>
        <p className="serif">{copy.p3}</p>
      </div>

      <p className={`${styles.frameworkLabel} eyebrow`}>{copy.frameworkLabel}</p>

      <div className={styles.grid}>
        <FrameBox label={language === "ko" ? "놓아가는 것" : "Leaving"}  value={fields.leaving} />
        <FrameBox label={language === "ko" ? "들어오는 것" : "Entering"} value={fields.entering} />
        <FrameBox label={language === "ko" ? "떠오르는 것" : "Emerging"} value={fields.emerging} />
        <FrameBox label={language === "ko" ? "상징"       : "Symbol"}   value={fields.symbol} />
        <FrameBox label={language === "ko" ? "다음 걸음"  : "Next Step"} value={fields.step} full />
      </div>

      <div className="ornament">· · ·</div>

      <p className={`${styles.privacy} serif`}>
        {isSignedIn
          ? (language === "ko"
              ? "성찰 기록은 계정에 안전하게 저장됩니다. 성찰을 요청할 때 작성한 텍스트가 서버로 전송됩니다."
              : "Reflections are saved securely to your account. The text you write when requesting a reflection is sent to our server.")
          : copy.privacyNote}
      </p>
    </div>
  );
}

function FrameBox({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`${styles.fieldBox} ${full ? styles.full : ""}`}>
      <p className={`${styles.fieldLabel} eyebrow`}>{label}</p>
      <p className={`${styles.fieldValue} serif`}>{value}</p>
    </div>
  );
}
