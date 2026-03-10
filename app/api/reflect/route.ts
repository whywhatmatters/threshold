import { NextRequest, NextResponse } from "next/server";
import { complete } from "@/lib/anthropic";
import { getReflectionSystem, getReflectionUserMessage } from "@/lib/prompts";
import { parseReflection } from "@/lib/schema";
import type { Language, ReflectRequest, ReflectResponse } from "@/types";
import { MAX_RESPONSE_TOKENS } from "@/lib/config";

export async function POST(req: NextRequest): Promise<NextResponse<ReflectResponse>> {
  let body: ReflectRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" } as ReflectResponse, { status: 400 });
  }

  const language: Language = body.language === "ko" ? "ko" : "en";
  const { prompt, response } = body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "prompt is required" } as ReflectResponse, { status: 400 });
  }
  if (!response || typeof response !== "string" || response.trim().length === 0) {
    return NextResponse.json({ error: "response is required" } as ReflectResponse, { status: 400 });
  }
  if (response.length > 3000) {
    return NextResponse.json({ error: "response too long" } as ReflectResponse, { status: 400 });
  }

  try {
    const raw = await complete({
      system: getReflectionSystem(language),
      userMessage: getReflectionUserMessage(prompt, response, language),
      maxTokens: MAX_RESPONSE_TOKENS,
    });

    const reflection = parseReflection(raw);
    return NextResponse.json({ reflection });
  } catch (err) {
    console.error("[/api/reflect] failed:", err);
    return NextResponse.json(
      { error: "reflection_failed" } as ReflectResponse,
      { status: 500 }
    );
  }
}
