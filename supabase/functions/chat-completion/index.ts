import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Chat completion function started");

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
      temperature = 0.7,
      maxTokens = 1000,
      topP = 1,
      agentId,
      searchThreshold = 0.5
    } = await req.json();

    console.log('Request configuration:', {
      model,
      useKnowledgeBase,
      temperature,
      maxTokens,
      topP,
      agentId,
      searchThreshold,
      messageCount: messages?.length
    });

    const finalMessages = [];

    // Add system prompt if provided
    if (systemPrompt) {
      finalMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Handle knowledge base integration if enabled
    if (useKnowledgeBase && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Initialize OpenAI
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: lastMessage.content,
          model: "text-embedding-ada-002"
        })
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to generate embedding');
      }

      const { data: [{ embedding }] } = await embeddingResponse.json();

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: documents, error: searchError } = await supabase.rpc(
        'match_documents',
        {
          query_embedding: embedding,
          match_threshold: searchThreshold,
          match_count: 5
        }
      );

      if (searchError) throw searchError;

      if (documents?.length > 0) {
        finalMessages.push({
          role: 'system',
          content: `Contexto relevante da base de conhecimento:\n\n${
            documents
              .sort((a, b) => b.similarity - a.similarity)
              .map(doc => doc.content)
              .join('\n\n')
          }\n\nUse estas informações para informar suas respostas quando relevante.`
        });
      }
    }

    // Add user messages
    finalMessages.push(...messages);

    console.log('Sending request to OpenAI with config:', {
      model: model === 'gpt-4o' ? 'gpt-4' : model,
      temperature,
      maxTokens,
      topP,
      messageCount: finalMessages.length
    });

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model === 'gpt-4o' ? 'gpt-4' : model,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP
      })
    });

    if (!completion.ok) {
      throw new Error('Failed to generate completion');
    }

    const completionData = await completion.json();

    return new Response(
      JSON.stringify(completionData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      },
    );

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      },
    );
  }
});