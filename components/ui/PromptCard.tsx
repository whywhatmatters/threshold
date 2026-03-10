import type { DailyPrompt } from "@/types";
import styles from "./PromptCard.module.css";

interface Props {
  prompt: DailyPrompt;
}

export function PromptCard({ prompt }: Props) {
  return (
    <div className={styles.card}>
      <p className={`${styles.promptText} serif`}>{prompt.prompt}</p>
      <p className={`${styles.theme} eyebrow`}>{prompt.theme}</p>
    </div>
  );
}
