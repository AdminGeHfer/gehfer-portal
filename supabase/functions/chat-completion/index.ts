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
    const { messages, model, agentId, useKnowledgeBase, systemPrompt } = await req.json();
    console.log('Processing request:', { model, agentId, useKnowledgeBase, messageCount: messages?.length });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let relevantContext = '';
    
    if (useKnowledgeBase) {
      console.log('Fetching knowledge base context for agent:', agentId);
      
      // Get the last message for context search
      const lastMessage = messages[messages.length - 1];
      
      // Generate embedding for the query
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: lastMessage.content,
        }),
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to generate embedding');
      }

      const { data: [{ embedding }] } = await embeddingResponse.json();

      // Search for relevant documents
      const { data: documents, error: searchError } = await supabase.rpc(
        'match_documents',
        {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 5
        }
      );

      if (searchError) throw searchError;

      if (documents && documents.length > 0) {
        relevantContext = documents
          .map((doc: any) => doc.content)
          .join('\n\n');
        console.log('Found relevant context from knowledge base');
      }
    }

    // Prepare messages array with system prompt and context
    const systemMessage = {
      role: 'system',
      content: `${systemPrompt || 'You are a helpful AI assistant.'}\n\n${
        relevantContext ? `Here is some relevant context from the knowledge base:\n${relevantContext}` : ''
      }`
    };

    const modelMapping: { [key: string]: string } = {
      'gpt-4o': 'gpt-4',
      'gpt-4o-mini': 'gpt-3.5-turbo-16k',
    };

    const openAIModel = modelMapping[model] || 'gpt-3.5-turbo-16k';
    console.log(`Using model: ${model} -> ${openAIModel}`);

    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAIModel,
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!completionResponse.ok) {
      const error = await completionResponse.json();
      console.error('OpenAI Completion Error:', error);
      throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
    }

    const completion = await completionResponse.json();
    console.log('Completion received successfully');

    // Log the interaction
    await supabase
      .from('ai_agent_logs')
      .insert({
        agent_id: agentId,
        event_type: 'chat_completion',
        configuration: {
          model: openAIModel,
          useKnowledgeBase,
          hasContext: !!relevantContext,
        }
      });

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