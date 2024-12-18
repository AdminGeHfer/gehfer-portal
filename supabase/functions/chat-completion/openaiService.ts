import OpenAI from 'openai';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
if (!openAIApiKey) {
  throw new Error('OpenAI API key not configured');
}

const openai = new OpenAI({
  apiKey: openAIApiKey,
});

export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return response.data[0].embedding;
}

export async function generateChatCompletion(messages: any[], model: string = 'gpt-3.5-turbo', temperature: number = 0.7, maxTokens?: number, topP?: number) {
  return await openai.chat.completions.create({
    model: model === 'gpt-4o' ? 'gpt-4' : model,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
  });
}