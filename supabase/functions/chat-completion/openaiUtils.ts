export const generateEmbedding = async (openAIApiKey: string, input: string) => {
  const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input,
    }),
  });

  if (!embeddingResponse.ok) {
    console.error('Embedding response not ok:', await embeddingResponse.text());
    throw new Error('Failed to generate embedding');
  }

  const embeddingData = await embeddingResponse.json();
  return embeddingData.data[0].embedding;
};

export const getChatCompletion = async (
  openAIApiKey: string, 
  messages: any[], 
  model: string,
  temperature: number = 0.7,
  max_tokens: number = 4000
) => {
  const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!completionResponse.ok) {
    const error = await completionResponse.json();
    console.error('OpenAI Completion Error:', error);
    throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
  }

  return completionResponse.json();
};