import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { findRelevantDocuments } from "./documentService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, agentId } = await req.json();

    // Initialize OpenAI
    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }));

    // Generate embedding for the last user message
    const lastUserMessage = messages[messages.length - 1].content;
    
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: lastUserMessage,
    });

    const embedding = embeddingResponse.data.data[0].embedding;

    // Search for relevant documents
    const { documents, metaKnowledge } = await findRelevantDocuments(
      embedding,
      0.4,
      agentId
    );

    console.log('Search results:', {
      requestId: crypto.randomUUID(),
      documentsFound: documents.length,
      metaKnowledge,
      similarityScores: documents.map(d => d.similarity)
    });

    // Prepare context from relevant documents
    const context = documents
      .map(doc => doc.content)
      .join('\n\n');

    // Add context to system message if documents were found
    if (context) {
      messages.unshift({
        role: 'system',
        content: `Context from knowledge base:\n${context}\n\nRespond based on this context.`
      });
    }

    // Get completion from OpenAI
    const completion = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.7,
    });

    return new Response(
      JSON.stringify(completion.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});