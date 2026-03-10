import { NextRequest, NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import type {
  Language,
  CrossingPortraitRequest,
  CrossingPortraitResponse,
} from "@/types";
import { parseCrossingPortrait } from "@/lib/schema";

const CROSSING_PORTRAIT_SYSTEM_EN = `You are a calm reflection writer.

Given journal entries from a 30-day threshold journey, you write a short Crossing Portrait in 4 sentences.

Structure:
1) Sentence 1: what the person seems to be leaving
2) Sentence 2: what the person seems to be entering
3) Sentence 3: recurring symbols, images, or patterns
4) Sentence 4: what seems to be emerging or becoming

Tone:
- calm, spacious, reflective
- poetic but clear
- not therapeutic or clinical
- not dramatic, not generic self-help

Return ONLY raw JSON with no markdown:
{
  "leaving": "",
  "entering": "",
  "symbols_or_patterns": "",
  "emerging": "",
  "full_text": ""
}`;

const CROSSING_PORTRAIT_SYSTEM_KO = `당신은 차분한 성찰 글을 쓰는 사람입니다.

30일 간의 문턱 여정에서 나온 저널과 흔적들을 토대로, 4문장의 Crossing Portrait를 작성합니다.

구조:
1) 1문장: 이 사람이 떠나가는 것으로 보이는 것
2) 2문장: 이 사람이 들어가고 있는 것으로 보이는 것
3) 3문장: 반복해서 등장하는 상징, 이미지, 패턴
4) 4문장: 드러나고 있거나 되어가고 있는 것으로 보이는 것

톤:
- 차분하고 여백이 있는
- 시적일 수 있으나, 뜻이 분명해야 함
- 치료/상담 언어 사용 금지
- 과장하거나 극적으로 쓰지 말 것
- 흔한 자기계발 문구 사용 금지

마크다운 없이 순수 JSON만 반환하세요:
{
  "leaving": "",
  "entering": "",
  "symbols_or_patterns": "",
  "emerging": "",
  "full_text": ""
}`;

function buildUserMessage(body: CrossingPortraitRequest): string {
  const { entries, language } = body;
  const lines: string[] = [];

  lines.push(
    language === "ko"
      ? "다음은 30일 문턱 여정 동안의 저널 발췌입니다."
      : "Here are excerpts from a 30-day threshold journey.",
  );

  for (const entry of entries) {
    lines.push(
      `\n[ENTRY] date=${entry.date}, lang=${entry.language}, theme=${entry.prompt.theme}`,
    );
    lines.push(`prompt: ${entry.prompt.prompt}`);
    lines.push(`user_response: ${entry.userResponse}`);
    lines.push(`border_title: ${entry.reflection.border_title}`);
    lines.push(`what_im_leaving: ${entry.reflection.what_im_leaving}`);
    lines.push(`what_im_entering: ${entry.reflection.what_im_entering}`);
    lines.push(`what_wants_to_emerge: ${entry.reflection.what_wants_to_emerge}`);
    lines.push(`symbol_from_today: ${entry.reflection.symbol_from_today}`);
    lines.push(`next_courageous_step: ${entry.reflection.next_courageous_step}`);
    lines.push(`threshold_statement: ${entry.reflection.threshold_statement}`);
    lines.push(`mood_tags: ${entry.reflection.mood_tags.join(", ")}`);
  }

  lines.push(
    language === "ko"
      ? "\n위 내용을 바탕으로 Crossing Portrait JSON 하나를 생성하세요."
      : "\nUsing the above, generate a single Crossing Portrait JSON object.",
  );

  return lines.join("\n");
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<CrossingPortraitResponse>> {
  let body: CrossingPortraitRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" } as CrossingPortraitResponse,
      { status: 400 },
    );
  }

  const language: Language = body.language === "ko" ? "ko" : "en";

  if (!body.entries || !Array.isArray(body.entries) || body.entries.length === 0) {
    return NextResponse.json(
      { error: "entries_required" } as CrossingPortraitResponse,
      { status: 400 },
    );
  }

  try {
    const raw = await complete({
      system: language === "ko" ? CROSSING_PORTRAIT_SYSTEM_KO : CROSSING_PORTRAIT_SYSTEM_EN,
      userMessage: buildUserMessage(body),
      maxTokens: 600,
    });

    const portrait = parseCrossingPortrait(raw);
    return NextResponse.json({ portrait });
  } catch (err) {
    console.error("[/api/crossing-portrait] failed:", err);
    return NextResponse.json(
      { error: "crossing_portrait_failed" } as CrossingPortraitResponse,
      { status: 500 },
    );
  }
}

