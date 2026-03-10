import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import styles from "./AboutScreen.module.css";

interface Props {
  language: Language;
}

export function AboutScreen({ language }: Props) {
  const copy = t(language).about;
  const fields = copy.fields;

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

      <p className={`${styles.privacy} serif`}>{copy.privacyNote}</p>
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
