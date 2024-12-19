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
    const { messages, model, agentId, systemPrompt, useKnowledgeBase, temperature, maxTokens, topP, searchThreshold } = await req.json();

    console.log('Chat completion request received:', {
      messageCount: messages.length,
      model,
      agentId,
      useKnowledgeBase,
      searchThreshold
    });

    // Initialize OpenAI
    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }));

    let contextualMessages = [...messages];

    // Only search for relevant documents if knowledge base is enabled
    if (useKnowledgeBase) {
      try {
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
          searchThreshold || 0.4,
          agentId
        );

        console.log('Search results:', {
          documentsFound: documents.length,
          metaKnowledge,
          similarityScores: documents.map(d => d.similarity)
        });

        // Prepare context from relevant documents
        if (documents.length > 0) {
          const context = documents
            .map(doc => doc.content)
            .join('\n\n');

          // Add context to system message if documents were found
          contextualMessages.unshift({
            role: 'system',
            content: `Context from knowledge base:\n${context}\n\n${systemPrompt || ''}`
          });
        }
      } catch (error) {
        console.error('Error in document search:', error);
        // Continue without context if document search fails
      }
    } else if (systemPrompt) {
      // If no knowledge base but system prompt exists, add it
      contextualMessages.unshift({
        role: 'system',
        content: systemPrompt
      });
    }

    // Get completion from OpenAI
    const completion = await openai.createChatCompletion({
      model: model === 'gpt-4o' ? 'gpt-4' : model,
      messages: contextualMessages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: topP || 1,
    });

    return new Response(
      JSON.stringify(completion.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error in chat completion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});