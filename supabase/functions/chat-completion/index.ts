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
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { messages, model, agentId, useKnowledgeBase, systemPrompt } = await req.json();
    console.log('Request received:', { 
      model, 
      agentId, 
      useKnowledgeBase, 
      messageCount: messages?.length,
      systemPrompt: systemPrompt ? 'present' : 'absent'
    });

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format');
      throw new Error('Invalid messages format');
    }

    const lastMessage = messages[messages.length - 1].content;
    let relevantContext = '';

    if (useKnowledgeBase) {
      console.log('Knowledge base is enabled, generating embedding...');
      
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
          console.error('Embedding response not ok:', await embeddingResponse.text());
          throw new Error('Failed to generate embedding');
        }

        const embeddingData = await embeddingResponse.json();
        const queryEmbedding = embeddingData.data[0].embedding;

        console.log('Embedding generated successfully:', {
          dimensions: queryEmbedding.length,
          firstValues: queryEmbedding.slice(0, 3),
          norm: Math.sqrt(queryEmbedding.reduce((sum: number, val: number) => sum + val * val, 0))
        });

        // Buscar documentos com threshold inicial
        const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 5
        });

        if (searchError) {
          console.error('Error searching documents:', searchError);
          throw searchError;
        }

        console.log('Search results:', {
          documentsFound: documents?.length || 0,
          similarities: documents?.map(d => d.similarity) || []
        });
        
        if (documents && documents.length > 0) {
          relevantContext = `Relevant information from knowledge base:\n${documents.map(doc => doc.content).join('\n\n')}`;
          console.log('Context length:', relevantContext.length);
        } else {
          console.log('No relevant documents found');
        }
      } catch (error) {
        console.error('Error in knowledge base search:', error);
      }
    }

    console.log('Making completion request with model:', model);

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
      console.error('OpenAI Completion Error:', error);
      throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await completionResponse.json();
    console.log('Completion received successfully');

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