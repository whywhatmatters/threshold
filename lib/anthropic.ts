import Anthropic from "@anthropic-ai/sdk";
import { AI_MODEL } from "./config";

// Singleton client — instantiated once on the server
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CompletionOptions {
  system: string;
  userMessage: string;
  maxTokens: number;
}

/**
 * Calls the model and returns the raw text response.
 * Throws if the API call itself fails.
 */
export async function complete(options: CompletionOptions): Promise<string> {
  const { system, userMessage, maxTokens } = options;

  const message = await client.messages.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in model response");
  }

  return textBlock.text;
}
