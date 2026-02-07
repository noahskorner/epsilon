import { createOllama } from 'ollama-ai-provider-v2';
import { ENV } from 'environment';
import { consumeStream, convertToModelMessages, streamText, UIMessage } from 'ai';

export const maxDuration = 30;
// Recommended for local Ollama usage (avoid Edge runtime constraints):
export const runtime = 'nodejs';

const ollama = createOllama({
  baseURL: ENV.OLLAMA_BASE_URL, // e.g. "http://127.0.0.1:11434/api"
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: ollama(ENV.OLLAMA_MODEL),
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) console.log('Aborted');
    },
    // Required for correct abort handling in UI message streams
    consumeSseStream: consumeStream,
  });
}
