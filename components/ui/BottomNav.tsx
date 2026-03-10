"use client";

import type { Language } from "@/types";
import type { Screen } from "@/app/page";
import { t } from "@/lib/i18n";
import styles from "./BottomNav.module.css";

interface Props {
  current: Screen;
  language: Language;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS: { id: Screen; icon: string }[] = [
  { id: "today",    icon: "◎" },
  { id: "journal",  icon: "◫" },
  { id: "about",    icon: "○" },
  { id: "settings", icon: "◈" },
];

export function BottomNav({ current, language, onNavigate }: Props) {
  const copy = t(language);

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ id, icon }) => (
        <button
          key={id}
          className={`${styles.item} ${current === id ? styles.active : ""}`}
          onClick={() => onNavigate(id)}
          aria-current={current === id ? "page" : undefined}
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{copy.nav[id as keyof typeof copy.nav]}</span>
        </button>
      ))}
    </nav>
  );
}
