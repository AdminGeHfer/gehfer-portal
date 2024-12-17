import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { messages, model, agentId, useKnowledgeBase, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    const lastMessage = messages[messages.length - 1].content;
    let relevantContext = '';

    if (useKnowledgeBase) {
      try {
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "text-embedding-ada-002",
            input: lastMessage,
          }),
        });

        if (!embeddingResponse.ok) {
          throw new Error('Failed to generate embedding');
        }

        const embeddingData = await embeddingResponse.json();
        const queryEmbedding = embeddingData.data[0].embedding;

        const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 5
        });

        if (searchError) throw searchError;

        if (documents && documents.length > 0) {
          relevantContext = documents.map(doc => doc.content).join('\n\n');
        }
      } catch (error) {
        console.error('Error in knowledge base search:', error);
      }
    }

    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
          ...(relevantContext ? [{ role: 'system', content: relevantContext }] : []),
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!completionResponse.ok) {
      const error = await completionResponse.json();
      throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await completionResponse.json();

    return new Response(JSON.stringify(completion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});