import type { Language } from "@/types";

// All UI copy in one place — no translation layer, each written natively
export const UI = {
  en: {
    appName: "Threshold",
    nav: {
      today: "Today",
      journal: "Journal",
      about: "About",
      settings: "Settings",
    },
    today: {
      eyebrow: "Today's Prompt",
      preparingPrompt: "Preparing your prompt",
      holdingResponse: "Holding what you wrote",
      placeholder: "Write whatever comes. There is no right answer.",
      charHint: "Take your time. A few lines is enough.",
      submitBtn: "Reflect",
      skipBtn: "Not today",
      waitingMessage: "The prompt will be here when you're ready.",
      alreadyReflected: "You've already reflected today.",
      viewJournal: "View journal",
      tryAgain: "Try again",
      errorMessage: "Something shifted in the connection. Your words are safe — please try again.",
    },
    journal: {
      eyebrow: "Your Reflections",
      heading: "The archive",
      empty: "Your reflections will appear here.\nBegin today.",
    },
    about: {
      eyebrow: "What is this",
      heading: "A space for thresholds",
      p1: "Threshold is a daily reflection companion for people who are in between — between roles, places, relationships, identities, or seasons of life.",
      p2: "Each day, one prompt. One response. A small artifact of where you stood.",
      p3: "This is not therapy. Not coaching. Not productivity. It is a practice of noticing.",
      frameworkLabel: "The framework",
      fields: {
        leaving: "What is releasing its hold",
        entering: "What is beginning to take shape",
        emerging: "What wants to be seen",
        symbol: "A concrete image from the day",
        step: "Not a leap. A small, honest move.",
      },
      privacyNote: "Reflections are stored in your browser only. Nothing is sent to any server except the text you write when requesting a reflection.",
    },
    settings: {
      eyebrow: "Preferences",
      heading: "Settings",
      languageLabel: "Language",
      languageNote: "Prompts and reflections will be generated in the selected language.",
      signOut: "Sign out",
    },
    modal: {
      close: "Close",
      yourResponse: "Your response",
    },
    reflection: {
      leaving: "Leaving",
      entering: "Entering",
      emerging: "Emerging",
      step: "Next Step",
      symbol: "Symbol",
    },
  },
  ko: {
    appName: "문턱",
    nav: {
      today: "오늘",
      journal: "기록",
      about: "소개",
      settings: "설정",
    },
    today: {
      eyebrow: "오늘의 질문",
      preparingPrompt: "질문을 준비하고 있습니다",
      holdingResponse: "당신이 쓴 것을 담고 있습니다",
      placeholder: "떠오르는 것을 적어보세요. 정답은 없습니다.",
      charHint: "천천히 하세요. 몇 줄이면 충분합니다.",
      submitBtn: "성찰하기",
      skipBtn: "오늘은 넘기기",
      waitingMessage: "준비가 되면 질문이 여기 있을 것입니다.",
      alreadyReflected: "오늘의 성찰을 이미 완료하셨습니다.",
      viewJournal: "기록 보기",
      tryAgain: "다시 시도",
      errorMessage: "연결에 문제가 생겼습니다. 쓰신 내용은 안전합니다 — 다시 시도해 주세요.",
    },
    journal: {
      eyebrow: "나의 성찰",
      heading: "기록",
      empty: "성찰 기록이 여기 쌓입니다.\n오늘 시작해 보세요.",
    },
    about: {
      eyebrow: "이것은 무엇인가",
      heading: "문턱을 위한 공간",
      p1: "문턱은 사이에 있는 사람들을 위한 일상 성찰 동반자입니다 — 역할, 장소, 관계, 정체성, 또는 삶의 계절 사이에 서 있는 사람들을 위해.",
      p2: "매일 하나의 질문. 하나의 응답. 오늘 내가 서 있던 자리의 작은 기록.",
      p3: "이것은 치료가 아닙니다. 코칭이 아닙니다. 생산성 도구가 아닙니다. 알아차리는 연습입니다.",
      frameworkLabel: "프레임워크",
      fields: {
        leaving: "놓아가고 있는 것",
        entering: "형태를 갖춰가는 것",
        emerging: "보이고 싶어하는 것",
        symbol: "오늘의 구체적인 이미지",
        step: "도약이 아닌. 작고 솔직한 한 걸음.",
      },
      privacyNote: "성찰 기록은 브라우저에만 저장됩니다. 성찰을 요청할 때 작성한 텍스트 외에는 서버로 전송되는 것이 없습니다.",
    },
    settings: {
      eyebrow: "환경 설정",
      heading: "설정",
      languageLabel: "언어",
      languageNote: "선택한 언어로 질문과 성찰이 생성됩니다.",
      signOut: "로그아웃",
    },
    modal: {
      close: "닫기",
      yourResponse: "나의 응답",
    },
    reflection: {
      leaving: "놓아가는 것",
      entering: "들어오는 것",
      emerging: "떠오르는 것",
      step: "다음 걸음",
      symbol: "상징",
    },
  },
} as const;

export type UIKeys = typeof UI;

export function t(language: Language): UIKeys[typeof language] {
  return UI[language];
}

// Locale-aware date formatting
export function formatDate(dateStr: string, language: Language): string {
  const date = new Date(dateStr + "T12:00:00");
  if (language === "ko") {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateStr: string, language: Language): string {
  const date = new Date(dateStr + "T12:00:00");
  if (language === "ko") {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
