export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class LLMHttpError extends Error {
  status: number;
  bodyText: string;
  constructor(status: number, bodyText: string) {
    super(`LLM HTTP ${status}`);
    this.status = status;
    this.bodyText = bodyText;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function openAICompatChatCompletion(params: {
  baseUrl: string;   // e.g. `https://dashscope.aliyuncs.com/compatible-mode`  OR `https://api.deepseek.com` 
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<string> {
  const url = `${params.baseUrl.replace(/\/$/, "")}/v1/chat/completions`;

  const res = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.6,
        max_tokens: params.maxTokens ?? 380,
      }),
    },
    params.timeoutMs ?? 12000
  );

  const raw = await res.text();

  if (!res.ok) {
    throw new LLMHttpError(res.status, raw);
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Non-JSON response: ${raw.slice(0, 200)}`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Empty completion content");
  }

  return text;
}