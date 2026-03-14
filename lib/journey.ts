import type { Language } from "@/types";

interface BorderCrossingDay {
  day: number;
  tag: string;
  prompt: string;
}

interface BorderCrossingWeek {
  name: string;
  days: BorderCrossingDay[];
}

// 30-day Border Crossing sequence (English).
// Currently used for the core daily prompts when language === "en".
export const BORDER_CROSSING_WEEKS_EN: BorderCrossingWeek[] = [
  {
    name: "Week 1 — Noticing",
    days: [
      {
        day: 1,
        tag: "todays-border",
        prompt:
          "Where is today’s border in your life right now?\nHow do you know you have arrived there?",
      },
      {
        day: 2,
        tag: "attention",
        prompt:
          "What small detail of your day keeps returning to your awareness, as if it were quietly tracing the outline of today’s border for you?",
      },
      {
        day: 3,
        tag: "what-im-leaving",
        prompt: "What part of your life already feels a little further away than before?",
      },
      {
        day: 4,
        tag: "what-im-entering",
        prompt: "What possibility or way of living seems to be quietly walking alongside you lately?",
      },
      {
        day: 5,
        tag: "symbol",
        prompt:
          "Choose one object, place, or brief scene from today that could be a symbol for where you stand between leaving and entering—what makes it feel fitting for this border?",
      },
      {
        day: 6,
        tag: "ambiguity",
        prompt:
          "Where in your life do you feel most in-between right now, and what do you notice when you simply describe that in-between space without trying to fix it?",
      },
      {
        day: 7,
        tag: "week-reflection",
        prompt:
          "Looking back over this week, what have you started to notice about your own way of meeting borders—do you usually press through, pause, circle around, or something else?",
      },
    ],
  },
  {
    name: "Week 2 — Naming",
    days: [
      {
        day: 8,
        tag: "todays-border",
        prompt:
          "If you were to give today’s border a short name or title, what would you call it, and why does that phrase feel close to the truth?",
      },
      {
        day: 9,
        tag: "what-im-leaving",
        prompt:
          "What could you now honestly write in a sentence beginning with “What I’m leaving is…” even if that sentence still feels tender or incomplete?",
      },
      {
        day: 10,
        tag: "what-im-entering",
        prompt:
          "Finish the sentence “What I’m entering is…” and see what words appear first, before you edit or soften them.",
      },
      {
        day: 11,
        tag: "identity",
        prompt:
          "Which name, role, or description of yourself belongs more to the side of “what I’m leaving,” and which word or phrase belongs more to “what I’m entering”?",
      },
      {
        day: 12,
        tag: "what-wants-to-emerge",
        prompt:
          "If you listen for a moment beneath both leaving and entering, what feels like it wants to emerge that doesn’t fully belong to either old or new?",
      },
      {
        day: 13,
        tag: "symbol",
        prompt:
          "If your current threshold were a single image on a postcard, what scene would it show, and how would that image hint at what is leaving and what is beginning?",
      },
      {
        day: 14,
        tag: "orientation",
        prompt:
          "Imagine you are standing with “what I’m leaving” at your back and “what I’m entering” in front of you—how would you describe the feeling of your body in that position?",
      },
    ],
  },
  {
    name: "Week 3 — Crossing",
    days: [
      {
        day: 15,
        tag: "next-courageous-step",
        prompt:
          "If you set aside any idea of a big transformation, what would count as one small, next courageous step toward what you are entering?",
      },
      {
        day: 16,
        tag: "micro-step",
        prompt:
          "What is the smallest action you could take this week that would gently move you from the side of “thinking about crossing” to the side of “testing the crossing”?",
      },
      {
        day: 17,
        tag: "resistance",
        prompt:
          "Where do you feel the most resistance to taking your next courageous step, and what might that resistance be trying to keep safe on the leaving side of the border?",
      },
      {
        day: 18,
        tag: "support",
        prompt:
          "What kinds of support—inner attitudes, people, or simple structures—would make it just a little easier for you to keep walking across this threshold?",
      },
      {
        day: 19,
        tag: "experiment",
        prompt:
          "What gentle experiment could you try in the coming days that lets you act as if you have already stepped into what you’re entering, without needing to be fully sure yet?",
      },
      {
        day: 20,
        tag: "what-wants-to-emerge",
        prompt:
          "As you picture yourself mid-crossing, what aspect of you seems most eager to emerge if you gave it a bit more room to move and speak?",
      },
      {
        day: 21,
        tag: "boundary",
        prompt:
          "What simple boundary or line—spoken or unspoken—would help clearly mark the difference between what you are choosing to leave and what you are now willing to step toward?",
      },
    ],
  },
  {
    name: "Week 4 — Becoming",
    days: [
      {
        day: 22,
        tag: "becoming",
        prompt:
          "Who are you slowly becoming on the other side of this crossing, and in what small, everyday moments do you already catch glimpses of that person?",
      },
      {
        day: 23,
        tag: "practice",
        prompt:
          "What simple, repeatable practice—something you could actually do in your real life—might help you live in alignment with what you are entering?",
      },
      {
        day: 24,
        tag: "integration",
        prompt:
          "Looking at both “what I’m leaving” and “what I’m entering,” what do you want to consciously carry forward, and what are you ready to let remain on the far side of the border?",
      },
      {
        day: 25,
        tag: "symbol",
        prompt:
          "If you chose one symbol to keep nearby as you continue this transition—a word, object, or image—what would you choose, and how would it remind you of your way of crossing?",
      },
      {
        day: 26,
        tag: "threshold-statement",
        prompt:
          "Write one threshold statement beginning with:\n\n\"I am someone who...\"\n\nLet the sentence hold both what you are leaving and what you are entering.",
      },
      {
        day: 27,
        tag: "next-courageous-step",
        prompt:
          "From where you are today, what is the next courageous step that feels honest and doable—not impressive, just true to your threshold statement?",
      },
      {
        day: 28,
        tag: "relationships",
        prompt:
          "How is this crossing quietly reshaping the way you show up in one everyday relationship, and what small adjustment would help that relationship reflect who you are becoming?",
      },
      {
        day: 29,
        tag: "revisit-todays-border",
        prompt:
          "If you return to the idea of “today’s border” now, how does it look or feel different from the border you described at the start of the month?",
      },
      {
        day: 30,
        tag: "grounded-blessing",
        prompt:
          "Looking ahead, what grounded blessing or wish would you offer yourself as you continue walking beyond this crossing?",
      },
    ],
  },
];

const FLATTENED_EN: BorderCrossingDay[] = BORDER_CROSSING_WEEKS_EN.flatMap((w) => w.days).sort(
  (a, b) => a.day - b.day,
);

// Simple Korean version of the English prompts for now.
// Keeps the same 30-day structure but in Korean.
export const BORDER_CROSSING_WEEKS_KO: BorderCrossingWeek[] = [
  {
    name: "1주차 — 알아차리기",
    days: [
      {
        day: 1,
        tag: "오늘의-경계",
        prompt:
          "오늘 당신의 삶에서 ‘오늘의 경계’는 어디에 있나요?\n그 자리에 도착했다는 것을 어떻게 알 수 있나요?",
      },
      {
        day: 2,
        tag: "주의",
        prompt:
          "오늘 하루 동안 자꾸 다시 떠오르는 작은 장면이나 디테일이 있다면, 그것이 어떻게 오늘의 경계를 조용히 그려 주는 것 같나요?",
      },
      {
        day: 3,
        tag: "떠나가는-것",
        prompt: "요즘 들어 예전보다 이미 조금 더 멀게 느껴지는 삶의 부분이 있다면 무엇인가요?",
      },
      {
        day: 4,
        tag: "들어오는-것",
        prompt: "요즘 조용히 곁을 함께 걷는 것처럼 느껴지는 가능성이나 삶의 방식이 있다면 무엇인가요?",
      },
      {
        day: 5,
        tag: "상징",
        prompt:
          "오늘의 장면, 장소, 혹은 사물 중에서, 떠나가는 것과 들어오는 것 사이에 서 있는 지금의 자리를 상징해 줄 수 있는 것은 무엇인가요?",
      },
      {
        day: 6,
        tag: "모호함",
        prompt:
          "당신의 삶에서 지금 가장 ‘사이’에 있는 느낌이 드는 영역은 어디인가요? 고치려 하지 말고, 그 사이의 공간을 그냥 묘사해 보면 무엇이 보이나요?",
      },
      {
        day: 7,
        tag: "한-주-돌아보기",
        prompt:
          "이번 한 주를 돌아볼 때, 당신이 경계들을 대하는 방식에서 무엇을 새롭게 보게 되었나요? 보통은 밀어붙이나요, 잠시 멈추나요, 돌아서 걸어가나요, 아니면 전혀 다른 방식을 택하나요?",
      },
    ],
  },
  {
    name: "2주차 — 이름 붙이기",
    days: [
      {
        day: 8,
        tag: "오늘의-경계",
        prompt:
          "오늘의 경계에 짧은 제목을 붙인다면 무엇이라고 부르고 싶나요? 그 표현이 진실에 가깝게 느껴지는 이유는 무엇인가요?",
      },
      {
        day: 9,
        tag: "떠나가는-것",
        prompt:
          "“내가 떠나가는 것은…”으로 시작하는 문장을 지금 솔직하게 쓴다면, 어떤 문장이 나올까요? 아직 조금 서툴고 미완성이어도 괜찮습니다.",
      },
      {
        day: 10,
        tag: "들어오는-것",
        prompt:
          "“내가 들어가는 것은…”이라는 문장을 이어 쓸 때, 맨 처음 떠오르는 말들은 무엇인가요? 손대지 않고 그대로 적어 보세요.",
      },
      {
        day: 11,
        tag: "정체성",
        prompt:
          "당신의 이름이나 역할, 자기소개 문장들 중에서, 어느 것은 더 ‘떠나가는 쪽’에 가까운가요? 그리고 어느 말들은 ‘들어오는 쪽’에 더 가깝게 느껴지나요?",
      },
      {
        day: 12,
        tag: "드러나려는-것",
        prompt:
          "떠나가는 것과 들어오는 것 아래를 한동안 가만히 들어 본다면, 둘 중 어디에도 완전히 속하지 않는 채 드러나고 싶어하는 것은 무엇인가요?",
      },
      {
        day: 13,
        tag: "상징",
        prompt:
          "지금의 문턱이 엽서 한 장의 이미지라면, 어떤 장면이 담겨 있을까요? 그 장면이 떠나가는 것과 시작되는 것을 어떻게 동시에 암시하고 있나요?",
      },
      {
        day: 14,
        tag: "방향",
        prompt:
          "“내가 떠나가는 것”을 등 뒤에 두고, “내가 들어가는 것”을 눈앞에 두고 서 있다고 상상해 보세요. 그 자세에 서 있는 몸의 느낌을 어떻게 묘사할 수 있을까요?",
      },
    ],
  },
  {
    name: "3주차 — 건너가기",
    days: [
      {
        day: 15,
        tag: "다음-용기있는-걸음",
        prompt:
          "거창한 변화의 이미지를 잠시 내려놓고 본다면, 지금 당신이 들어가려는 쪽을 향해 내디딜 수 있는 작고 용기 있는 한 걸음은 무엇인가요?",
      },
      {
        day: 16,
        tag: "아주-작은-실천",
        prompt:
          "이번 주에 할 수 있는 행동 중에서, ‘건널까 말까 생각하는 쪽’에서 ‘살짝 건너보는 쪽’으로 옮겨 주는 가장 작은 실천은 무엇일까요?",
      },
      {
        day: 17,
        tag: "저항",
        prompt:
          "다음 용기 있는 걸음을 내디딜 때, 어디에서 가장 큰 저항이 느껴지나요? 그 저항은 떠나가는 쪽에서 무엇을 지키려는 마음일까요?",
      },
      {
        day: 18,
        tag: "지지",
        prompt:
          "어떤 지지들—태도, 사람, 구조—이 조금만 더 있다면, 이 문턱을 건너는 길이 지금보다 약간은 더 수월해질 수 있을까요?",
      },
      {
        day: 19,
        tag: "실험",
        prompt:
          "완전히 확신하지 못한 상태에서도, 이미 들어간 쪽에서 사는 것처럼 가볍게 ‘실험’해 볼 수 있는 일은 무엇인가요?",
      },
      {
        day: 20,
        tag: "드러나려는-것",
        prompt:
          "자신을 건너가는 한가운데에 두고 떠올려 보면, 지금 조금 더 공간과 말을 얻고 싶어하는 당신의 면은 어떤 모습인가요?",
      },
      {
        day: 21,
        tag: "경계선",
        prompt:
          "떠나기로 한 것과 이제는 걸음을 옮기려는 것 사이를 분명하게 나누어 주는, 말로 하거나 마음속으로 긋는 간단한 선은 무엇일까요?",
      },
    ],
  },
  {
    name: "4주차 — 되어가기",
    days: [
      {
        day: 22,
        tag: "되어가기",
        prompt:
          "이 문턱을 건너는 동안, 당신은 천천히 어떤 사람이 되어가고 있나요? 아주 일상적인 순간들 가운데, 그 사람의 모습이 살짝 보이는 장면은 언제인가요?",
      },
      {
        day: 23,
        tag: "연습",
        prompt:
          "당신이 들어가려는 쪽과 더 잘 맞게 살아가도록 도와 줄 수 있는, 실제 삶에서 가능한 간단하고 반복 가능한 연습은 무엇일까요?",
      },
      {
        day: 24,
        tag: "통합",
        prompt:
          "“내가 떠나가는 것”과 “내가 들어가는 것”을 함께 바라볼 때, 무엇은 의식적으로 앞으로 가져가고 싶나요? 그리고 무엇은 저편에 남게 두어도 괜찮을까요?",
      },
      {
        day: 25,
        tag: "상징",
        prompt:
          "이 전환을 계속 걸어가는 동안 곁에 두고 싶은 상징—단어, 물건, 이미지—이 있다면 무엇인가요? 그것이 당신의 건너가는 방식을 어떻게 기억시켜 줄까요?",
      },
      {
        day: 26,
        tag: "문턱-문장",
        prompt:
          "다음 문장으로 시작하는 ‘문턱 문장’을 하나 적어 보세요.\n\n“나는 …하는 사람이다.”\n\n그 문장 안에, 떠나가는 것과 들어가는 것이 함께 담기도록 해 보세요.",
      },
      {
        day: 27,
        tag: "다음-용기있는-걸음",
        prompt:
          "지금 이 자리에서, 인상적이지 않아도 좋으니 당신의 문턱 문장에 솔직하게 어울리는 다음 용기 있는 걸음은 무엇인가요?",
      },
      {
        day: 28,
        tag: "관계",
        prompt:
          "이 건너감이 일상적인 한 관계에서 당신이 서는 방식에 어떤 작은 변화를 만들고 있나요? 그 관계가 되어가는 당신의 모습을 조금 더 반영하도록 돕는 작은 조정은 무엇일까요?",
      },
      {
        day: 29,
        tag: "오늘의-경계-다시보기",
        prompt:
          "이제 다시 “오늘의 경계”를 떠올려 본다면, 이 달의 시작에 묘사했던 경계와 무엇이 달라져 보이나요?",
      },
      {
        day: 30,
        tag: "뿌리내린-축복",
        prompt:
          "앞으로를 바라볼 때, 이 건너감을 계속 이어 가는 자신에게 어떤 뿌리내린 축복이나 소망을 건네고 싶나요?",
      },
    ],
  },
];

const FLATTENED_KO: BorderCrossingDay[] = BORDER_CROSSING_WEEKS_KO.flatMap((w) => w.days).sort(
  (a, b) => a.day - b.day,
);

// Day index is visit-based: 0 = first time user journals, 1 = second, etc.
// Clamped to [0, 29] so day 30 is the permanent final prompt.
export function getBorderCrossingPromptForDay(language: Language, dayIndex: number): {
  theme: string;
  prompt: string;
} {
  const idx = Math.min(Math.max(dayIndex, 0), 29);
  if (language === "ko") {
    const dayKo = FLATTENED_KO[idx] ?? FLATTENED_KO[FLATTENED_KO.length - 1]!;
    return {
      theme: dayKo.tag,
      prompt: dayKo.prompt,
    };
  }

  const day = FLATTENED_EN[idx] ?? FLATTENED_EN[FLATTENED_EN.length - 1]!;
  return {
    theme: day.tag,
    prompt: day.prompt,
  };
}

