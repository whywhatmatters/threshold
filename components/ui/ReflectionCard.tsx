import type { Reflection, Language } from "@/types";
import { t } from "@/lib/i18n";
import styles from "./ReflectionCard.module.css";

interface Props {
  reflection: Reflection;
  language: Language;
}

export function ReflectionCard({ reflection: r, language }: Props) {
  const copy = t(language).reflection;

  return (
    <div className={`${styles.wrapper} animate-fade-up`}>
      {/* Main card */}
      <div className={styles.card}>
        <p className={`${styles.borderTitle} fell`}>{r.border_title}</p>
        <p className={`${styles.detectedThreshold} serif`}>{r.detected_threshold}</p>
        <p className={`${styles.summary} serif`}>{r.reflection_summary}</p>
        {r.threshold_statement && (
          <p className={styles.statement}>&ldquo;{r.threshold_statement}&rdquo;</p>
        )}
      </div>

      {/* Fields grid */}
      <div className={styles.grid}>
        <FieldBox label={copy.leaving}  value={r.what_im_leaving} />
        <FieldBox label={copy.entering} value={r.what_im_entering} />
        <FieldBox label={copy.emerging} value={r.what_wants_to_emerge} />
        <FieldBox label={copy.step}     value={r.next_courageous_step} />
      </div>

      {/* Symbol */}
      {r.symbol_from_today && (
        <div className={styles.symbolBox}>
          <span className={styles.symbolIcon}>◈</span>
          <span className={`${styles.symbolText} serif`}>{r.symbol_from_today}</span>
        </div>
      )}

      {/* Mood tags */}
      {r.mood_tags?.length > 0 && (
        <div className={styles.tags}>
          {r.mood_tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      <div className="ornament">· · ·</div>
    </div>
  );
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fieldBox}>
      <p className={`${styles.fieldLabel} eyebrow`}>{label}</p>
      <p className={`${styles.fieldValue} serif`}>{value || "—"}</p>
    </div>
  );
}
