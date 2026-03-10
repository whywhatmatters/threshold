import { NextRequest, NextResponse } from "next/server";
import type { Language, PromptRequest, PromptResponse } from "@/types";
import { getBorderCrossingPromptForDate } from "@/lib/journey";

export async function POST(req: NextRequest): Promise<NextResponse<PromptResponse>> {
  let body: PromptRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" } as PromptResponse, { status: 400 });
  }

  const language: Language = body.language === "ko" ? "ko" : "en";
  const date = body.date ?? new Date().toISOString().split("T")[0];

  const { theme, prompt } = getBorderCrossingPromptForDate(language, date);

  return NextResponse.json({
    prompt: { theme, prompt, language, date },
  });
}
