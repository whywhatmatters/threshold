import styles from "./LoadingDots.module.css";

interface Props {
  message: string;
}

export function LoadingDots({ message }: Props) {
  return (
    <div className="loading-row">
      <span>{message}</span>
      <div className={styles.dots}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}
