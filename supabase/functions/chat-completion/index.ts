import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      messages, 
      model, 
      systemPrompt, 
      useKnowledgeBase, 
      temperature,
      maxTokens,
      topP,
      searchThreshold,
      agentId 
    } = await req.json();

    console.log('Chat completion request received:', {
      messageCount: messages.length,
      model,
      agentId,
      useKnowledgeBase,
      searchThreshold
    });

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }));

    let contextualMessages = [...messages];

    // Only search for relevant documents if knowledge base is enabled
    if (useKnowledgeBase && agentId) {
      try {
        console.log('Knowledge base enabled, searching for relevant documents');
        
        // Generate embedding for the last user message
        const lastUserMessage = messages[messages.length - 1].content;
        
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-3-small",
          input: lastUserMessage,
        });

        const embedding = embeddingResponse.data.data[0].embedding;

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        console.log('Searching documents with parameters:', {
          threshold: searchThreshold || 0.4,
          agentId
        });

        // Search for relevant documents using the match_documents function
        const { data: documents, error: searchError } = await supabase.rpc(
          'match_documents',
          {
            query_embedding: embedding,
            match_threshold: searchThreshold || 0.4,
            match_count: 5,
            p_agent_id: agentId
          }
        );

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }

        console.log('Search results:', {
          documentsFound: documents?.length || 0,
          similarityScores: documents?.map(d => d.similarity)
        });

        // Prepare context from relevant documents
        if (documents && documents.length > 0) {
          const context = documents
            .map(doc => doc.content)
            .join('\n\n');

          // Add context to system message
          contextualMessages.unshift({
            role: 'system',
            content: `Context from knowledge base:\n${context}\n\n${systemPrompt || ''}`
          });
        } else {
          console.log('No relevant documents found');
          if (systemPrompt) {
            contextualMessages.unshift({
              role: 'system',
              content: systemPrompt
            });
          }
        }
      } catch (error) {
        console.error('Error in document search:', error);
        // Continue without context if document search fails
        if (systemPrompt) {
          contextualMessages.unshift({
            role: 'system',
            content: systemPrompt
          });
        }
      }
    } else if (systemPrompt) {
      // If no knowledge base but system prompt exists, add it
      contextualMessages.unshift({
        role: 'system',
        content: systemPrompt
      });
    }

    console.log('Sending completion request with message count:', contextualMessages.length);

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