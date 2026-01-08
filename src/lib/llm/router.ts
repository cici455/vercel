import { openAICompatChatCompletion, type ChatMessage, LLMHttpError } from "./openaiCompat";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRetryableStatus(s: number) {
  return s === 408 || s === 425 || s === 429 || s === 500 || s === 502 || s === 503 || s === 504;
}

async function callProviderOnce(p: {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  maxTokens: number;
}) {
  try {
    return await openAICompatChatCompletion({
      baseUrl: p.baseUrl,
      apiKey: p.apiKey,
      model: p.model,
      messages: p.messages,
      temperature: 0.6,
      maxTokens: p.maxTokens,
      timeoutMs: 12000,
    });
  } catch (e: any) {
    // 关键：把 provider/model/baseUrl 和错误体头部打出来（不要打 key）
    const status = e?.status ?? e?.statusCode ?? "NA";
    const bodyHead = String(e?.bodyText ?? e?.message ?? "").slice(0, 220);
    console.error(`[LLM][${p.name}] FAIL status=${status} model=${p.model} base=${p.baseUrl} body=${bodyHead}`);
    throw e;
  }
}
export async function generateTextPrimaryFallback(system: string, user: string, maxTokens = 380) {
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];

  const dashKey = process.env.DASHSCOPE_API_KEY;
  const dashBase = process.env.DASHSCOPE_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode";
  const dashModel = process.env.DASHSCOPE_MODEL ?? "qwen-turbo";

  const deepKey = process.env.DEEPSEEK_API_KEY;
  const deepBase = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
  const deepModel = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  // 1) Primary: DashScope/Qwen (retry 1 time on retryable)
  if (dashKey) {
    for (let i = 0; i < 2; i++) {
      try {
        return await callProviderOnce({ 
          name: "dashscope",
          baseUrl: dashBase, 
          apiKey: dashKey, 
          model: dashModel, 
          messages, 
          maxTokens 
        });
      } catch (e: any) {
        if (e instanceof LLMHttpError && isRetryableStatus(e.status) && i === 0) {
          await sleep(350 + Math.floor(Math.random() * 250));
          continue;
        }
        break; // go fallback
      }
    }
  }

  // 2) Fallback: DeepSeek (retry 1 time on retryable)
  if (deepKey) {
    for (let i = 0; i < 2; i++) {
      try {
        return await callProviderOnce({ 
          name: "deepseek",
          baseUrl: deepBase, 
          apiKey: deepKey, 
          model: deepModel, 
          messages, 
          maxTokens 
        });
      } catch (e: any) {
        if (e instanceof LLMHttpError && isRetryableStatus(e.status) && i === 0) {
          await sleep(350 + Math.floor(Math.random() * 250));
          continue;
        }
        throw e;
      }
    }
  }
  throw new Error("No provider configured: DASHSCOPE_API_KEY and DEEPSEEK_API_KEY are both missing.");
}