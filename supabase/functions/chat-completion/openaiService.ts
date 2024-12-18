const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

export async function generateEmbedding(text: string) {
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
  return json.data[0].embedding;
}

export async function generateChatCompletion(
  messages: any[],
  model: string,
  temperature = 0.7,
  maxTokens = 1000,
  topP = 1
) {
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