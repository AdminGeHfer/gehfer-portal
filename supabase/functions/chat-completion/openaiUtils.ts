export const generateEmbedding = async (openAIApiKey: string, input: string) => {
  console.log('Generating embedding for input:', input.substring(0, 100) + '...');
  
  try {
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
      const errorText = await embeddingResponse.text();
      console.error('Embedding response not ok:', errorText);
      throw new Error(`Failed to generate embedding: ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json();
    console.log('Embedding generated successfully');
    return embeddingData.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

export const getChatCompletion = async (
  openAIApiKey: string, 
  messages: any[], 
  model: string,
  temperature: number = 0.7,
  max_tokens: number = 4000
) => {
  console.log('Getting chat completion with model:', model);
  console.log('Messages count:', messages.length);
  console.log('Temperature:', temperature);
  console.log('Max tokens:', max_tokens);

  try {
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

    const response = await completionResponse.json();
    console.log('Chat completion successful');
    return response;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
};