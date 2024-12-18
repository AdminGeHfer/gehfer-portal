/* @ai-optimized
 * version: "2.0"
 * last-update: "2024-03-19"
 * features: ["openai-integration", "error-handling"]
 * checksum: "9a8b7c6d5e"
 */

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

export async function generateEmbedding(text: string) {
  console.log('Generating embedding for text');
  
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002'
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const json = await response.json();
  console.log('Embedding generated successfully');
  return json.data[0].embedding;
}

export async function generateChatCompletion(
  messages: any[],
  model: string,
  temperature = 0.7,
  maxTokens = 1000,
  topP = 1
) {
  console.log('Generating chat completion with config:', {
    model,
    temperature,
    maxTokens,
    topP,
    messageCount: messages.length
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model === 'gpt-4o' ? 'gpt-4' : model,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return response.json();
}