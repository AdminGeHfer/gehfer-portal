import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured. Please add it in the Supabase Console under Settings > API Keys.');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const { messages, model, agentId, memory } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    console.log('Processing request with:', { model, agentId });

    // Get agent configuration
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError) {
      console.error('Error fetching agent:', agentError);
      throw agentError;
    }

    console.log('Agent configuration:', agent);

    // Generate embedding for the last user message
    const lastUserMessage = messages[messages.length - 1].content;
    console.log('Processing query:', lastUserMessage);

    try {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: lastUserMessage,
        }),
      });

      if (!embeddingResponse.ok) {
        const error = await embeddingResponse.json();
        console.error('OpenAI Embedding Error:', error);
        throw new Error(`OpenAI Embedding Error: ${error.error?.message || 'Unknown error'}`);
      }

      const embeddingData = await embeddingResponse.json();
      const queryEmbedding = embeddingData.data[0].embedding;

      // Search for relevant chunks
      console.log('Knowledge base enabled, searching for relevant documents...');
      
      const { data: relevantChunks, error: searchError } = await supabase
        .rpc('match_document_chunks', {
          query_embedding: queryEmbedding,
          match_threshold: agent.search_threshold || 0.7,
          match_count: 5
        });

      if (searchError) {
        console.error('Error searching documents:', searchError);
        throw searchError;
      }

      console.log(`Found ${relevantChunks?.length || 0} relevant chunks`);

      // Prepare context from chunks
      let contextText = '';
      if (relevantChunks && relevantChunks.length > 0) {
        contextText = 'Relevant context:\n' + relevantChunks
          .map(chunk => chunk.content)
          .join('\n---\n');
        console.log('Context prepared from chunks:', contextText);
      }

      // Prepare system message
      const systemMessage = {
        role: 'system',
        content: `${agent.system_prompt || 'You are a helpful assistant.'}\n\n${contextText}`
      };

      // Combine messages
      const fullMessages = [systemMessage, ...messages];

      console.log('Sending request to OpenAI with messages:', fullMessages);

      // Get completion from OpenAI
      const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model === 'gpt-4o-mini' ? 'gpt-4' : 'gpt-3.5-turbo',
          messages: fullMessages,
          temperature: agent.temperature || 0.7,
          max_tokens: agent.max_tokens || 4000,
        }),
      });

      if (!completionResponse.ok) {
        const error = await completionResponse.json();
        console.error('OpenAI Completion Error:', error);
        throw new Error(`OpenAI Completion Error: ${error.error?.message || 'Unknown error'}`);
      }

      const completion = await completionResponse.json();

      // Log the interaction
      await supabase.rpc('log_agent_event', {
        p_agent_id: agentId,
        p_conversation_id: memory?.conversationId,
        p_event_type: 'completion',
        p_configuration: {
          model,
          temperature: agent.temperature,
          max_tokens: agent.max_tokens,
          chunks_found: relevantChunks?.length || 0
        },
        p_details: `Query: ${lastUserMessage}\nResponse: ${completion.choices[0].message?.content}`
      });

      return new Response(
        JSON.stringify(completion),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});