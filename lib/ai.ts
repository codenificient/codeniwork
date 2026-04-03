/**
 * AI client — routes through Ada's Ollama proxy at ingest.afrotomation.com/ai/chat
 * Models available: qwen2.5:7b (best), llama3.2:3b, llama3.2:1b (fastest)
 * OpenAI-compatible response shape returned by the proxy.
 */

const AI_ENDPOINT = (
  process.env.AI_ENDPOINT || 'https://ingest.afrotomation.com/ai/chat'
).trim()

const AI_API_KEY = (
  process.env.AI_API_KEY || process.env.NEXT_PUBLIC_ANALYTICS_API_KEY || 'afro_ck_g7h8i9'
).trim()

// Default model — qwen2.5:7b for structured tasks, llama3.2:1b for speed
const DEFAULT_MODEL = process.env.AI_MODEL || 'qwen2.5:7b'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AiResponse {
  success: boolean
  choices: Array<{
    message: { role: string; content: string }
    finish_reason: string
  }>
  model: string
  usage: { prompt_tokens: number; completion_tokens: number }
}

export async function chatCompletion(
  messages: Message[],
  options: {
    model?: string
    temperature?: number
    max_tokens?: number
  } = {}
): Promise<string> {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_API_KEY,
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI proxy error ${res.status}: ${err}`)
  }

  const data: AiResponse = await res.json()
  if (!data.success || !data.choices?.[0]?.message?.content) {
    throw new Error('AI proxy returned empty response')
  }

  return data.choices[0].message.content
}

/**
 * Helper for JSON-structured responses — prompts the model to return only JSON
 */
export async function jsonCompletion<T = unknown>(
  messages: Message[],
  options: { model?: string; temperature?: number; max_tokens?: number } = {}
): Promise<T> {
  // Append JSON instruction to system message if not already there
  const augmented = messages.map((m, i) => {
    if (i === 0 && m.role === 'system' && !m.content.includes('JSON')) {
      return { ...m, content: m.content + '\n\nReturn ONLY valid JSON. No markdown, no explanation.' }
    }
    return m
  })

  const text = await chatCompletion(augmented, {
    ...options,
    temperature: options.temperature ?? 0.1, // low temp for structured output
  })

  // Strip markdown code fences if model adds them
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
  return JSON.parse(cleaned) as T
}
